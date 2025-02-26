import { api } from "./api-client";

interface RemoveMemberResponse {
	org: string;
	memberId: string;
}

export async function removeMember({ org, memberId }: RemoveMemberResponse) {
	const result = await api
		.delete(`organizations/${org}/members/${memberId}`)
		.json<RemoveMemberResponse>();

	return result;
}
