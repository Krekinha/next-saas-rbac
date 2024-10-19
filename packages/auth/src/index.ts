import {
	AbilityBuilder,
	type CreateAbility,
	type MongoAbility,
	createMongoAbility,
} from "@casl/ability";
import { z } from "zod";
import type { User } from "./models/user";
import { permissions } from "./permissions";
import { billingSubject } from "./subjects/billing";
import { inviteSubject } from "./subjects/invite";
import { organizationSubject } from "./subjects/organization";
import { projectSubject } from "./subjects/project";
import { userSubject } from "./subjects/user";

export * from "./models/organization";
export * from "./models/project";
export * from "./models/user";
export * from "./roles";

const AppAbilitiesSchema = z.union([
	projectSubject,
	userSubject,
	organizationSubject,
	billingSubject,
	inviteSubject,
	z.tuple([z.literal("manage"), z.literal("all")]),
]);

type AppAbilities = z.infer<typeof AppAbilitiesSchema>;

export type AppAbility = MongoAbility<AppAbilities>;

export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

export const defineAbilityFor = (user: User) => {
	const builder = new AbilityBuilder(createAppAbility);

	// Verifica se a função de permissões existe
	if (typeof permissions[user.role] !== "function") {
		throw new Error(`Permissions for role ${user.role} not found`);
	}

	// Define as permissões do usuário
	permissions[user.role](user, builder);

	// Cria a habilidade do usuário
	const ability = builder.build({
		detectSubjectType: (subject) => subject.__typename,
	});

	return ability;
};
