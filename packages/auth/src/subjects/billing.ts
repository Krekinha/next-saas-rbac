import { z } from "zod";

/**
 * Permissões relacionadas ao faturamento
 */
export const billingSubject = z.tuple([
	z.union([z.literal("manage"), z.literal("get"), z.literal("export")]),
	z.literal("Billing"),
]);
export type BillingSubject = z.infer<typeof billingSubject>;
