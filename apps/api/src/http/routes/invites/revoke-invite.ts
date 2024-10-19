import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { BadRequestError } from "../_errors/bad-request-error";
import { UnauthorizedError } from "../_errors/unauthorized-error";

export async function revokeInvite(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.delete(
			"/organizations/:slug/invites/:inviteId",
			{
				schema: {
					tags: ["invites"],
					summary: "Revoke an invite",
					security: [{ bearerAuth: [] }],
					params: z.object({
						slug: z.string(),
						inviteId: z.string().uuid(),
					}),
					response: {
						204: z.null(),
					},
				},
			},
			async (request, reply) => {
				const { slug, inviteId } = request.params;

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
				 * 3. Verifica se o usuário tem permissão para deletar um convite
				 */
				if (permissions.cannot("delete", "Invite")) {
					throw new UnauthorizedError(
						"You are not allowed to delete an invite",
					);
				}

				/*
				 * 4. Verifica se o convite existe
				 */
				const invite = await prisma.invite.findUnique({
					where: {
						id: inviteId,
						organizationId: organization.id,
					},
				});

				if (!invite) {
					throw new BadRequestError("Invite not found");
				}

				/*
				 * 5. Deleta o convite
				 */
				await prisma.invite.delete({ where: { id: inviteId } });

				return reply.status(204).send();
			},
		);
}
