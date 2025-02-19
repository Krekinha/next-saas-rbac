import { Header } from "@/components/header";

export default async function ProjectsPage({
	params,
}: {
	params: { slug: string };
}) {
	// const slug = await params.slug;
	return (
		<div className="space-y-4 py-4">
			<Header />
			<main className="mx-auto w-full max-w-[1200px]">
				<h1>Projects</h1>
				<pre>{JSON.stringify(await params, null, 2)}</pre>
			</main>
		</div>
	);
}
