import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { roleSchema } from "@saas/auth";
import { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { UnauthorizedError } from "../_errors/unauthorized-error";

export async function getMembers(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.get(
			"/organizations/:orgSlug/members",
			{
				schema: {
					tags: ["members"],
					summary: "Get all organization members",
					security: [{ bearerAuth: [] }],
					params: z.object({
						orgSlug: z.string(),
					}),
					response: {
						200: z.object({
							members: z.array(
								z.object({
									id: z.string().uuid(),
									userId: z.string().uuid(),
									name: z.string().nullable(),
									email: z.string().email(),
									avatarUrl: z.string().url().nullable(),
									role: roleSchema,
								}),
							),
						}),
					},
				},
			},
			async (request, reply) => {
				const { orgSlug } = request.params;

				/*
				 * 1. Obtem o id do usuário, a organização e
				 * os dados como membro desta organização
				 */
				const userId = await request.getCurrentUserId();
				const { organization, membership } =
					await request.getUserMembership(orgSlug);

				/*
				 * 2. Obtem as permissões do usuário
				 */
				const permissions = getUserPermissions(userId, membership.role);

				/*
				 * 3. Verifica se o usuário tem permissão para obter detalhes de um projeto
				 */
				if (permissions.cannot("get", "User")) {
					throw new UnauthorizedError(
						"You are not allowed to see organization members",
					);
				}

				/*
				 * 4. Verifica se o projeto existe e pertence a organização do usuário
				 */
				const members = await prisma.member.findMany({
					where: {
						organizationId: organization.id,
					},
					select: {
						id: true,
						role: true,
						user: {
							select: {
								id: true,
								name: true,
								email: true,
								avatarUrl: true,
							},
						},
					},
					orderBy: {
						role: "asc",
					},
				});

				const membersWithRoles = members.map(
					({ user: { id: userId, ...user }, ...member }) => ({
						userId,
						...user,
						...member,
					}),
				);

				return reply.send({ members: membersWithRoles });
			},
		);
}
