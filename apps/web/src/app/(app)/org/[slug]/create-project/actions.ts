"use server";

import { getCurrentOrgSlug } from "@/auth/auth";
import { createProject } from "@/http/create-project";
// import { createProject } from "@/http/create-project";
import { HTTPError } from "ky";
import { z } from "zod";

const createProjectSchema = z.object({
	name: z.string().min(4, {
		message: "Please, include at least 4 characters",
	}),
	description: z.string(),
});

export async function createProjectAction(data: FormData) {
	const validatedFields = createProjectSchema.safeParse(Object.fromEntries(data));
	if (!validatedFields.success) {
		const errors = validatedFields.error.flatten().fieldErrors;
		return {
			success: false,
			message: null,
			errors,
		};
	}
	const { name, description } = validatedFields.data;

	try {
		await createProject({
			org: await getCurrentOrgSlug().then()!,
			name,
			description,
		});
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

	return {
		success: true,
		message: "Successfully saved the project",
		errors: null,
	};
}
