import { Model } from 'functions/model';
import { ReportResource } from './interfaces';

export class Report extends Model<ReportResource> {
	protected path: string = '/v1/project/{project}/report';
	protected resourceId_key: string = '';
	protected default_params: { [s: string]: string | number } = { project: '' };
}
