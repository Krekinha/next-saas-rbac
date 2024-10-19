import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { UnauthorizedError } from "../_errors/unauthorized-error";

export async function getProjects(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.get(
			"/organizations/:orgSlug/projects",
			{
				schema: {
					tags: ["projects"],
					summary: "Get all organization projects",
					security: [{ bearerAuth: [] }],
					params: z.object({
						orgSlug: z.string(),
					}),
					response: {
						200: z.object({
							projects: z.array(
								z.object({
									id: z.string().uuid(),
									name: z.string(),
									description: z.string(),
									slug: z.string(),
									ownerId: z.string().uuid(),
									avatarUrl: z.string().nullable(),
									organizationId: z.string().uuid(),
									createdAt: z.date(),
									owner: z.object({
										id: z.string().uuid(),
										name: z.string().nullable(),
										avatarUrl: z.string().nullable(),
									}),
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
				if (permissions.cannot("get", "Project")) {
					throw new UnauthorizedError(
						"You are not allowed to see organization projects",
					);
				}

				/*
				 * 4. Verifica se o projeto existe e pertence a organização do usuário
				 */
				const projects = await prisma.project.findMany({
					where: {
						organizationId: organization.id,
					},
					select: {
						id: true,
						name: true,
						description: true,
						slug: true,
						ownerId: true,
						avatarUrl: true,
						organizationId: true,
						createdAt: true,
						owner: {
							select: {
								id: true,
								name: true,
								avatarUrl: true,
							},
						},
					},
					orderBy: {
						createdAt: "desc",
					},
				});

				return reply.send({ projects });
			},
		);
}
