import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ProjectIndexController, ProjectShowController, ProjectStoreController } from './controllers/project';
import {
	ProjectMemberIndexController,
	ProjectMemberShowController,
	ProjectMemberStoreController,
} from './controllers/member';
import {
	ProjectPaymentIndexController,
	ProjectPaymentShowController,
	ProjectPaymentStoreController,
} from './controllers/payment';
import {
	ProjectCategoryIndexController,
	ProjectCategoryShowController,
	ProjectCategoryStoreController,
} from './controllers/category';
import { ProjectItemIndexController, ProjectItemShowController, ProjectItemStoreController } from './controllers/item';
import { AccountIndexController, AccountShowController, AccountStoreController } from './controllers/account';

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
						<Route path="payment">
							<Route index element={<ProjectPaymentIndexController />} />
							<Route path=":payment">
								<Route index element={<ProjectPaymentShowController />} />
								<Route path="edit" element={<ProjectPaymentStoreController />} />
							</Route>
						</Route>
						<Route path="category">
							<Route index element={<ProjectCategoryIndexController />} />
							<Route path=":category">
								<Route index element={<ProjectCategoryShowController />} />
								<Route path="edit" element={<ProjectCategoryStoreController />} />
							</Route>
						</Route>
						<Route path="item">
							<Route index element={<ProjectItemIndexController />} />
							<Route path=":item">
								<Route index element={<ProjectItemShowController />} />
								<Route path="edit" element={<ProjectItemStoreController />} />
							</Route>
						</Route>
						<Route path="account">
							<Route index element={<AccountIndexController />} />
							<Route path=":account">
								<Route index element={<AccountShowController />} />
								<Route path="edit" element={<AccountStoreController />} />
							</Route>
						</Route>
					</Route>
				</Route>
				<Route path="*" element={'NOT FOUND'} />
			</Routes>
		</BrowserRouter>
	);
}
