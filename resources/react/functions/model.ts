import { Model } from '@ikepu-tp/react-mvc';
import { IndexParamProps } from '@ikepu-tp/react-mvc/dist/esm/Model';
import { ParamType } from '@ikepu-tp/react-mvc/dist/esm/Url';
import {
	ParamIndexType,
	ResponseErrorType,
	ResponseIndexType,
	ResponseType,
	createUrl,
	sendDelete,
	sendGet,
	sendPost,
	sendPut,
} from '~/functions/fetch';

export type PathParametersType = {
	[s: string]: string | number | boolean | any;
};
export type IndexParamType = ParamType & ParamIndexType & {};
export type NormalParamType = ParamType & {};
export type RequiredParamType = PathParametersType;
export class M<T = any, S = any, IPT = IndexParamProps, NPT = ParamType, RPT = RequiredParamType> extends Model<
	ResponseType,
	PathParametersType,
	T,
	S,
	S,
	IPT,
	NPT,
	NPT,
	NPT,
	NPT,
	RPT,
	{},
	ResponseErrorType
> {
	protected domain: string | undefined = '/api';
	protected base_route: string | undefined = '/test/{testId}';
	protected default_params: { [s: string]: string | number } = {};
	protected resourceId_key: string = 'testId';

	constructor(
		default_params: { [s: string]: string | number } = {},
		headers: HeadersInit & { [s: string]: string } = {
			'Content-Type': 'application/json',
		}
	) {
		super(default_params, headers);
		if (this.domain) this.url.setBaseUrl(this.domain);
		if (this.base_route) this.path = this.base_route;
	}

	/**
	 * 一覧リソース
	 *
	 * @param {ParamIndexType} [params={ page: 1, per: 100, order: 'asc' }]
	 * @return {*}  {Promise<ResponseType<ResponseIndexType<T>>>}
	 * @memberof Model
	 */
	public async index<P = ResponseType<ResponseIndexType<T>>>(
		params: (IPT & ParamType & RPT) | undefined = undefined
	): Promise<P> {
		return super.index<P>(params);
	}

	/**
	 * 取得リソース
	 *
	 * @param {T} resource
	 * @return {*}  {Promise<ResponseType<T>>}
	 * @memberof Model
	 */
	public async show<P = ResponseType<T>>(
		id: string,
		params: (NPT & PathParametersType & ParamType & RPT) | undefined = undefined
	): Promise<P> {
		let param: ParamType & PathParametersType = {};
		if (params !== undefined) param = { ...params, ...params };
		param[this.resourceId_key] = id;
		return super.show<P>(param as NPT & ParamType & RPT);
	}

	/**
	 * 作成リソース
	 *
	 * @param {T} resource
	 * @return {*}  {Promise<ResponseType<T>>}
	 * @memberof Model
	 */
	public async store(resource: S, param: ParamType = {}): Promise<ResponseType<T> | null> {
		return await sendPost<T>({ url: this.generateUrl(param), body: JSON.stringify(resource), headers: this.headers });
	}

	/**
	 * 更新リソース
	 *
	 * @param {T} resource
	 * @return {*}  {Promise<ResponseType<T>>}
	 * @memberof Model
	 */
	public async update(id: string, resource: S, param: ParamType = {}): Promise<ResponseType<T> | null> {
		param[this.resourceId_key] = id;
		return await sendPut<T>({ url: this.generateUrl(param), body: JSON.stringify(resource), headers: this.headers });
	}

	/**
	 * 削除リソース
	 *
	 * @param {T} resource
	 * @return {*}  {Promise<ResponseType<T>>}
	 * @memberof Model
	 */
	public async destroy(id: string, param: ParamType = {}): Promise<ResponseType<T> | null> {
		param[this.resourceId_key] = id;
		return await sendDelete<T>({ url: this.generateUrl(param), headers: this.headers });
	}
}
