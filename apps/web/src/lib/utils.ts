import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const organizationSchema = z
	.object({
		name: z
			.string()
			.min(4, { message: "Please, include at least 4 characters" }),
		domain: z
			.string()
			.nullable()
			.refine(
				(value) => {
					if (value) {
						const domainRegex =
							/^[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}$/;
						return domainRegex.test(value);
					}

					return true;
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
			console.log("refineData: ", data);
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

export type OrganizationSchema = z.infer<typeof organizationSchema>;
