import PageWrapper from '~/components/commons/PageWrapper';
import ProjectList from './list';
import Anchor from '~/components/commons/Anchor';
import route from '~/functions/route';

export default function ProjectIndexView(): JSX.Element {
	return (
		<PageWrapper title="プロジェクト" breadCrumb={[]}>
			<div className="mb-2 text-end">
				<Anchor as="button" href={route('project.store', { project: 'new' })}>
					新規登録
				</Anchor>
			</div>
			<ProjectList />
		</PageWrapper>
	);
}
