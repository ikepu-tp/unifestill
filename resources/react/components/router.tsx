import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ProjectIndexController, ProjectShowController, ProjectStoreController } from './controllers/project';

export default function Router(): JSX.Element {
	return (
		<BrowserRouter basename="/">
			<Routes>
				<Route index element={<Navigate to={'/project'} />} />
				<Route path="project">
					<Route index element={<ProjectIndexController />} />
					<Route path=":project">
						<Route index element={<ProjectShowController />} />
						<Route path="edit" element={<ProjectStoreController />} />
					</Route>
				</Route>
				<Route path="*" element={'NOT FOUND'} />
			</Routes>
		</BrowserRouter>
	);
}
