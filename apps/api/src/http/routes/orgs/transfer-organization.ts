import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { organizationSchema } from "@saas/auth";
import { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { BadRequestError } from "../_errors/bad-request-error";
import { UnauthorizedError } from "../_errors/unauthorized-error";

export async function transferOrganization(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.patch(
			"/organizations/:slug/owner",
			{
				schema: {
					tags: ["organizations"],
					summary: "Transfer organization ownership",
					security: [{ bearerAuth: [] }],
					body: z.object({
						transferToUserId: z.string().uuid(),
					}),
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

				/**
				 * 1. Obtem o id do usuário, a organização e
				 * os dados como membro desta organização
				 */
				const userId = await request.getCurrentUserId();
				const { membership, organization } =
					await request.getUserMembership(slug);

				/**
				 * 2. Cria uma organização seguindo o schema de
				 * organização definido no módulo auth para ser
				 * usado na verificação de permissões
				 */
				const authOrganization = organizationSchema.parse(organization);

				/**
				 * 3. Obtem as permissões do usuário
				 */
				const permissions = getUserPermissions(userId, membership.role);

				console.log({ permissions });

				/**
				 * 4. Verifica se o usuário tem permissão para transferir a organização
				 */
				if (permissions.cannot("transfer_ownership", authOrganization)) {
					throw new UnauthorizedError(
						"You are not allowed to transfer ownership of this organization",
					);
				}

				const { transferToUserId } = request.body;

				/**
				 * 5. Verifica se o usuário para quem a organização será transferida
				 * é membro da organização
				 */
				const transferToMembership = await prisma.member.findUnique({
					where: {
						userId_organizationId: {
							userId: transferToUserId,
							organizationId: organization.id,
						},
					},
				});

				if (!transferToMembership) {
					throw new BadRequestError(
						"User to transfer ownership is not a member of the organization",
					);
				}

				await prisma.$transaction([
					prisma.member.update({
						where: {
							userId_organizationId: {
								userId: transferToUserId,
								organizationId: organization.id,
							},
						},
						data: {
							role: "ADMIN",
						},
					}),
					prisma.organization.update({
						where: { id: organization.id },
						data: {
							ownerId: transferToUserId,
						},
					}),
				]);

				return reply.status(204).send();
			},
		);
}
