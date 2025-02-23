"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getProjects } from "@/http/get-projects";
import { useQuery } from "@tanstack/react-query";
import { ChevronsUpDown, Loader2, PlusCircleIcon } from "lucide-react";
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
import { Skeleton } from "./ui/skeleton";

export function ProjectSwitcher() {
	const { slug: orgSlug, projectSlug } = useParams<{
		slug: string;
		projectSlug: string;
	}>();

	// console.log("proje", projects);

	const { data, isLoading } = useQuery({
		queryKey: [orgSlug, "projects"],
		queryFn: () => getProjects(orgSlug),
		enabled: !!orgSlug,
	});

	const currentProject =
		data && projectSlug
			? data.projects.find((project) => project.slug === projectSlug)
			: null;

	// console.log("data", data);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="flex w-[168px] items-center gap-2 rounded border p-1 font-medium text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary">
				{isLoading ? (
					<>
						<Skeleton className="size-4 shrink-0 rounded-full" />
						<Skeleton className="h-4 w-full" />
					</>
				) : (
					<>
						{currentProject ? (
							<>
								<Avatar className="size-4">
									<AvatarImage
										src={currentProject.avatarUrl ?? undefined}
									/>
									<AvatarFallback />
								</Avatar>
								<span className="truncate text-left">
									{currentProject.name}
								</span>
							</>
						) : (
							<span className="text-muted-foreground">
								Select project
							</span>
						)}
					</>
				)}
				{isLoading ? (
					<Loader2 className="ml-auto size-4 shrink-0 animate-spin text-muted-foreground" />
				) : (
					<ChevronsUpDown className="ml-auto size-4 shrink-0 text-muted-foreground" />
				)}
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				alignOffset={-16}
				sideOffset={12}
				className="w-[200px]"
			>
				<DropdownMenuGroup>
					<DropdownMenuLabel>Projects</DropdownMenuLabel>
					{data &&
						data.projects.map((project) => (
							<DropdownMenuItem key={project.id} asChild>
								<Link
									href={`/org/${orgSlug}/project/${project.slug}`}
								>
									<Avatar className="mr-2 size-4">
										{project.avatarUrl && (
											<AvatarImage
												src={project.avatarUrl ?? undefined}
											/>
										)}

										<AvatarFallback />
									</Avatar>
									<span className="line-clamp-1">
										{project.name}
									</span>
								</Link>
							</DropdownMenuItem>
						))}
					<DropdownMenuSeparator />
					<DropdownMenuItem asChild>
						<Link href={`/org/${orgSlug}/create-project`}>
							<PlusCircleIcon className="mr-2 size-4" />
							<span>Create new</span>
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
