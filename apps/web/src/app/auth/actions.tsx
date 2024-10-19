"use server";
import { redirect } from "next/navigation";

export async function signInWithGithub() {
	const githubSignInUrl = new URL(
		"login/oauth/authorize",
		"https://github.com",
	);

	githubSignInUrl.searchParams.set("client_id", "Ov23liDgGXvdgMQqdz7l");
	githubSignInUrl.searchParams.set(
		"redirect_uri",
		"http://localhost:3000/api/auth/callback",
	);
	githubSignInUrl.searchParams.set("scope", "user");

	console.log({ githubSignInUrl });
	redirect(githubSignInUrl.toString());
}
