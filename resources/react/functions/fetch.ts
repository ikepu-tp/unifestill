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
 * @return {*}  {(Promise<ResponseType | false>)}
 */
export default async function send({
	url = '',
	method = 'GET',
	body = undefined,
	headers = undefined,
}: ApiType): Promise<ResponseType | false> {
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

	const _result: ResponseType | string = await fetch(url, _option)
		.then((res: Response): Promise<ResponseType> => res.json())
		.then((res: ResponseType): ResponseType => res)
		.catch((error: string): string => error);

	if (isString(_result)) throw new Error(_result as string);

	const _response: ResponseType = _result as ResponseType;
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
export async function sendGet({ url, headers = undefined }: ApiGetType): Promise<false | ResponseType> {
	return await send({
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
export async function sendPost({
	url,
	body = undefined,
	headers = undefined,
}: ApiPostType): Promise<false | ResponseType> {
	return await send({
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
export async function sendPut({
	url,
	body = undefined,
	headers = undefined,
}: ApiPostType): Promise<false | ResponseType> {
	return await send({
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
export async function sendDelete({
	url,
	body = undefined,
	headers = undefined,
}: ApiPostType): Promise<false | ResponseType> {
	return await send({
		url: url,
		body: body,
		method: 'DELETE',
		headers: headers,
	});
}
