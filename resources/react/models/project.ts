import { Model } from '~/functions/model';
import { ProjectResource, ProjectStoreResource } from './interfaces';

export class Project extends Model<ProjectResource, ProjectStoreResource> {
	protected path: string = '/v1/project/{project?}';
	protected resourceId_key: string = 'project';
}
export const ProjectStoreInit: ProjectStoreResource = {
	name: '',
	note: null,
};
