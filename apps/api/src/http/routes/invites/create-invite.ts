import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { roleSchema } from "@saas/auth";
import { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { BadRequestError } from "../_errors/bad-request-error";
import { UnauthorizedError } from "../_errors/unauthorized-error";

export async function createInvite(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.post(
			"/organizations/:slug/invites",
			{
				schema: {
					tags: ["invites"],
					summary: "Create a new invite",
					security: [{ bearerAuth: [] }],
					params: z.object({
						slug: z.string(),
					}),
					body: z.object({
						email: z.string().email(),
						role: roleSchema,
					}),
					response: {
						201: z.object({
							inviteId: z.string().uuid(),
						}),
					},
				},
			},
			async (request, reply) => {
				const { slug } = request.params;

				/*
				 * 1. Obtem o id do usuário, a organização e
				 * os dados como membro desta organização
				 */
				const userId = await request.getCurrentUserId();
				const { organization, membership } =
					await request.getUserMembership(slug);

				/*
				 * 2. Obtem as permissões do usuário
				 */
				const permissions = getUserPermissions(userId, membership.role);

				/*
				 * 3. Verifica se o usuário tem permissão para criar um novo convite
				 */
				if (permissions.cannot("create", "Invite")) {
					throw new UnauthorizedError(
						"You are not allowed to create a new invite",
					);
				}

				const { email, role } = request.body;

				const [_, domain] = email;

				/**
				 * 4. Não permite criar um convite para um usuário que já possui um domínio
				 * igual ao da organização, pois ele já será automaticamente adicionado à
				 * organização ao fazer login
				 */
				if (
					organization.shouldAttachUsersByDomain &&
					organization.domain === domain
				) {
					throw new BadRequestError(
						`Users with "${domain}" domain will join your organization automatically on login`,
					);
				}

				/**
				 * 5. Verifica se já existe um convite com o mesmo email
				 */
				const inviteWithSameEmail = await prisma.invite.findUnique({
					where: {
						email_organizationId: {
							email,
							organizationId: organization.id,
						},
					},
				});

				if (inviteWithSameEmail) {
					throw new BadRequestError(
						"Another invite with this email already exists",
					);
				}

				/**
				 * 6. Verifica se já existe um membro com o mesmo email
				 */
				const memberWithSameEmail = await prisma.member.findFirst({
					where: {
						organizationId: organization.id,
						user: {
							email,
						},
					},
				});

				if (memberWithSameEmail) {
					throw new BadRequestError(
						"A member with this email already belongs to this organization",
					);
				}

				/*
				 * 4. Cria um novo convite
				 */
				const invite = await prisma.invite.create({
					data: {
						email,
						role,
						authorId: userId,
						organizationId: organization.id,
					},
				});

				return reply.status(201).send({
					inviteId: invite.id,
				});
			},
		);
}
