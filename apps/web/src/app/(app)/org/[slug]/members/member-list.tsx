import { ability, getCurrentOrgSlug } from "@/auth/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { getMembers } from "@/http/get-members";
import { getMembership } from "@/http/get-membership";
import { getOrganization } from "@/http/get-organization";
import { organizationSchema } from "@saas/auth";
import { ArrowLeftRight, Crown, UserMinus } from "lucide-react";
import Image from "next/image";
import { removeMemberAction } from "./actions";

export async function MemberList() {
	const currentOrg = await getCurrentOrgSlug();
	const permissions = await ability();

	const [{ membership }, { members }, { organization }] = await Promise.all([
		getMembership(currentOrg!),
		getMembers(currentOrg!),
		getOrganization(currentOrg!),
	]);

	const authOrganization = organizationSchema.parse(organization);

	return (
		<div className="space-y-2">
			<h2 className="font-semibold text-lg">Members</h2>

			<div className="rounded border">
				<Table>
					<TableBody>
						{members.map((member) => {
							return (
								<TableRow key={member.id}>
									<TableCell
										className="py-2.5"
										style={{ width: 48 }}
									>
										<Avatar>
											<AvatarFallback />
											{member.avatarUrl && (
												<Image
													src={member.avatarUrl}
													width={32}
													height={32}
													alt=""
													className="aspect-square size-full"
												/>
											)}
										</Avatar>
									</TableCell>
									<TableCell className="py-2.5">
										<div className="flex flex-col">
											<span className="inline-flex items-center gap-2 font-medium">
												{member.name}
												{member.userId ===
													membership.userId && " (Você)"}
												{organization.ownerId ===
													member.userId && (
													<span className="inline-flex items-center gap-1 text-muted-foreground text-xs">
														<Crown className="size-3" />
														Owner
													</span>
												)}
											</span>

											<span className="text-muted-foreground text-xs">
												{member.email}
											</span>
										</div>
									</TableCell>
									<TableCell className="py-2.5">
										<div className="flex items-center justify-end gap-2">
											{permissions?.can(
												"transfer_ownership",
												authOrganization,
											) && (
												<Button size="sm" variant="outline">
													<ArrowLeftRight className="mr-2 size-4" />
													Transfer ownership
												</Button>
											)}

											{permissions?.can("delete", "User") && (
												<form
													action={removeMemberAction.bind(
														null,
														member.id,
													)}
												>
													<Button
														disabled={
															member.userId ===
																membership.userId ||
															member.userId ===
																organization.ownerId
														}
														size="sm"
														variant="destructive"
														type="submit"
													>
														<UserMinus className="mr-2 size-4" />
														Remove
													</Button>
												</form>
											)}
										</div>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
