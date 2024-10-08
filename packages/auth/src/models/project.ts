import { z } from "zod";

/**
 * Modelo de projeto (somente campos que são usados para permissões)
 */
export const projectSchema = z.object({
	__typename: z.literal("Project").default("Project"),
	id: z.string(),
	ownerId: z.string(),
});
export type Project = z.infer<typeof projectSchema>;
