import { Model } from 'functions/model';
import { ProgressResource, ProgressStoreResource } from './interfaces';

export class Progress extends Model<ProgressResource, ProgressStoreResource> {
	protected path: string = '/v1/project/{project}/progress/{progress?}';
	protected resourceId_key: string = 'progress';
}
export const ProgressStoreInit: ProgressStoreResource = {
	need_auth: true,
	logged: false,
};
