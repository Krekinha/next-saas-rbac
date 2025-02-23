import { InterceptSheetContent } from "@/components/intercept-sheet-content";
import { Sheet, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { OrganizationForm } from "../../org/organization-form";

export default function CreateOrganization() {
	return (
		<Sheet defaultOpen>
			<InterceptSheetContent>
				<SheetHeader>
					<SheetTitle>Create organization</SheetTitle>
				</SheetHeader>

				<div className="space-y-4">
					<OrganizationForm />
				</div>
			</InterceptSheetContent>
		</Sheet>
	);
}
