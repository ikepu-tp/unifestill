import '@testing-library/jest-dom/extend-expect';
import ProjectMock from '~/mocks/ProjectMock';

it('project', async () => {
	expect((await ProjectMock.index())?.status.result).toBe(true);
});
