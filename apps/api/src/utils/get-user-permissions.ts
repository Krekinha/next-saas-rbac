import { type Role, defineAbilityFor, userSchema } from "@saas/auth";

export function getUserPermissions(userId: string, role: Role) {
	/*
	 * 1. Cria um usuário seguindo o schema de usuário
	 * definido no módulo auth para ser usado na
	 * verificação de permissões
	 */
	const authUser = userSchema.parse({
		id: userId,
		role: role,
	});

	/*
	 * 2. Obtem as permissões do usuário
	 */
	const ability = defineAbilityFor(authUser);

	return ability;
}
