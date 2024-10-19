import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { BadRequestError } from "../_errors/bad-request-error";

export async function rejectInvite(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.post(
			"/invites/:inviteId/reject",
			{
				schema: {
					tags: ["invites"],
					summary: "Reject an invite",
					params: z.object({
						inviteId: z.string().uuid(),
					}),
					response: {
						204: z.null(),
					},
				},
			},
			async (request, reply) => {
				const { inviteId } = request.params;

				/*
				 * 1. Obtem o id do usuário
				 */
				const userId = await request.getCurrentUserId();

				const invite = await prisma.invite.findUnique({
					where: { id: inviteId },
				});

				if (!invite) {
					throw new BadRequestError("Invite not found or expired.");
				}

				const user = await prisma.user.findUnique({
					where: { id: userId },
				});

				if (!user) {
					throw new BadRequestError("User not found.");
				}

				if (user.email !== invite.email) {
					throw new BadRequestError("The invite is not for this user.");
				}

				await prisma.invite.delete({ where: { id: inviteId } });

				return reply.status(204).send();
			},
		);
}
