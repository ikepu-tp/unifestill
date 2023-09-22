import PageWrapper from '~/components/commons/PageWrapper';
import route from '~/functions/route';

export default function ProjectStoreView(): JSX.Element {
	return (
		<PageWrapper
			title="プロジェクト登録"
			breadCrumb={[
				{
					link: route('project.index'),
					text: 'プロジェクト',
				},
			]}
		></PageWrapper>
	);
}
