import { Project as model } from '~/models/project';

jest.mock('models/project');
const mock = model as jest.Mock;

mock.mockImplementation(() => {});

export default new model();
