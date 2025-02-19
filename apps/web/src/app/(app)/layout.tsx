import { isAuthenticated } from "@/auth/auth";
import { redirect } from "next/navigation";
import type React from "react";

export default function AppLayout({
	children,
	teste,
}: Readonly<{
	children: React.ReactNode;
	teste: React.ReactNode;
}>) {
	if (!isAuthenticated()) {
		redirect("/auth/sign-in");
	}

	return (
		<>
			{children}
			{teste}
		</>
	);
}
