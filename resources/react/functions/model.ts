import { Model } from '@ikepu-tp/react-mvc';
import { IndexParamProps } from '@ikepu-tp/react-mvc/Model';
import { ParamType } from '@ikepu-tp/react-mvc/Url';
import { ParamIndexType, ResponseErrorType, ResponseIndexType, ResponseType } from '~/functions/fetch';

export type PathParametersType = {
	[s: string]: string | number | boolean;
};
export type IndexParamType = ParamType & ParamIndexType & {};
export type NormalParamType = ParamType & {};
export type RequiredParamType = PathParametersType;
export class M<
	T = any,
	S = any,
	IPT = IndexParamProps,
	NPT = ParamType,
	RPT = RequiredParamType,
	D = any
> extends Model<ResponseType<T>, PathParametersType, T, S, S, IPT, NPT, NPT, NPT, NPT, RPT, {}, ResponseErrorType> {
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
		if (params === undefined) params = {};
		params[this.resourceId_key] = id;
		return super.show<P>(param as NPT & ParamType & RPT);
	}

	/**
	 * 作成リソース
	 *
	 * @param {T} resource
	 * @return {*}  {Promise<ResponseType<T>>}
	 * @memberof Model
	 */
	public async store<P = ResponseType<T>>(
		resource: S,
		param: (ParamType & PathParametersType & NPT) | undefined = undefined
	): Promise<P> {
		return super.store<P>(resource, param);
	}

	/**
	 * 更新リソース
	 *
	 * @param {T} resource
	 * @return {*}  {Promise<ResponseType<T>>}
	 * @memberof Model
	 */
	public async update<P = ResponseType<T>>(
		id: string,
		resource: S,
		params: (ParamType & PathParametersType & NPT & RPT) | undefined = undefined
	): Promise<P> {
		if (params === undefined) params = {};
		params[this.resourceId_key] = id;
		return super.update<P>(resource, param);
	}

	/**
	 * 削除リソース
	 *
	 * @param {T} resource
	 * @return {*}  {Promise<ResponseType<T>>}
	 * @memberof Model
	 */
	public async destroy(
		id: string,
		resource: D,
		params: (PathParametersType & NPT & RPT) | undefined = undefined
	): Promise<ResponseType<T> | null> {
		if (params === undefined) params = {};
		params[this.resourceId_key] = id;
		return super.destroy(resource, param as ParamType & NPT & RPT);
	}
}
