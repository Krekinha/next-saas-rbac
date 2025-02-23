import { Header } from "@/components/header";

export default async function Project({
	params,
}: { params: { slug: string; projectSlug: string } }) {
	const { projectSlug } = await params;
	return (
		<div className="space-y-4 py-4">
			<Header />
			<main className="mx-auto w-full max-w-[1200px]">
				<h2>Project</h2>
				<h1>{projectSlug}</h1>
			</main>
		</div>
	);
}
