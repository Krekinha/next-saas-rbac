import { env } from "@saas/env";
import { getCookie } from "cookies-next";
import { CookiesFn } from "cookies-next/lib/types";
import ky from "ky";

export const api = ky.create({
	prefixUrl: env.NEXT_PUBLIC_API_URL, //"http://localhost:3333",
	hooks: {
		beforeRequest: [
			async (request) => {
				let cookieStore: CookiesFn | undefined;

				/**
				 * Se a solicitação vier de um servidor, obtenha o token do cookie
				 */
				if (typeof window === "undefined") {
					const { cookies: serverCookies } = await import("next/headers");
					cookieStore = serverCookies;
				}

				const token = getCookie("token", { cookies: cookieStore });

				if (token) {
					request.headers.set("Authorization", `Bearer ${token}`);
				}
			},
		],
	},
});
