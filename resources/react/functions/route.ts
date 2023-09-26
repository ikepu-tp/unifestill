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
};
export type RoutesType = typeof routes;
export type RouteNameType = 'project.index' | 'project.store' | 'project.show';
