import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { roleSchema } from "@saas/auth";
import { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { UnauthorizedError } from "../_errors/unauthorized-error";

export async function updateMember(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.put(
			"/organizations/:orgSlug/members/:memberId",
			{
				schema: {
					tags: ["members"],
					summary: "Update member role",
					security: [{ bearerAuth: [] }],
					params: z.object({
						orgSlug: z.string(),
						memberId: z.string().uuid(),
					}),
					body: z.object({
						role: roleSchema,
					}),
					response: {
						204: z.null(),
					},
				},
			},
			async (request, reply) => {
				const { orgSlug, memberId } = request.params;

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
				 * 3. Verifica se o usuário tem permissão para atualizar o cargo de um membro
				 */
				if (permissions.cannot("update", "User")) {
					throw new UnauthorizedError(
						"You are not allowed to update this member",
					);
				}

				const { role } = request.body;

				/*
				 * 4. Atualiza a role do membro
				 */
				await prisma.member.update({
					where: {
						id: memberId,
						organizationId: organization.id,
					},
					data: {
						role,
					},
				});

				return reply.status(204).send();
			},
		);
}
