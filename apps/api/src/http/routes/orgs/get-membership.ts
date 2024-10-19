import { auth } from "@/http/middlewares/auth";
import { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function getMembership(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.get(
			"/organizations/:slug/membership",
			{
				schema: {
					tags: ["organizations"],
					summary: "Get organization membership on organization",
					security: [{ bearerAuth: [] }],
					params: z.object({
						slug: z.string(),
					}),
					response: {
						200: z.object({
							membership: z.object({
								id: z.string().uuid(),
								userId: z.string().uuid(),
								role: z.string(),
								organizationId: z.string().uuid(),
							}),
						}),
					},
				},
			},
			async (request) => {
				const { slug } = request.params;
				const { membership } = await request.getUserMembership(slug);

				return {
					membership: {
						id: membership.id,
						userId: membership.userId,
						role: membership.role,
						organizationId: membership.organizationId,
					},
				};
			},
		);
}
