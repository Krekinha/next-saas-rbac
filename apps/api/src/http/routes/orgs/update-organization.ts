import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { organizationSchema } from "@saas/auth";
import { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { BadRequestError } from "../_errors/bad-request-error";
import { UnauthorizedError } from "../_errors/unauthorized-error";

export async function updateOrganization(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.put(
			"/organizations/:slug",
			{
				schema: {
					tags: ["organizations"],
					summary: "Update organization details",
					security: [{ bearerAuth: [] }],
					body: z.object({
						name: z.string(),
						domain: z.string().nullish(),
						shouldAttachUsersByDomain: z.boolean().optional(),
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
				if (permissions.cannot("update", authOrganization)) {
					throw new UnauthorizedError(
						"You are not allowed to update this organization",
					);
				}

				const { name, domain, shouldAttachUsersByDomain } = request.body;

				if (domain) {
					const organizationByDomain = await prisma.organization.findFirst({
						where: { domain, id: { not: organization.id } },
					});

					if (organizationByDomain) {
						throw new BadRequestError(
							"Organization with this domain already exists",
						);
					}
				}

				await prisma.organization.update({
					where: { id: organization.id },
					data: {
						name,
						domain,
						shouldAttachUsersByDomain,
					},
				});

				return reply.status(204).send();
			},
		);
}
