"use server";

import { signInWithPassword } from "@/http/signin-with-password";
import { HTTPError } from "ky";
import { cookies } from "next/headers";
import { z } from "zod";

const signInSchema = z.object({
	email: z.string().email({ message: "Please enter a valid email address" }),
	password: z.string().min(1, { message: "Password is required" }),
});

export async function signInWithEmailAndPassword(data: FormData) {
	// console.log(data);
	const validatedFields = signInSchema.safeParse(Object.fromEntries(data));
	if (!validatedFields.success) {
		const fieldErrors = validatedFields.error.flatten().fieldErrors;
		return {
			success: false,
			message: null,
			fieldErrors,
		};
	}
	const { email, password } = validatedFields.data;

	try {
		const { token } = await signInWithPassword({
			email,
			password,
		});

		console.log({ token });

		(await cookies()).set("token", token, {
			path: "/",
			maxAge: 60 * 60 * 24 * 7, // 7 days
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
