import { prisma } from "@/lib/prisma";
import { env } from "@saas/env";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { BadRequestError } from "../_errors/bad-request-error";

export async function authenticateWithGithub(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/sessions/github",
		{
			schema: {
				tags: ["auth"],
				summary: "Authenticate with Github",
				body: z.object({
					code: z.string(),
				}),
				response: {
					201: z.object({
						token: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { code } = request.body;

			/*
			 * 1. Monta a URL que retornará o access token do Github
			 */
			const githubOAuthUrl = new URL(
				"https://github.com/login/oauth/access_token",
			);

			githubOAuthUrl.searchParams.set("client_id", env.GITHUB_OAUTH_CLIENT_ID);
			githubOAuthUrl.searchParams.set(
				"client_secret",
				env.GITHUB_OAUTH_CLIENT_SECRET,
			);
			githubOAuthUrl.searchParams.set(
				"redirect_uri",
				env.GITHUB_OAUTH_REDIRECT_URL,
			);
			githubOAuthUrl.searchParams.set("code", code);

			const githubAccessTokenResponse = await fetch(githubOAuthUrl, {
				method: "POST",
				headers: {
					Accept: "application/json",
				},
			});

			const githubAccessTokenData = await githubAccessTokenResponse.json();

			const { access_token } = z
				.object({
					access_token: z.string(),
					token_type: z.literal("bearer"),
					scope: z.string(),
				})
				.parse(githubAccessTokenData);

			/*
			 * 2. Obtém os dados do usuário do Github usando o access token
			 */
			const githubUserResponse = await fetch("https://api.github.com/user", {
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
			});

			const githubUser = await githubUserResponse.json();

			console.log(githubUser);

			const {
				id: githubId,
				avatar_url,
				name,
				email,
			} = z
				.object({
					id: z.number().int().transform(String),
					avatar_url: z.string().url(),
					name: z.string().nullable(),
					email: z.string().nullable(),
				})
				.parse(githubUser);

			/*
			 * 3. Verifica se o usuário do Github tem um email
			 */
			if (email === null || email === undefined) {
				console.log("Email: ", email);
				throw new BadRequestError(
					"Your Github account must have an email to authenticate.",
				);
			}

			/*
			 * 4. Verifica se o usuário já existe no banco de dados
			 */
			let user = await prisma.user.findUnique({
				where: {
					email,
				},
			});

			/*
			 * 5. Cria o usuário no banco de dados se ele não existir
			 */
			if (!user) {
				user = await prisma.user.create({
					data: {
						name,
						email,
						avatarUrl: avatar_url,
					},
				});
			}

			/*
			 * 6. Verifica se o usuário já tem uma conta no banco de dados
			 */
			let account = await prisma.account.findUnique({
				where: {
					provider_userId: {
						provider: "GITHUB",
						userId: user.id,
					},
				},
			});

			/*
			 * 7. Cria a conta no banco de dados se ela não existir
			 */
			if (!account) {
				account = await prisma.account.create({
					data: {
						userId: user.id,
						provider: "GITHUB",
						providerAccountId: githubId,
					},
				});
			}

			/*
			 * 8. Gera o token de autenticação
			 */
			const token = await reply.jwtSign(
				{
					sub: user.id,
				},
				{
					sign: {
						expiresIn: "7d",
					},
				},
			);

			return reply.status(201).send({
				token,
			});
		},
	);
}

// https://github.com/login/oauth/authorize?client_id=Ov23liDgGXvdgMQqdz7l&redirect_uri=http://localhost:3000/api/auth/callback&scope=user:email
