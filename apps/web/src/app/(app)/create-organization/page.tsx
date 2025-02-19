import { Header } from "@/components/header";
import { OrganizationForm } from "./organization-form";

export default function CreateOrganization() {
	return (
		<div className="space-y-4 py-4">
			<Header />
			<main className="mx-auto w-full max-w-[1200px]">
				<OrganizationForm />
			</main>
		</div>
	);
}
