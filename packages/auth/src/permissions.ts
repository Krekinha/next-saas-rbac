import type { AbilityBuilder } from "@casl/ability";
import type { AppAbility } from ".";
import type { User } from "./models/user";
import type { Role } from "./roles";

type PermissionsByRole = (
	user: User,
	builder: AbilityBuilder<AppAbility>,
) => void;

export const permissions: Record<Role, PermissionsByRole> = {
	ADMIN(user, { can, cannot }) {
		/**
		 * Admin pode gerenciar tudo
		 */
		can("manage", "all");

		/**
		 * Admin não pode transferir a propriedade de uma organização
		 * Admin não pode atualizar uma organização
		 */
		cannot(["transfer_ownership", "update"], "Organization");

		/**
		 * Admin pode transferir a propriedade de uma organização se for o proprietário
		 * Admin pode atualizar uma organização se for o proprietário
		 */
		can(["transfer_ownership", "update"], "Organization", {
			ownerId: { $eq: user.id },
		});
	},
	MEMBER(user, { can }) {
		/**
		 * Membro pode obter um usuário
		 */
		can("get", "User");

		/**
		 * Membro pode criar e obter um projeto
		 * Membro pode atualizar e deletar um projeto se for o proprietário
		 */
		can(["create", "get"], "Project");
		can(["update", "delete"], "Project", { ownerId: { $eq: user.id } });
	},
	BILLING(_, { can }) {
		can("manage", "Billing");
	},
};
