import { api } from "./api-client";

interface GetProjectsResponse {
	projects: {
		description: string;
		slug: string;
		id: string;
		name: string;
		avatarUrl: string | null;
		organizationId: string;
		ownerId: string;
		createdAt: string;
		owner: {
			id: string;
			name: string | null;
			avatarUrl: string | null;
		};
	}[];
}

export async function getProjects(org: string) {
	console.log("org: ", org);
	// const instance = await api.head(`organizations/${org}/projects`);
	// console.log("api: ", instance);
	const result = await api
		.get(`organizations/${org}/projects`)
		.json<GetProjectsResponse>();

	return result;
}
