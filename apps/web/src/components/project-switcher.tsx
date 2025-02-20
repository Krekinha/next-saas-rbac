"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getProjects } from "@/http/get-projects";
import { useQuery } from "@tanstack/react-query";
import { ChevronsUpDown, PlusCircleIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function ProjectSwitcher() {
	const { slug: orgSlug } = useParams<{ slug: string }>();

	const { data, isLoading } = useQuery({
		queryKey: [orgSlug, "projects"],
		queryFn: () => getProjects(orgSlug),
		enabled: !!orgSlug,
	});

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="flex w-[168px] items-center gap-2 rounded border p-1 font-medium text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary">
				{/* {currentOrg ? (
					<>
						<Avatar className="mr-2 size-4">
							<AvatarImage src={currentOrg.avatarUrl ?? undefined} />
							<AvatarFallback />
						</Avatar>
						<span className="truncate text-left">{currentOrg.name}</span>
					</>
				) : ( */}
				<span className="text-muted-foreground">Select project</span>
				{/* )} */}
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
					{/* {organizations.map((organization) => ( */}
					<DropdownMenuItem /*key={organization.id}*/ asChild>
						<Link href={""}>
							<Avatar className="mr-2 size-4">
								{/* <AvatarImage
										src={organization.avatarUrl ?? undefined}
									/> */}
								<AvatarFallback />
							</Avatar>
							<span className="line-clamp-1">Projeto teste</span>
						</Link>
					</DropdownMenuItem>
					{/* ))} */}
					<DropdownMenuSeparator />
					<DropdownMenuItem asChild>
						<Link href="">
							<PlusCircleIcon className="mr-2 size-4" />
							<span>Create new</span>
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
