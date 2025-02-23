import { ability, getCurrentOrgSlug } from "@/auth/auth";
import { Button } from "./ui/button";
import { NavLink } from "./ui/nav-link";

export async function Tabs() {
	const currentOrg = await getCurrentOrgSlug();
	const permissions = await ability();

	const canUpdateOrganization = permissions?.can("update", "Organization");
	const canGetMembers = permissions?.can("get", "User");
	const canGetProjects = permissions?.can("get", "Project");
	const canGetBilling = permissions?.can("get", "Billing");

	return (
		<div className="border-b py-4">
			<nav className="mx-auto flex max-w-[1200px] items-center gap-2">
				{canGetProjects && (
					<Button
						asChild
						variant="ghost"
						size="sm"
						className="border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground"
					>
						<NavLink href={`/org/${currentOrg}`}>Projects</NavLink>
					</Button>
				)}

				{canGetMembers && (
					<Button
						asChild
						variant="ghost"
						size="sm"
						className="border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground"
					>
						<NavLink href={`/org/${currentOrg}/members`}>
							Members
						</NavLink>
					</Button>
				)}

				{(canUpdateOrganization || canGetBilling) && (
					<Button
						asChild
						variant="ghost"
						size="sm"
						className="border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground"
					>
						<NavLink href={`/org/${currentOrg}/settings`}>
							Settings & Billing
						</NavLink>
					</Button>
				)}
			</nav>
		</div>
	);
}
