import '@testing-library/jest-dom/extend-expect';
import { Project } from 'model/project';

test('index test', () => {
	const project: Project = new Project();
	console.log(project.index());
});
