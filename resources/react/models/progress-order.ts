import { Model } from 'functions/model';
import { ProgressResource } from './interfaces';

export class ProgressOrder extends Model<ProgressResource, { logged: boolean }> {
	protected path: string = '/v1/progress/{progress}';
	protected resourceId_key: string = 'progress';
}
