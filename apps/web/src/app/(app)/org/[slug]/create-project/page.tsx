import { ability } from "@/auth/auth";
import { Header } from "@/components/header";
import { redirect } from "next/navigation";
import { ProjectForm } from "./project-form";

export default async function CreateProject() {
	const permissions = await ability();

	if (permissions?.cannot("create", "Project")) {
		redirect("/");
	}
	return (
		<div className="space-y-4 py-4">
			<Header />
			<main className="mx-auto w-full max-w-[1200px]">
				<h1 className="pb-4 font-bold text-2xl">Create project</h1>
				<ProjectForm />
			</main>
		</div>
	);
}
