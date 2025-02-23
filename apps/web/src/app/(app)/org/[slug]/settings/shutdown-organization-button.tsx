import { getCurrentOrgSlug } from "@/auth/auth";
import { Button } from "@/components/ui/button";
import { shutdownOrganization } from "@/http/shutdown-organization";
import { XCircle } from "lucide-react";
import { redirect } from "next/navigation";

export function ShutDownOrganizationButton() {
	async function shutDownOrganizationAction() {
		"use server";

		const currentOrg = await getCurrentOrgSlug();
		if (!currentOrg) {
			throw new Error("Organization slug is undefined");
		}

		await shutdownOrganization({ org: currentOrg });

		redirect("/");
	}

	return (
		<form action={shutDownOrganizationAction}>
			<Button type="submit" variant="destructive" className="w-56">
				<XCircle className="mr-2 size-4" />
				Shutdown organization
			</Button>
		</form>
	);
}
