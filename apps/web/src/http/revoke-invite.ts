import { api } from "./api-client";

interface RevokeInviteResponse {
	org: string;
	inviteId: string;
}

export async function revokeInvite({ org, inviteId }: RevokeInviteResponse) {
	const result = await api
		.delete(`organizations/${org}/invites/${inviteId}`)
		.json<RevokeInviteResponse>();

	return result;
}
