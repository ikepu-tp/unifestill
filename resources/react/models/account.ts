import { Model } from 'functions/model';
import { AccountResource, AccountStoreResource } from './interfaces';

export class Account extends Model<AccountResource, AccountStoreResource> {
	protected path: string = '/v1/project/{project}/account/{account?}';
	protected resourceId_key: string = 'account';
	protected default_params: { [s: string]: string | number } = { project: '' };
}
export const AccountStoreInit: AccountStoreResource = {
	member_id: '',
	price: 0,
	payments: [],
	items: [],
};
