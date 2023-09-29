/**
 * クッキー取得
 *
 * @export
 * @return {Record<string, string>}
 */
export function cookies(): Record<string, string> {
	let all_cookies: Record<string, string> = {};
	document.cookie.split('; ').forEach(function (value: string): void {
		let tmp_cookie: string[] = value.split('=');
		all_cookies[tmp_cookie[0]] = decodeURIComponent(tmp_cookie[1]);
	});
	return all_cookies;
}

/**
 * 指定クッキー取得
 *
 * @export
 * @param {string} key
 * @param {any} _default
 * @return {(string | undefined)}
 */
export function cookie(key: string, _default: any = null): string | any {
	let all_cookies: Record<string, string> = cookies();
	if (all_cookies[key] !== undefined) return all_cookies[key];
	return _default;
}

/**
 * ランダム文字列生成
 *
 * @export
 * @return {*}  {string}
 */
export function createKey(): string {
	return Math.random().toString(32).substring(2);
}

/**
 * 文字列判定
 * @param value
 * @returns
 */
export function isString(value: any): boolean {
	return typeof value === 'string' || value instanceof String;
}

/**
 * 日付フォーマット
 * @param date
 * @param format
 * @returns
 */
export function date_format(date: string | null | undefined | Date = undefined, format: string = 'Y/n/j H:i'): string {
	let dateObject: Date | undefined;
	switch (date) {
		case null:
		case undefined:
			dateObject = new Date();
			break;
		default:
			if (isString(date)) {
				dateObject = new Date(date);
			} else {
				dateObject = date as Date;
			}
	}

	const Y: string = String(dateObject.getFullYear());
	const n: string = String(Number(dateObject.getMonth()) + 1);
	const m: string = String(('00' + n).slice(-2));
	const j: string = String(dateObject.getDate());
	const d: string = String(('00' + j).slice(-2));
	const H: string = String(dateObject.getHours());
	const i: string = String(('00' + dateObject.getMinutes()).slice(-2));
	const s: string = String(('00' + dateObject.getSeconds()).slice(-2));
	const WeekDays: string[] = ['日', '月', '火', '水', '木', '金', '土'];
	return format
		.replace('Y', Y)
		.replace('n', n)
		.replace('j', j)
		.replace('m', m)
		.replace('d', d)
		.replace('H', H)
		.replace('i', i)
		.replace('s', s)
		.replace('w', WeekDays[dateObject.getDay()]);
}

/**
 * 数値フォーマット
 * @param number
 * @returns
 */
export function number_format(number: number): string {
	return Number(number).toLocaleString(undefined, { maximumFractionDigits: 20 });
}
