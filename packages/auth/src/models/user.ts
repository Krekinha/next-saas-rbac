import { z } from "zod";
import { roleSchema } from "../roles";

/**
 * Modelo de usuário (somente campos que são usados para permissões)
 */
export const userSchema = z.object({
	id: z.string(),
	role: roleSchema,
});
export type User = z.infer<typeof userSchema>;
