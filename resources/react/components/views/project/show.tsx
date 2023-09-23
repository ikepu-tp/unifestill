import PageWrapper from '~/components/commons/PageWrapper';
import route from '~/functions/route';
import ProjectDetail from './detail';
import { useEffect, useState } from 'react';
import { ProjectResource } from '~/models/interfaces';
import { useParams } from 'react-router-dom';
import { Project } from '~/models/project';

export default function ProjectShowView(): JSX.Element {
	const [Resource, setResource] = useState<ProjectResource | undefined>(undefined);

	const { project } = useParams() as { project: string };

	useEffect(() => {
		getItem();
	}, [project]);

	async function getItem(): Promise<void> {
		const response = await new Project().show(project);
		if (!response || !response.payloads) throw new Error('存在しないプロジェクトです');
		setResource({ ...{}, ...response.payloads });
	}
	if (Resource === undefined) return <></>;
	return (
		<PageWrapper
			title={Resource['name']}
			breadCrumb={[
				{
					link: route('project.index'),
					text: 'プロジェクト',
				},
			]}
		>
			<ProjectDetail resource={Resource} />
		</PageWrapper>
	);
}
