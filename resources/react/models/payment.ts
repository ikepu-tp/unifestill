import { Model } from 'functions/model';
import { ProjectPaymentResource, ProjectPaymentStoreResource } from './interfaces';

export class Payment extends Model<ProjectPaymentResource, ProjectPaymentStoreResource> {
	protected path: string = '/v1/project/{project}/payment/{payment?}';
	protected resourceId_key: string = 'payment';
	protected default_params: { [s: string]: string | number } = { project: '' };
}
export const ProjectPaymentStoreInit: ProjectPaymentStoreResource = {
	name: '',
	note: null,
};
