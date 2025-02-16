import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const response = NextResponse.next();

	if (pathname.startsWith("/org/")) {
		const slug = pathname.slice(5);
		// return NextResponse.rewrite(`/org/${slug}`);

		response.cookies.set("org", slug);
		// return NextResponse.rewrite(`/org/${slug}`);
	} else {
		response.cookies.delete("org");
	}

	return response;
}

export const config = {
	matcher: [
		/*
		/* Esse middleware é executado em todas as rotas, exceto:
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};
