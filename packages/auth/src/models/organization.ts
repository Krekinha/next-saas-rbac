import { z } from "zod";

/**
 * Modelo de organização (somente campos que são usados para permissões)
 */
export const organizationSchema = z.object({
	__typename: z.literal("Organization").default("Organization"),
	id: z.string(),
	ownerId: z.string(),
});
export type Organization = z.infer<typeof organizationSchema>;
