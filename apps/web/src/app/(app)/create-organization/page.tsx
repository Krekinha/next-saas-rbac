import { Header } from "@/components/header";
import { OrganizationForm } from "../org/organization-form";

export default function CreateOrganization() {
	return (
		<div className="space-y-4 py-4">
			<Header />
			<main className="mx-auto w-full max-w-[1200px]">
				<h1 className="font-bold text-2xl">Create organization</h1>
				<OrganizationForm />
			</main>
		</div>
	);
}
