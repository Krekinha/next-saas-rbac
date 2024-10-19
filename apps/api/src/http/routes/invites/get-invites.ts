import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { roleSchema } from "@saas/auth";
import { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { UnauthorizedError } from "../_errors/unauthorized-error";

export async function getInvites(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.get(
			"/organizations/:slug/invites",
			{
				schema: {
					tags: ["invites"],
					summary: "Get all organization invites",
					security: [{ bearerAuth: [] }],
					params: z.object({
						slug: z.string(),
					}),
					response: {
						200: z.object({
							invites: z.array(
								z.object({
									id: z.string().uuid(),
									email: z.string().email(),
									role: roleSchema,
									createdAt: z.date(),
									author: z
										.object({
											id: z.string().uuid(),
											name: z.string().nullable(),
										})
										.nullable(),
								}),
							),
						}),
					},
				},
			},
			async (request) => {
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
				 * 3. Verifica se o usuário tem permissão para listar os convites
				 */
				if (permissions.cannot("get", "Invite")) {
					throw new UnauthorizedError(
						"You are not allowed to get organization invites",
					);
				}

				/*
				 * 4. Obtem todos os convites da organização
				 */
				const invites = await prisma.invite.findMany({
					where: {
						organizationId: organization.id,
					},
					select: {
						id: true,
						email: true,
						role: true,
						createdAt: true,
						author: {
							select: {
								id: true,
								name: true,
							},
						},
					},
					orderBy: {
						createdAt: "desc",
					},
				});

				return { invites };
			},
		);
}
