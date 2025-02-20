import { isAuthenticated } from "@/auth/auth";
import { redirect } from "next/navigation";
import type React from "react";

export default function AppLayout({
	children,
	sheet,
}: Readonly<{
	children: React.ReactNode;
	sheet: React.ReactNode;
}>) {
	if (!isAuthenticated()) {
		redirect("/auth/sign-in");
	}

	return (
		<>
			{children}
			{sheet}
		</>
	);
}
