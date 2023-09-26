import { Model } from 'functions/model';
import { CheckResource, CheckStoreResource } from './interfaces';

export class Check extends Model<CheckResource, CheckStoreResource> {
	protected path: string = '/v1/project/{project}/check/{check}';
	protected resourceId_key: string = 'check';
	protected default_params: { [s: string]: string | number } = { project: '' };
}
