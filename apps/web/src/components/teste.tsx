"use client";
import { getProjects } from "@/http/get-projects";
import { useQuery } from "@tanstack/react-query";
// import { getProjects } from "@/http/get-projects";
// import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function Teste() {
	// const params = useParams<{ slug: string }>();
	const { slug } = useParams<{ slug: string }>();
	console.log("params: ", slug);

	// const data = use(getProjects(slug));
	// console.log("data: ", data);

	// console.log("proje", projects);

	const { data, isLoading } = useQuery({
		queryKey: [slug, "projects"],
		queryFn: () => getProjects(slug),
		enabled: !!slug,
	});

	return (
		<div>
			<span>Projetos:</span>
			<span>Slug: {slug}</span>
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</div>
	);
}
