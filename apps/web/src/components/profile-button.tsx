import { auth } from "@/auth/auth";
import { ChevronDownIcon, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export async function ProfileButton() {
	const authResult = await auth();
	const user = authResult?.user;

	function getInitials(name: string) {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("");
	}
	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="flex items-center gap-3 outline-none">
				<div className="flex flex-col items-end">
					<span className="font-medium text-sm">{user.name}</span>
					<span className="text-muted-foreground text-xs">
						{user.email}
					</span>
				</div>
				<Avatar className="size-8">
					{user.avatarUrl ? (
						<AvatarImage src={user.avatarUrl} />
					) : (
						<AvatarFallback>
							{getInitials(user.name ?? "CN")}
						</AvatarFallback>
					)}
				</Avatar>
				<ChevronDownIcon className="size-4 text-muted-foreground" />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem asChild>
					<a href="/api/auth/sign-out">
						<LogOut className="mr-2" />
						Sign out
					</a>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
