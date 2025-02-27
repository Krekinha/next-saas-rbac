import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export async function ProjectList() {
	// const currentOrg = await getCurrentOrgSlug();

	return (
		<div className="grid grid-cols-3 gap-4">
			<Card>
				<CardHeader>
					<CardTitle>Projeto 01</CardTitle>
					<CardDescription className="line-clamp-2 leading-relaxed">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint
						repudiandae minima tenetur! Distinctio inventore obcaecati
						minus odio. Reprehenderit ipsam at incidunt esse amet
						laudantium sint ab dicta, corrupti quasi earum!
					</CardDescription>
				</CardHeader>
				<CardFooter className="flex items-center gap-1.5">
					<Avatar className="size-4">
						<AvatarImage src="" />
						<AvatarFallback />
					</Avatar>
					<span className="text-muted-foreground text-xs">
						Created by{" "}
						<span className="font-medium text-foreground">
							Krekinha do bozo
						</span>{" "}
						a day ago
					</span>

					<Button size="xs" variant="outline" className="ml-auto">
						View <ArrowRight className="ml-2 size-3" />
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
