import { ParamIndexType, ResponseIndexType, ResponseType } from 'functions/fetch';
import { Model as defaultModel } from '@ikepu-tp/react-mvc';
import { SuccessOrFailedResponseResource } from '@ikepu-tp/react-mvc/dist/esm/Send';
import { ParamType } from '@ikepu-tp/react-mvc/dist/esm/Url';

export class Model<
	T = any,
	S = any,
	PathParamertsType = { [s: string]: any },
	IndexParamProps = ParamIndexType,
	NormalParamProps = ParamType,
	RequiredParameters = { [s: string]: any }
> extends defaultModel<
	SuccessOrFailedResponseResource,
	PathParamertsType,
	T,
	S,
	S,
	IndexParamProps,
	NormalParamProps,
	NormalParamProps,
	NormalParamProps,
	NormalParamProps,
	RequiredParameters
> {
	protected base_url: string = '/api';
	protected default_params: ParamType = {};
	protected resourceId_key: string = 'testId';
	protected headers: HeadersInit & { [s: string]: string } = {};
	protected resourceId_param: ParamType | undefined = undefined;

	constructor(
		default_params: ParamType = {},
		default_headers: { [s: string]: string } = {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		}
	) {
		super(default_params, default_headers);
	}

	public convertResponse<P = ResponseType<T>>(response: SuccessOrFailedResponseResource | null): P {
		if (response === null) {
			this.convertNullResponse();
			return response as P;
		}
		if (!response) throw new Error('Unexpected response.');
		return response as P;
	}

	/**
	 * 一覧リソース
	 *
	 * @param {ParamIndexType} [params={ page: 1, per: 100, order: 'asc' }]
	 * @return {*}  {Promise<ResponseType<ResponseIndexType<T>>>}
	 * @memberof Model
	 */
	public async index<P = ResponseType<ResponseIndexType<T>>, Param = IndexParamProps>(
		params: Param | undefined = undefined
	): Promise<P> {
		return super.index<P>({
			...{},
			page: 1,
			per: 100,
			order: 'asc',
			...(params || {}),
		});
	}

	public setResourceId(id: string): void {
		if (this.resourceId_param === undefined) this.resourceId_param = {};
		this.resourceId_param[this.resourceId_key] = id;
	}

	public revokeResourceId(): void {
		this.resourceId_param = undefined;
	}

	/**
	 * 取得リソース
	 *
	 * @param {T} resource
	 * @return {*}  {Promise<ResponseType<T>>}
	 * @memberof Model
	 */
	public async show<P = ResponseType<T>, Param = NormalParamProps>(param: Param | undefined = undefined): Promise<P> {
		return super.show<P>({ ...{}, ...(this.resourceId_param || {}), ...(param || {}) });
	}

	/**
	 * 作成リソース
	 *
	 * @param {T} resource
	 * @return {*}  {Promise<ResponseType<T>>}
	 * @memberof Model
	 */
	public async store<P = ResponseType<T>, Param = NormalParamProps>(
		resource: S,
		param: Param | undefined = undefined
	): Promise<P> {
		return super.store<P>(resource, {
			...{},
			...(param || {}),
		});
	}

	/**
	 * 更新リソース
	 *
	 * @param {T} resource
	 * @return {*}  {Promise<ResponseType<T>>}
	 * @memberof Model
	 */
	public async update<P = ResponseType<T>, Param = NormalParamProps>(
		resource: S,
		param: Param | undefined = undefined
	): Promise<P> {
		return super.update<P>(resource, {
			...{},
			...(this.resourceId_param || {}),
			...(param || {}),
		});
	}

	/**
	 * 削除リソース
	 *
	 * @param {T} resource
	 * @return {*}  {Promise<ResponseType<T>>}
	 * @memberof Model
	 */
	public async destroy<P = ResponseType<T> | null, Param = NormalParamProps>(
		resource: T | S | undefined | { [s: string]: any },
		param: Param | undefined = undefined
	): Promise<P> {
		const _response: P | null = await this.send.delete<P, Param>({
			path: this.path,
			param: { ...{}, ...(this.resourceId_param || {}), ...(param || {}) } as Param,
			body: JSON.stringify(resource),
		});
		if (_response === null) return null as P;
		return _response as P;
	}
}
