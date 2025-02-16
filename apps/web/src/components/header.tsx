import Image from "next/image";

import githubIcon from "@/assets/github-icon.svg";
import { ability } from "@/auth/auth";
import { Slash } from "lucide-react";
import { OrganizationSwitcher } from "./organization-switcher";
import { ProfileButton } from "./profile-button";
import { ThemeSwitcher } from "./theme/theme-switcher";
import { Separator } from "./ui/separator";

export async function Header() {
	const permissions = await ability();
	console.log(permissions);

	return (
		<div className="max-auto flex max-w-full items-center justify-between px-4">
			<div className="flex items-center gap-3">
				<Image
					src={githubIcon}
					alt="github"
					className="size-6 dark:invert"
				/>
				<Slash className="-rotate-[24deg] size-3 text-border " />
				<OrganizationSwitcher />

				{permissions?.can("get", "Project") && <p>Projetos</p>}
			</div>

			<div className="flex items-center gap-4">
				<ThemeSwitcher />
				<Separator orientation="vertical" className="h-5" />
				<ProfileButton />
			</div>
		</div>
	);
}
