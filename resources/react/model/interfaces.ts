export type ProjectStoreResource = {
	name: string;
	note: string | null;
};
export type ProjectResource = ProjectStoreResource & {
	projectId: string;
};
