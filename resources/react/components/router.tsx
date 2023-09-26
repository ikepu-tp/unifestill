import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ProjectIndexController, ProjectShowController, ProjectStoreController } from './controllers/project';
import {
	ProjectMemberIndexController,
	ProjectMemberShowController,
	ProjectMemberStoreController,
} from './controllers/member';

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
						<Route path="member">
							<Route index element={<ProjectMemberIndexController />} />
							<Route path=":member">
								<Route index element={<ProjectMemberShowController />} />
								<Route path="edit" element={<ProjectMemberStoreController />} />
							</Route>
						</Route>
					</Route>
				</Route>
				<Route path="*" element={'NOT FOUND'} />
			</Routes>
		</BrowserRouter>
	);
}
