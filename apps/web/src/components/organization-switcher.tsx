import { getCurrentOrgSlug } from "@/auth/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getOrganizations } from "@/http/get-organizations";
import { ChevronsUpDown, PlusCircleIcon } from "lucide-react";
import Link from "next/link";

export async function OrganizationSwitcher() {
	const currentOrgSlug = await getCurrentOrgSlug();

	const { organizations } = await getOrganizations();
	const currentOrg = organizations.find((org) => org.slug === currentOrgSlug);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="flex w-[168px] items-center gap-2 rounded border p-1 font-medium text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary">
				{currentOrg ? (
					<>
						<Avatar className="mr-2 size-4">
							<AvatarImage src={currentOrg.avatarUrl ?? undefined} />
							<AvatarFallback />
						</Avatar>
						<span className="truncate text-left">{currentOrg.name}</span>
					</>
				) : (
					<span className="text-muted-foreground">
						Select organization
					</span>
				)}
				<ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				alignOffset={-16}
				sideOffset={12}
				className="w-[200px]"
			>
				<DropdownMenuGroup>
					<DropdownMenuLabel>Organizations</DropdownMenuLabel>
					{organizations.map((organization) => (
						<DropdownMenuItem key={organization.id} asChild>
							<Link href={`/org/${organization.slug}`}>
								<Avatar className="mr-2 size-4">
									<AvatarImage
										src={organization.avatarUrl ?? undefined}
									/>
									<AvatarFallback />
								</Avatar>
								<span className="line-clamp-1">
									{organization.name}
								</span>
							</Link>
						</DropdownMenuItem>
					))}
					<DropdownMenuSeparator />
					<DropdownMenuItem asChild>
						<Link href="/create-organization">
							<PlusCircleIcon className="mr-2 size-4" />
							<span>Create new</span>
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
