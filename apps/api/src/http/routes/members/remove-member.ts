import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { UnauthorizedError } from "../_errors/unauthorized-error";

export async function removeMember(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.delete(
			"/organizations/:orgSlug/members/:memberId",
			{
				schema: {
					tags: ["members"],
					summary: "Remove member from this organization",
					security: [{ bearerAuth: [] }],
					params: z.object({
						orgSlug: z.string(),
						memberId: z.string().uuid(),
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
				if (permissions.cannot("delete", "User")) {
					throw new UnauthorizedError(
						"You are not allowed to remove this member",
					);
				}

				/*
				 * 4. Remove o membro da organização
				 */
				await prisma.member.delete({
					where: {
						id: memberId,
						organizationId: organization.id,
					},
				});

				return reply.status(204).send();
			},
		);
}
