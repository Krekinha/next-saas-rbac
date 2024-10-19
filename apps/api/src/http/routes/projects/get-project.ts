import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { BadRequestError } from "../_errors/bad-request-error";
import { UnauthorizedError } from "../_errors/unauthorized-error";

export async function getProject(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.get(
			"/organizations/:orgSlug/projects/:projectSlug",
			{
				schema: {
					tags: ["projects"],
					summary: "Get a project details",
					security: [{ bearerAuth: [] }],
					params: z.object({
						orgSlug: z.string(),
						projectSlug: z.string(),
					}),
					response: {
						200: z.object({
							project: z.object({
								id: z.string().uuid(),
								name: z.string(),
								description: z.string(),
								slug: z.string(),
								ownerId: z.string().uuid(),
								avatarUrl: z.string().url().nullable(),
								organizationId: z.string().uuid(),
								owner: z.object({
									id: z.string().uuid(),
									name: z.string().nullable(),
									avatarUrl: z.string().url().nullable(),
								}),
							}),
						}),
					},
				},
			},
			async (request, reply) => {
				const { orgSlug, projectSlug } = request.params;

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
						"You are not allowed to get project details",
					);
				}

				/*
				 * 4. Verifica se o projeto existe e pertence a organização do usuário
				 */
				const project = await prisma.project.findUnique({
					where: {
						slug: projectSlug,
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
						owner: {
							select: {
								id: true,
								name: true,
								avatarUrl: true,
							},
						},
					},
				});

				if (!project) {
					throw new BadRequestError("Project not found");
				}

				return reply.send({ project });
			},
		);
}
