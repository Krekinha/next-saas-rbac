"use server";

import { getCurrentOrgSlug } from "@/auth/auth";
import { removeMember } from "@/http/remove-member";
import { revokeInvite } from "@/http/revoke-invite";
import { updateMember } from "@/http/update-member";
import type { Role } from "@saas/auth";
import { revalidateTag } from "next/cache";

export async function removeMemberAction(memberId: string) {
	const currentOrg = await getCurrentOrgSlug();

	await removeMember({
		org: currentOrg!,
		memberId,
	});

	revalidateTag(`${currentOrg}/members`);
}

export async function updateMemberAction(memberId: string, role: Role) {
	const currentOrg = await getCurrentOrgSlug();

	await updateMember({
		org: currentOrg!,
		memberId,
		role,
	});

	revalidateTag(`${currentOrg}/members`);
}

export async function revokeInviteAction(inviteId: string) {
	const currentOrg = await getCurrentOrgSlug();

	await revokeInvite({
		org: currentOrg!,
		inviteId,
	});

	revalidateTag(`${currentOrg}/invites`);
}
