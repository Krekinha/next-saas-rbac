import { prisma } from "@/lib/prisma";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function requestPasswordRecover(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/password/recover",
		{
			schema: {
				tags: ["auth"],
				summary: "Request password recover",
				body: z.object({
					email: z.string().email(),
				}),
				response: {
					201: z.null(),
				},
			},
		},
		async (request, reply) => {
			const { email } = request.body;

			const user = await prisma.user.findUnique({
				where: {
					email,
				},
			});

			// Não queremos revelar se o usuário existe ou não
			if (!user) {
				return reply.status(201).send();
			}

			const { id: code } = await prisma.token.create({
				data: {
					type: "PASSWORD_RECOVER",
					userId: user.id,
				},
			});

			// TODO: Enviar e-mail com link de recuperação de senha
			console.log("Recover password code:", code);

			return reply.status(201).send();
		},
	);
}
