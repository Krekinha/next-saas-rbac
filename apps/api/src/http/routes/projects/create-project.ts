import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { createSlug } from "@/utils/create-slug";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { UnauthorizedError } from "../_errors/unauthorized-error";

export async function createProject(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.post(
			"/organizations/:slug/projects",
			{
				schema: {
					tags: ["projects"],
					summary: "Create a new project",
					security: [{ bearerAuth: [] }],
					params: z.object({
						slug: z.string(),
					}),
					body: z.object({
						name: z.string(),
						description: z.string(),
					}),
					response: {
						201: z.object({
							projectId: z.string().uuid(),
						}),
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
				const { organization, membership } =
					await request.getUserMembership(slug);

				/*
				 * 2. Obtem as permissões do usuário
				 */
				const permissions = getUserPermissions(userId, membership.role);

				/*
				 * 3. Verifica se o usuário tem permissão para criar um novo projeto
				 */
				if (permissions.cannot("create", "Project")) {
					throw new UnauthorizedError(
						"You are not allowed to create a new project",
					);
				}

				const { name, description } = request.body;

				/*
				 * 4. Cria um novo projeto
				 */
				const project = await prisma.project.create({
					data: {
						name,
						description,
						slug: createSlug(name),
						organizationId: organization.id,
						ownerId: userId,
					},
				});

				return reply.status(201).send({
					projectId: project.id,
				});
			},
		);
}
