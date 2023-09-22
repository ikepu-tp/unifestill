import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProjectIndexView from './views/project';
import ProjectStoreView from './views/project/store';

export default function Router(): JSX.Element {
	return (
		<BrowserRouter basename="/">
			<Routes>
				<Route index element={<Navigate to={'/project'} />} />
				<Route path="project">
					<Route index element={<ProjectIndexView />} />
					<Route path=":project">
						<Route path="edit" element={<ProjectStoreView />} />
					</Route>
				</Route>
				<Route path="*" element={'NOT FOUND'} />
			</Routes>
		</BrowserRouter>
	);
}
