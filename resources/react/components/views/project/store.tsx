import PageWrapper from '~/components/commons/PageWrapper';
import route from '~/functions/route';
import ProjectForm from './form';
import { useEffect, useState } from 'react';
import { ProjectResource } from '~/models/interfaces';
import { Project } from '~/models/project';
import { useNavigate, useParams } from 'react-router-dom';

export default function ProjectStoreView(): JSX.Element {
	const [Resource, setResource] = useState<undefined | ProjectResource>(undefined);

	const { project } = useParams() as { project: string };
	const navigate = useNavigate();

	useEffect(() => {
		getResource();
	}, [project]);

	async function getResource(): Promise<void> {
		const response = await new Project().show(project);
		if (!response || !response.payloads) throw new Error('予期せぬエラーが発生');
		setResource({ ...{}, ...response.payloads });
	}
	function success(): void {
		navigate(route('project.index'));
	}

	if (project !== 'new' && !Resource) return <></>;
	return (
		<PageWrapper
			title="プロジェクト登録"
			breadCrumb={[
				{
					link: route('project.index'),
					text: 'プロジェクト',
				},
			]}
		>
			<ProjectForm resource={Resource} projectId={Resource ? Resource['projectId'] : undefined} success={success} />
		</PageWrapper>
	);
}
