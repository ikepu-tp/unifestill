import { ResponseIndexType, ResponseType } from '~/functions/fetch';

export function SuccessResponse<T = any>(
	payloads: any | undefined = undefined,
	response_code: number = 200
): ResponseType<T> {
	let returns: ResponseType<T> = {
		status: {
			result: true,
			nonce: 'NONCE',
			code: response_code,
		},
	};
	if (payloads !== undefined) returns['payloads'] = payloads;
	return returns;
}
export function IndexResponse<T>(items: T[]): ResponseIndexType<T> {
	return {
		meta: {
			currentPage: 1,
			lastPage: 2,
			length: 200,
			getLength: 100,
			per: 100,
		},
		items: items,
	};
}

export function ResponseResource<T = any>(
	resource: T
): {
	index: () => ResponseType<ResponseIndexType<T>>;
	show: () => ResponseType<T>;
	store: () => ResponseType<T>;
	update: () => ResponseType<T>;
	destroy: () => ResponseType<T> | null;
} {
	return {
		index: () => SuccessResponse<ResponseIndexType<T>>(IndexResponse<T>([resource])),
		show: () => SuccessResponse<T>(resource),
		store: () => SuccessResponse<T>(resource, 201),
		update: () => SuccessResponse<T>(resource),
		destroy: () => null,
	};
}
