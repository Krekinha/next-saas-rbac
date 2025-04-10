import { ability, getCurrentOrgSlug } from "@/auth/auth";
import {} from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { getInvites } from "@/http/get-invites";
import { CreateInviteForm } from "./create-invite-form";
import { RevokeInviteButton } from "./revoke-invite-button";

export async function Invites() {
	const currentOrg = await getCurrentOrgSlug();
	const permissions = await ability();

	const { invites } = await getInvites(currentOrg!);

	return (
		<div className="space-y-4">
			{permissions?.can("create", "Invite") && (
				<Card>
					<CardHeader>
						<CardTitle>Invite member</CardTitle>
					</CardHeader>
					<CardContent>
						<CreateInviteForm />
					</CardContent>
				</Card>
			)}

			<div className="space-y-2">
				<h2 className="font-semibold text-lg">Invites</h2>

				<div className="rounded border">
					<Table>
						<TableBody>
							{invites.map((invite) => {
								return (
									<TableRow key={invite.id}>
										<TableCell className="py-2.5">
											<span className="text-muted-foreground">
												{invite.email}
											</span>
										</TableCell>
										<TableCell className="py-2.5">
											<div className="flex flex-col">
												{invite.role}
											</div>
										</TableCell>
										<TableCell className="py-2.5">
											<div className="flex justify-end">
												{permissions?.can(
													"delete",
													"Invite",
												) && (
													<RevokeInviteButton
														inviteId={invite.id}
													/>
												)}
											</div>
										</TableCell>
									</TableRow>
								);
							})}

							{invites.length === 0 && (
								<TableRow>
									<TableCell className="text-center text-muted-foreground">
										No invites found
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
}
