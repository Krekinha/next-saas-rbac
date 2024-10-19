import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { projectSchema } from "@saas/auth";
import { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { BadRequestError } from "../_errors/bad-request-error";
import { UnauthorizedError } from "../_errors/unauthorized-error";

export async function deleteProject(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.delete(
			"/organizations/:slug/projects/:projectId",
			{
				schema: {
					tags: ["projects"],
					summary: "Delete a project",
					security: [{ bearerAuth: [] }],
					params: z.object({
						slug: z.string(),
						projectId: z.string().uuid(),
					}),
					response: {
						204: z.null(),
					},
				},
			},
			async (request, reply) => {
				const { slug, projectId } = request.params;

				/*
				 * 1. Obtem o id do usuário, a organização e
				 * os dados como membro desta organização
				 */
				const userId = await request.getCurrentUserId();
				const { organization, membership } =
					await request.getUserMembership(slug);

				/*
				 * 2. Verifica se o projeto existe e se pertence a organização informada
				 */
				const project = await prisma.project.findUnique({
					where: {
						id: projectId,
						organizationId: organization.id,
					},
				});

				if (!project) {
					throw new BadRequestError("Project not found");
				}

				/*
				 * 2. Obtem as permissões do usuário
				 */
				const permissions = getUserPermissions(userId, membership.role);

				/*
				 * 3. Cria um protótipo do projeto para comparar e validar as permissões
				 */
				const authProject = projectSchema.parse(project);

				/*
				 * 4. Verifica se o usuário tem permissão para deletar o projeto
				 */
				if (permissions.cannot("delete", authProject)) {
					throw new UnauthorizedError(
						"You are not allowed to delete this project",
					);
				}

				/*
				 * 5. Deleta o projeto
				 */
				await prisma.project.delete({
					where: {
						id: projectId,
					},
				});

				return reply.status(204).send();
			},
		);
}
