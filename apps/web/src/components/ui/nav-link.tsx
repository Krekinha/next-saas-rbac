"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

interface NavLinkPropos extends ComponentProps<typeof Link> {}
export function NavLink(props: NavLinkPropos) {
	const pathname = usePathname();

	const isCurrent = props.href.toString() === pathname;
	return <Link {...props} data-current={isCurrent} {...props} />;
}
