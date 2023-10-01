import { Model } from 'functions/model';
import { AccountResource, AccountStoreResource, AccountUpdateResource } from './interfaces';

export class Account extends Model<AccountResource, AccountStoreResource, AccountUpdateResource> {
	protected path: string = '/v1/project/{project}/account/{account?}';
	protected resourceId_key: string = 'account';
}
export const AccountStoreInit: AccountStoreResource = {
	member_id: '',
	price: 0,
	payments: [],
	items: [],
	order_status: 'ordered',
};
