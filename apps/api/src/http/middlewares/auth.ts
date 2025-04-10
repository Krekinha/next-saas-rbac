import { prisma } from "@/lib/prisma";
import { type FastifyInstance } from "fastify";
import { fastifyPlugin } from "fastify-plugin";
import { UnauthorizedError } from "../routes/_errors/unauthorized-error";

/**
 * Middleware para autenticação do usuário e fornecer helpers
 * relacionados aos dados do usuário
 */
export const auth = fastifyPlugin(async (app: FastifyInstance) => {
	app.addHook("preHandler", async (request) => {
		request.getCurrentUserId = async () => {
			try {
				const { sub } = await request.jwtVerify<{ sub: string }>();
				return sub;
			} catch {
				throw new UnauthorizedError("Invalid authorization token");
			}
		};

		request.getUserMembership = async (slug: string) => {
			const userId = await request.getCurrentUserId();

			const member = await prisma.member.findFirst({
				where: {
					userId,
					organization: {
						slug,
					},
				},
				include: {
					organization: true,
				},
			});

			if (!member) {
				throw new UnauthorizedError(
					"User is not a member of this organization",
				);
			}

			const { organization, ...membership } = member;

			return {
				organization,
				membership,
			};
		};
	});
});
