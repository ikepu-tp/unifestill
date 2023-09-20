import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProjectIndexView from './views/project';

export default function Router(): JSX.Element {
	return (
		<BrowserRouter basename="/">
			<Routes>
				<Route index element={<>top page</>} />
				<Route path="project">
					<Route index element={<ProjectIndexView />} />
					<Route path=":project" element />
				</Route>
				<Route path="*" element={'NOT FOUND'} />
			</Routes>
		</BrowserRouter>
	);
}
