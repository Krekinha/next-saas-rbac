import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { roleSchema } from "@saas/auth";
import { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function getOrganizations(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.get(
			"/organizations",
			{
				schema: {
					tags: ["organizations"],
					summary: "Get organizations where user is member",
					security: [{ bearerAuth: [] }],
					response: {
						200: z.object({
							organizations: z.array(
								z.object({
									id: z.string().uuid(),
									name: z.string(),
									slug: z.string(),
									avatarUrl: z.string().url().nullable(),
									role: roleSchema,
								}),
							),
						}),
					},
				},
			},
			async (request) => {
				const userId = await request.getCurrentUserId();

				const organizations = await prisma.organization.findMany({
					where: {
						members: {
							some: {
								userId,
							},
						},
					},
					select: {
						id: true,
						name: true,
						slug: true,
						avatarUrl: true,
						members: {
							select: {
								role: true,
							},
							where: {
								userId,
							},
						},
					},
				});

				const organizationsWithRoles = organizations.map((organization) => {
					const role = organization.members[0].role;
					return {
						...organization,
						role,
					};
				});

				return { organizations: organizationsWithRoles };
			},
		);
}
