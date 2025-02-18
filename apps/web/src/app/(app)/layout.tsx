import { isAuthenticated } from "@/auth/auth";
import { Header } from "@/components/header";
import { redirect } from "next/navigation";

export default function AppLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	if (!isAuthenticated()) {
		redirect("/auth/sign-in");
	}

	return (
		<div className="py-4 space-y-4">
			<Header />
			<main className="mx-auto w-full max-w-[1200px]">{children}</main>
		</div>
	);
}
