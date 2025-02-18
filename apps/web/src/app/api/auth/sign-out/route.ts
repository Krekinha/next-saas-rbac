import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	(await cookies()).delete("token");

	return NextResponse.redirect(new URL("/auth/sign-in", request.url));
}
