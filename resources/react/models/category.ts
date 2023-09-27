import { Model } from 'functions/model';
import { ProjectCategoryResource, ProjectCategoryStoreResource } from './interfaces';

export class Category extends Model<ProjectCategoryResource, ProjectCategoryStoreResource> {
	protected path: string = '/v1/project/{project}/category/{category}';
	protected resourceId_key: string = 'category';
	protected default_params: { [s: string]: string | number } = { project: '' };
}
export const ProjectCategoryStoreInit: ProjectCategoryStoreResource = {
	name: '',
	note: null,
};
