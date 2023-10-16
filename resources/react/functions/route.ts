import { createUrlWithConvertParameters } from './fetch';

export default function route(
	route_name: keyof RoutesType,
	parameters: {
		[s: string]: string | number;
	} = {}
): string {
	if (!routes[route_name]) throw new Error('存在しないパスです');
	return createUrlWithConvertParameters(routes[route_name], parameters);
}
export const routes = {
	'project.index': '/project',
	'project.store': '/project/{project}/edit',
	'project.show': '/project/{project}',
	'member.index': '/project/{project}/member',
	'member.store': '/project/{project}/member/{member}/edit',
	'member.show': '/project/{project}/member/{member}',
	'payment.index': '/project/{project}/payment',
	'payment.store': '/project/{project}/payment/{payment}/edit',
	'payment.show': '/project/{project}/payment/{payment}',
	'category.index': '/project/{project}/category',
	'category.store': '/project/{project}/category/{category}/edit',
	'category.show': '/project/{project}/category/{category}',
	'item.index': '/project/{project}/item',
	'item.store': '/project/{project}/item/{item}/edit',
	'item.show': '/project/{project}/item/{item}',
	'account.index': '/project/{project}/account',
	'account.store': '/project/{project}/account/{account}/edit',
	'account.show': '/project/{project}/account/{account}',
	'progress.index': '/project/{project}/progress',
	'progress.store': '/project/{project}/progress/{progress}/edit',
	'progress.show': '/project/{project}/progress/{progress}',
	'report.index': '/project/{project}/report',
};
export type RoutesType = typeof routes;
export type RouteNameType = 'project.index' | 'project.store' | 'project.show';
