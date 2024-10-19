import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { BadRequestError } from "../_errors/bad-request-error";

export async function createAccount(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/users",
		{
			schema: {
				tags: ["auth"],
				summary: "Create a new account",
				body: z.object({
					name: z.string(),
					email: z.string().email(),
					password: z.string().min(6),
				}),
			},
		},
		async (request, reply) => {
			const { name, email, password } = request.body;

			/*
			 * Verifica se o usuário já existe
			 */
			const userWithSameEmail = await prisma.user.findUnique({
				where: {
					email,
				},
			});

			if (userWithSameEmail) {
				throw new BadRequestError("User already exists");
			}

			const [, domain] = email.split("@");

			/*
			 * Verifica se o domínio usado para o cadastro do usuário, possui uma organização
			 * e se a mesma deve ou não adicionar os usuários por domínio a essa organização
			 */
			const autoJoinOrganization = await prisma.organization.findFirst({
				where: {
					domain,
					shouldAttachUsersByDomain: true,
				},
			});

			const hashedPassword = await hash(password, 6);

			await prisma.user.create({
				data: {
					name,
					email,
					passwordHash: hashedPassword,
					member_on: autoJoinOrganization
						? {
								create: {
									organizationId: autoJoinOrganization.id,
								},
							}
						: undefined,
				},
			});

			return reply.status(201).send();
		},
	);
}
