"use server";
import { env } from "@saas/env";
import { redirect } from "next/navigation";

export async function signInWithGithub() {
	const githubSignInUrl = new URL("login/oauth/authorize", "https://github.com");

	githubSignInUrl.searchParams.set("client_id", env.GITHUB_OAUTH_CLIENT_ID);
	githubSignInUrl.searchParams.set("redirect_uri", env.GITHUB_OAUTH_REDIRECT_URL);
	githubSignInUrl.searchParams.set("scope", "user");

	console.log({ githubSignInUrl });
	redirect(githubSignInUrl.toString());
}
