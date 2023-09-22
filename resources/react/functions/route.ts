import { createUrlWithConvertParameters } from './fetch';

export default function route(
	route_name: RouteNameType,
	parameters: {
		[s: string]: string | number;
	} = {}
): string {
	if (!routes[route_name]) throw new Error('存在しないパスです');
	return createUrlWithConvertParameters(routes[route_name], parameters);
}
export const routes: { [s: string]: string } = {
	'project.index': '/project',
	'project.store': '/project/{project}',
};
export type RouteNameType = 'project.index' | 'project.store';
