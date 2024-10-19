import "fastify";

import { Member, Organization } from "@prisma/client";

/**
 * Extensão do FastifyRequest para adicionar um método
 * para obter o ID do usuário atual
 */
declare module "fastify" {
	export interface FastifyRequest {
		getCurrentUserId: () => Promise<string>;
		getUserMembership: (
			slug: string,
		) => Promise<{ organization: Organization; membership: Member }>;
	}
}
