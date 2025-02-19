"use server";

import { createOrganization } from "@/http/create-organization";
import { HTTPError } from "ky";
import { z } from "zod";

const createOrganizationSchema = z
	.object({
		name: z.string().min(4, {
			message: "Please, include at least 4 characters",
		}),
		domain: z
			.string()
			.nullable()
			.refine(
				(value) => {
					if (!value) return true;
					const domainRegex = /^[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}$/;
					return domainRegex.test(value);
				},
				{ message: "Please, enter a valid domain" },
			),
		shouldAttachUsersByDomain: z
			.union([z.literal("on"), z.literal("off"), z.boolean()])
			.transform((value) => value === true || value === "on")
			.default(false),
	})
	.refine(
		(data) => {
			if (data.shouldAttachUsersByDomain === true && !data.domain) {
				return false;
			}
			return true;
		},
		{
			message: "Domain is required when auto-join is enabled",
			path: ["domain"],
		},
	);

export async function createOrganizationAction(data: FormData) {
	const validatedFields = createOrganizationSchema.safeParse(
		Object.fromEntries(data),
	);
	if (!validatedFields.success) {
		const fieldErrors = validatedFields.error.flatten().fieldErrors;
		return {
			success: false,
			message: null,
			fieldErrors,
		};
	}
	const { name, domain, shouldAttachUsersByDomain } = validatedFields.data;

	try {
		await createOrganization({
			name,
			domain,
			shouldAttachUsersByDomain,
		});
		return {
			success: true,
			message: "Successfully saved organization",
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
