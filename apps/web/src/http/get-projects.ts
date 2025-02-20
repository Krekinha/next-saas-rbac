import { api } from "./api-client";

interface GetProjectsResponse {
	projects: {
		id: string;
		description: string;
		name: string | null;
		slug: string;
		avatarUrl: string | null;
		organizationId: string;
		ownerId: string;
		createdAt: Date;
		owner: {
			id: string;
			name: string | null;
			avatarUrl: string | null;
		};
	}[];
}

export async function getProjects(org: string) {
	const result = await api
		.get(`organizations/${org}/projects`)
		.json<GetProjectsResponse>();

	return result;
}
