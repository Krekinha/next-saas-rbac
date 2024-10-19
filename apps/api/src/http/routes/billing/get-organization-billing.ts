import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { UnauthorizedError } from "../_errors/unauthorized-error";

export async function getOrganizationBilling(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.get(
			"/organization/:slug/billing",
			{
				schema: {
					tags: ["billing"],
					summary: "Get billing information from organization",
					security: [{ bearerAuth: [] }],
					params: z.object({
						slug: z.string(),
					}),
					response: {
						200: z.object({
							billing: z.object({
								seats: z.object({
									amount: z.number(),
									unit: z.number(),
									price: z.number(),
								}),
								projects: z.object({
									amount: z.number(),
									unit: z.number(),
									price: z.number(),
								}),
								total: z.number(),
							}),
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
				const { membership, organization } =
					await request.getUserMembership(slug);

				/*
				 * 2. Obtem as permissões do usuário
				 */
				const permissions = getUserPermissions(userId, membership.role);

				console.log({ permissions });

				/*
				 * 3. Verifica se o usuário tem permissão para obter informações de faturamento da organização
				 */
				if (permissions.cannot("get", "Billing")) {
					throw new UnauthorizedError(
						"You are not allowed to get billing information from this organization",
					);
				}

				/*
				 * 4. Obtem a quantidade de membros e projetos da organização
				 */
				const [amountOfMembers, amountOfProjects] = await Promise.all([
					await prisma.member.count({
						where: {
							organizationId: organization.id,
							role: { not: "BILLING" },
						},
					}),

					await prisma.project.count({
						where: { organizationId: organization.id },
					}),
				]);

				/**
				 * 5. Retorna um objeto com o os detalhes e o valor total do faturamento
				 * por membro e projeto
				 */
				return {
					billing: {
						seats: {
							amount: amountOfMembers,
							unit: 10,
							price: amountOfMembers * 10,
						},
						projects: {
							amount: amountOfProjects,
							unit: 20,
							price: amountOfProjects * 20,
						},
						total: amountOfMembers * 10 + amountOfProjects * 20,
					},
				};
			},
		);
}
