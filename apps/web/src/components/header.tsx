import Image from "next/image";

import githubIcon from "@/assets/github-icon.svg";
import { ability } from "@/auth/auth";
import { Slash } from "lucide-react";
import { OrganizationSwitcher } from "./organization-switcher";
import { PendingInvites } from "./pending-invites";
import { ProfileButton } from "./profile-button";
import { ProjectSwitcher } from "./project-switcher";
import { ThemeSwitcher } from "./theme/theme-switcher";
import { Separator } from "./ui/separator";

export async function Header() {
	const permissions = await ability();

	return (
		<div className="mx-auto flex max-w-[1200px] items-center justify-between">
			<div className="flex items-center gap-3">
				<Image
					src={githubIcon}
					alt="github"
					className="size-6 dark:invert"
				/>
				<Slash className="-rotate-[24deg] size-3 text-border " />
				<OrganizationSwitcher />
				{permissions?.can("get", "Project") && (
					<>
						<Slash className="-rotate-[24deg] size-3 text-border " />
						<ProjectSwitcher />
					</>
				)}
			</div>

			<div className="flex items-center gap-4">
				<PendingInvites />
				<ThemeSwitcher />
				<Separator orientation="vertical" className="h-5" />
				<ProfileButton />
			</div>
		</div>
	);
}
