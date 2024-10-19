import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { organizationSchema } from "@saas/auth";
import { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { UnauthorizedError } from "../_errors/unauthorized-error";

export async function shutdownOrganization(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.delete(
			"/organizations/:slug",
			{
				schema: {
					tags: ["organizations"],
					summary: "Shutdown organization",
					security: [{ bearerAuth: [] }],
					params: z.object({
						slug: z.string(),
					}),
					response: {
						204: z.null(),
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
				const { membership, organization } =
					await request.getUserMembership(slug);

				/*
				 * 2. Cria uma organização seguindo o schema de
				 * organização definido no módulo auth para ser
				 * usado na verificação de permissões
				 */
				const authOrganization = organizationSchema.parse(organization);

				/*
				 * 3. Obtem as permissões do usuário
				 */
				const permissions = getUserPermissions(userId, membership.role);

				console.log({ permissions });

				/*
				 * 4. Verifica se o usuário tem permissão para atualizar a organização
				 */
				if (permissions.cannot("delete", authOrganization)) {
					throw new UnauthorizedError(
						"You are not allowed to shutdown this organization",
					);
				}

				await prisma.organization.delete({
					where: { id: organization.id },
				});

				return reply.status(204).send();
			},
		);
}
