import { cookie, createKey, isString } from '.';

// 関数引数
export type ApiBaseType = {
	url: string;
	headers?: object;
};
export type ApiType = ApiBaseType & {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	body?: BodyInit;
};
export type ApiGetType = ApiBaseType & {};
export type ApiPostType = ApiBaseType & {
	body?: BodyInit;
};
// レスポンスステータス
export type ResponseStatusType = {
	result: boolean;
	nonce: string;
	code: number;
};
//エラーレスポンス
export type ResponseErrorType = {
	abstract: string;
	title: string;
	code: number;
	messages: string[];
};
//ページネーションメタ
export type ResponseMetaType = {
	currentPage: number;
	lastPage: number;
	length: number;
	getLength: number;
	per: number;
};
export type ResponseIndexType<T = object> = {
	meta: ResponseMetaType;
	items: T[];
};
// レスポンス
export type ResponseType<T = object> = {
	status: ResponseStatusType;
	payloads?: T;
	error?: ResponseErrorType;
};
/**
 * API通信
 *
 * @export
 * @param {ApiType} {
 * 	base_url = undefined,
 * 	endpoint = '',
 * 	method = 'GET',
 * 	body = undefined,
 * 	headers = undefined,
 * }
 * @return {*}  {(Promise<ResponseType>)}
 */
export default async function send<T = any>({
	url = '',
	method = 'GET',
	body = undefined,
	headers = undefined,
}: ApiType): Promise<ResponseType<T> | null> {
	//NONCE
	const _nonce: string = createKey();

	//送信オプション作成
	let _option: RequestInit = {
		method: method,
		credentials: 'include',
	};
	if (body !== undefined) _option['body'] = body;

	//ヘッダ作成
	_option['headers'] = {
		...{},
		Accept: 'application/json',
		'X-XSRF-TOKEN': cookie('XSRF-TOKEN', ''),
		'X-NONCE': _nonce,
		...headers,
	};

	const _result: ResponseType<T> | string | null = await fetch(url, _option)
		.then((res: Response): Promise<ResponseType<T>> | null => {
			if (res.status === 204) return null;
			return res.json();
		})
		.then((res: ResponseType<T> | null): ResponseType<T> | null => res)
		.catch((error: string): string => error);

	if (isString(_result)) throw new Error(_result as string);

	if (_result === null) return null;

	const _response: ResponseType<T> = _result as ResponseType<T>;
	if (!_response['status'] || _nonce !== _response['status']['nonce']) throw new Error('NONCEの不一致');

	return _response;
}

/**
 * GET送信
 *
 * @export
 * @param {ApiGetType} { base_url = undefined, endpoint, headers = undefined }
 * @return {*}
 */
export async function sendGet<T = any>({ url, headers = undefined }: ApiGetType): Promise<ResponseType<T> | null> {
	return await send<T>({
		url: url,
		method: 'GET',
		headers: headers,
	});
}

/**
 * POST送信
 *
 * @export
 * @param {ApiPostType} { base_url = undefined, endpoint, body = '', headers = undefined }
 * @return {*}
 */
export async function sendPost<T = any>({
	url,
	body = undefined,
	headers = undefined,
}: ApiPostType): Promise<ResponseType<T> | null> {
	return await send<T>({
		url: url,
		body: body,
		method: 'POST',
		headers: headers,
	});
}

/**
 * PUT送信
 *
 * @export
 * @param {ApiPostType} { base_url = undefined, endpoint, body = '', headers = undefined }
 * @return {*}
 */
export async function sendPut<T = any>({
	url,
	body = undefined,
	headers = undefined,
}: ApiPostType): Promise<ResponseType<T> | null> {
	return await send<T>({
		url: url,
		body: body,
		method: 'PUT',
		headers: headers,
	});
}

/**
 * DELETE送信
 *
 * @export
 * @param {ApiPostType} { base_url = undefined, endpoint, body = '', headers = undefined }
 * @return {*}
 */
export async function sendDelete<T = any>({
	url,
	body = undefined,
	headers = undefined,
}: ApiPostType): Promise<ResponseType<T> | null> {
	return await send<T>({
		url: url,
		body: body,
		method: 'DELETE',
		headers: headers,
	});
}

export type ParamType = {
	[s: string]: string | number;
};
export type ParamIndexType = ParamType & {
	per: number;
	page: number;
	order: 'asc' | 'desc';
};
export function createUrl(url: string, param: ParamType = {}): string {
	return `${url}?${createQuery(param)}`;
}

export function createQuery(param: ParamType): string {
	let queries: string[] = [];
	Object.keys(param).forEach(function (key) {
		queries.push(`${key}="${param[key]}`);
	});
	return queries.join('&');
}
