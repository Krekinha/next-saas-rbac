"use server";

import { acceptInvite } from "@/http/accept-invite";
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
		const errors = validatedFields.error.flatten().fieldErrors;
		return {
			success: false,
			message: null,
			errors,
		};
	}
	const { email, password } = validatedFields.data;

	try {
		const { token } = await signInWithPassword({
			email,
			password,
		});

		(await cookies()).set("token", token, {
			path: "/",
			maxAge: 60 * 60 * 24 * 7, // 7 days
		});

		const inviteId = (await cookies()).get("inviteId")?.value;

		if (inviteId) {
			try {
				await acceptInvite(inviteId);
				(await cookies()).delete("inviteId");
			} catch {}
		}

		return { success: true, message: null, errors: null };
	} catch (error) {
		console.log(error);
		if (error instanceof HTTPError) {
			const { message } = await error.response.json();

			return {
				success: false,
				message,
				errors: null,
			};
		}

		console.error(error);
		return {
			success: false,
			message: "Unexpected error",
			errors: null,
		};
	}
}
