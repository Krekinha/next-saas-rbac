import { getMembership } from "@/http/get-membership";
import { getProfile } from "@/http/get-profile";
import { defineAbilityFor } from "@saas/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function isAuthenticated() {
	const cookiesInstance = await cookies();
	return !!cookiesInstance.get("token")?.value;
	// return getCookie("token");
}

export async function getCurrentOrgSlug() {
	const cookiesInstance = await cookies();
	return cookiesInstance.get("org")?.value;
	// return getCookie("org") ?? null;
}

export async function getCurrentMembership() {
	const orgSlug = await getCurrentOrgSlug();

	if (!orgSlug) {
		return null;
	}

	const { membership } = await getMembership(orgSlug);

	return membership;
}

export async function ability() {
	const membership = await getCurrentMembership();

	if (!membership) {
		return null;
	}

	/*
	 * 2. Obtem as permissões do usuário
	 */
	const ability = defineAbilityFor({
		id: membership.userId,
		role: membership.role,
	});

	return ability;
}

export async function auth() {
	const cookiesInstance = await cookies();
	const token = cookiesInstance.get("token")?.value;

	// const token = getCookie("token");
	// const token = (await cookies()).get("org")?.value;

	if (!token) {
		redirect("/auth/sign-in");
	}

	try {
		const { user } = await getProfile();

		return { user };
	} catch {}

	redirect("/api/auth/sign-out");
}
