import { Model } from 'functions/model';
import { ProjectMemberResource, ProjectMemberStoreResource } from './interfaces';

export class Member extends Model<ProjectMemberResource, ProjectMemberStoreResource> {
	protected path: string = '/v1/project/{project}/member/{member?}';
	protected resourceId_key: string = 'member';
	protected default_params: { [s: string]: string | number } = { project: '' };
}
