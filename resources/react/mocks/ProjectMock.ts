import { Project as model } from '~/models/project';
import { ResponseResource } from './mock';
import { ProjectResource } from '~/models/interfaces';

jest.mock('models/project');
const mock = model as jest.Mock;

mock.mockImplementation(() => {
	return ResponseResource<ProjectResource>({
		projectId: 'projectId',
		name: 'project name',
		note: 'This is a example note.',
	});
});

export default new model();
