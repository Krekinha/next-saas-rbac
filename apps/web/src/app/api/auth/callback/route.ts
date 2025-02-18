import { signInWithGithub } from "@/http/signin-with-github";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const code = searchParams.get("code");

	if (!code) {
		// return NextResponse.redirect(new URL("/auth/sign-in", request.url));
		return NextResponse.json(
			{ message: "Github OAuth code not found" },
			{ status: 400 },
		);
	}

	const { token } = await signInWithGithub({ code });

	console.log("token", token);

	(await cookies()).set("token", token, {
		path: "/",
		maxAge: 60 * 60 * 24 * 7, // 7 days
	});

	return NextResponse.redirect(new URL("/", request.url));
}
