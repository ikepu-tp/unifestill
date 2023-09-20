import {
	ParamIndexType,
	ParamType,
	ResponseIndexType,
	ResponseType,
	createUrl,
	sendDelete,
	sendGet,
	sendPost,
	sendPut,
} from '~/functions/fetch';

export class Model<T = any, S = any> {
	protected domain: string = '/api';
	protected base_route: string = '/test/{testId}';
	protected default_params: { [s: string]: string | number } = {};
	protected resourceId_key: string = 'testId';

	constructor(default_params: { [s: string]: string | number } = {}) {
		this.default_params = { ...{}, ...default_params };
		const api_url = document.getElementById('api_url') as HTMLMetaElement | null | undefined;
		if (!api_url) return;
		this.domain = api_url.content;
	}

	/**
	 * URL生成
	 *
	 * @param {ParamType} [param={}]
	 * @return {*}  {string}
	 * @memberof Model
	 */
	public generateUrl(param: ParamType = {}): string {
		param = { ...{}, ...this.default_params, ...param };
		let url: string = this.base_route;

		//パラメータ変換
		const url_params: string[] | null = url.match(/{[a-zA-Z]+}/gi);
		if (url_params !== null)
			url_params.forEach((paramName: string) => {
				let paramKey: string = paramName.replace(/{|}/gi, '');
				if (!param[paramKey]) throw new Error('Invalid parameter');
				url = url.replace(paramName, `${param[paramKey]}`);
				delete param[paramKey];
			});
		//オプションパラメータ変換
		const url_params_opt: string[] | null = url.match(/{[a-zA-Z]+[?]}/gi);
		if (url_params_opt !== null)
			url_params_opt.forEach((paramName: string) => {
				let paramKey: string = paramName.replace(/[{|}|?]/gi, '');
				url = url.replace(paramName, param[paramKey] ? `${param[paramKey]}` : '');
				delete param[paramKey];
			});

		if (!url.match(/^\/(.+)/)) url = `/${url}`;
		return createUrl(`${this.domain}${url}`, param);
	}

	/**
	 * 一覧リソース
	 *
	 * @param {ParamIndexType} [params={ page: 1, per: 100, order: 'asc' }]
	 * @return {*}  {Promise<ResponseType<ResponseIndexType<T>>>}
	 * @memberof Model
	 */
	public async index(
		params: ParamIndexType = { page: 1, per: 100, order: 'asc' }
	): Promise<ResponseType<ResponseIndexType<T>> | null> {
		return await sendGet<ResponseIndexType<T>>({
			url: this.generateUrl({
				...{},
				page: 1,
				per: 100,
				order: 'asc',
				...params,
			}),
		});
	}

	/**
	 * 取得リソース
	 *
	 * @param {T} resource
	 * @return {*}  {Promise<ResponseType<T>>}
	 * @memberof Model
	 */
	public async show(id: string, param: ParamType = {}): Promise<ResponseType<T> | null> {
		param[this.resourceId_key] = id;
		return await sendGet<T>({ url: this.generateUrl(param) });
	}

	/**
	 * 作成リソース
	 *
	 * @param {T} resource
	 * @return {*}  {Promise<ResponseType<T>>}
	 * @memberof Model
	 */
	public async store(resource: S, param: ParamType = {}): Promise<ResponseType<S> | null> {
		return await sendPost<S>({ url: this.generateUrl(param), body: JSON.stringify(resource) });
	}

	/**
	 * 更新リソース
	 *
	 * @param {T} resource
	 * @return {*}  {Promise<ResponseType<T>>}
	 * @memberof Model
	 */
	public async update(id: string, resource: S, param: ParamType = {}): Promise<ResponseType<S> | null> {
		param[this.resourceId_key] = id;
		return await sendPut<S>({ url: this.generateUrl(param), body: JSON.stringify(resource) });
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
		return await sendDelete<T>({ url: this.generateUrl(param) });
	}
}
