"use server";

import { signUp } from "@/http/sign-up";
import { HTTPError } from "ky";
import { z } from "zod";

const signUpSchema = z
	.object({
		name: z.string().refine((value) => value.split(" ").length >= 2, {
			message: "Please, enter your full name",
		}),
		email: z.string().email({ message: "Please enter a valid email address" }),
		password: z
			.string()
			.min(6, { message: "Password must be at least 6 characters long" }),
		password_confirmation: z.string(),
	})
	// Verifica se a senha e a confirmação de senha são iguais
	.refine((data) => data.password === data.password_confirmation, {
		message: "Passwords don't match",
		path: ["password_confirmation"],
	});

export async function signUpAction(data: FormData) {
	const validatedFields = signUpSchema.safeParse(Object.fromEntries(data));
	if (!validatedFields.success) {
		const fieldErrors = validatedFields.error.flatten().fieldErrors;
		return {
			success: false,
			message: null,
			fieldErrors,
		};
	}
	const { name, email, password } = validatedFields.data;

	try {
		await signUp({
			name,
			email,
			password,
		});
		return {
			success: true,
			message: null,
			fieldErrors: null,
		};
	} catch (error) {
		console.log(error);
		if (error instanceof HTTPError) {
			const { message } = await error.response.json();

			return {
				success: false,
				message,
				fieldErrors: null,
			};
		}

		console.error(error);
		return {
			success: false,
			message: "Unexpected error",
			fieldErrors: null,
		};
	}
}
