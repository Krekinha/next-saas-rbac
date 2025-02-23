import { ProjectForm } from "@/app/(app)/org/[slug]/create-project/project-form";
import { InterceptSheetContent } from "@/components/intercept-sheet-content";
import { Sheet, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export default function CreateProject() {
	return (
		<Sheet defaultOpen>
			<InterceptSheetContent>
				<SheetHeader>
					<SheetTitle>Create project</SheetTitle>
				</SheetHeader>

				<div className="py-4">
					<ProjectForm />
				</div>
			</InterceptSheetContent>
		</Sheet>
	);
}
