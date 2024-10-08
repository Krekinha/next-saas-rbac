import { z } from "zod";

export const roleSchema = z.union([
	z.literal("ADMIN"),
	z.literal("MEMBER"),
	z.literal("BILLING"),
]);

/**
 * Tipos de roles
 */
export type Role = z.infer<typeof roleSchema>;
