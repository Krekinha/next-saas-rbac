"use server";

import { getCurrentOrgSlug } from "@/auth/auth";
import { createOrganization } from "@/http/create-organization";
import { updateOrganization } from "@/http/update-organization";
import { organizationSchema } from "@/lib/utils";
import { HTTPError } from "ky";
import { revalidateTag } from "next/cache";

export async function createOrganizationAction(data: FormData) {
	const validatedFields = organizationSchema.safeParse(Object.fromEntries(data));

	if (!validatedFields.success) {
		const errors = validatedFields.error.flatten().fieldErrors;

		return { success: false, message: null, errors };
	}
	const { name, domain, shouldAttachUsersByDomain } = validatedFields.data;

	try {
		await createOrganization({
			name,
			domain,
			shouldAttachUsersByDomain,
		});
		revalidateTag("organizations");
	} catch (error) {
		if (error instanceof HTTPError) {
			const { message } = await error.response.json();

			return { success: false, message, errors: null };
		}

		console.error(error);

		return {
			success: false,
			message: "Unexpected error, try again a few minutes",
			errors: null,
		};
	}

	return {
		success: true,
		message: "Successfully saved the organization",
		errors: null,
	};
}

export async function updateOrganizationAction(data: FormData) {
	const currentOrg = await getCurrentOrgSlug();
	const result = organizationSchema.safeParse(Object.fromEntries(data));

	if (!result.success) {
		const errors = result.error.flatten().fieldErrors;

		return { success: false, message: null, errors };
	}

	const { name, domain, shouldAttachUsersByDomain } = result.data;

	try {
		await updateOrganization({
			org: currentOrg ?? "",
			name,
			domain,
			shouldAttachUsersByDomain,
		});
		revalidateTag("organizations");
	} catch (error) {
		if (error instanceof HTTPError) {
			const { message } = await error.response.json();

			return { success: false, message, errors: null };
		}

		console.error(error);

		return {
			success: false,
			message: "Unexpected error, try again in a few minutes",
			errors: null,
		};
	}
	return {
		success: true,
		message: "Successfully saved organization",
		errors: null,
	};
}
