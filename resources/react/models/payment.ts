import { Model } from 'functions/model';
import { ProjectPaymentResource, ProjectPaymentStoreResource } from './interfaces';

export class Member extends Model<ProjectPaymentResource, ProjectPaymentStoreResource> {
	protected base_route: string = '/v1/project/{project}/payment/{payment?}';
	protected resourceId_key: string = 'payment';
	protected default_params: { [s: string]: string | number } = { project: '' };
}
