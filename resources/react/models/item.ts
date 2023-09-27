import { Model } from 'functions/model';
import { ProjectItemResource, ProjectItemStoreResource } from './interfaces';

export class Item extends Model<ProjectItemResource, ProjectItemStoreResource> {
	protected path: string = '/v1/project/{project}/item/{item?}';
	protected resourceId_key: string = 'item';
	protected default_params: { [s: string]: string | number } = { project: '' };
}
