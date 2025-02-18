import { Header } from "@/components/header";

export default async function ProjectsPage({
	params,
}: {
	params: { slug: string };
}) {
	// const slug = await params.slug;
	return (
		<div className="py-4">
			<Header />
			<h1>Projects</h1>
			<pre>{JSON.stringify(await params, null, 2)}</pre>
		</div>
	);
}
