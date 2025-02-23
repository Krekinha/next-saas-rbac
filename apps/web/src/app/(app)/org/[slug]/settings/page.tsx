import { ability } from "@/auth/auth";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { OrganizationForm } from "../../organization-form";
import { ShutDownOrganizationButton } from "./shutdown-organization-button";

export default async function SettingsPage() {
	const permissions = await ability();

	const canUpdateOrganization = permissions?.can("update", "Organization");
	const canGetBilling = permissions?.can("get", "Billing");
	const canShutDownOrganization = permissions?.can("delete", "Organization");

	return (
		<div className="space-y-4">
			<h1 className="font-bold text-2xl">Settings</h1>

			<div className="space-y-4">
				{canUpdateOrganization && (
					<Card>
						<CardHeader>
							<CardTitle>Organization Settings</CardTitle>
							<CardDescription>
								Update your Organization details
							</CardDescription>
						</CardHeader>
						<CardContent>
							<OrganizationForm />
						</CardContent>
					</Card>
				)}

				{canShutDownOrganization && (
					<Card>
						<CardHeader>
							<CardTitle>Shutdown organization</CardTitle>
							<CardDescription>
								This will delete all data including all projects. You
								cannot undo this action.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ShutDownOrganizationButton />
						</CardContent>
					</Card>
				)}
			</div>
			{canGetBilling && <div>Billing</div>}
		</div>
	);
}
