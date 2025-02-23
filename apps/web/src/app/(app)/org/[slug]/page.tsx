import { Header } from "@/components/header";

export default async function ProjectsPage({
	params,
}: {
	params: { slug: string; projectSlug: string };
}) {
	const { slug: orgSlug, projectSlug } = await params;
	return (
		<div className="space-y-4 py-4">
			<Header />
			<main className="mx-auto w-full max-w-[1200px]">
				<h1>Org Page</h1>
				<h1>{orgSlug}</h1>
			</main>
		</div>
	);
}
