import { api } from "./api-client";

interface RevokeInviteResponse {
	org: string;
	inviteId: string;
}

export async function revokeInvite({ org, inviteId }: RevokeInviteResponse) {
	await api.delete(`organizations/${org}/invites/${inviteId}`);
}
