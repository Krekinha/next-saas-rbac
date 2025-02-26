"use server";

import { getCurrentOrgSlug } from "@/auth/auth";
import { removeMember } from "@/http/remove-member";
import { revalidateTag } from "next/cache";

export async function removeMemberAction(memberId: string) {
	const currentOrg = await getCurrentOrgSlug();

	await removeMember({
		org: currentOrg!,
		memberId,
	});

	revalidateTag(`${currentOrg}/members`);
}
