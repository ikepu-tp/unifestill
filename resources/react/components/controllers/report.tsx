import route from '~/functions/route';
import { ChangeEvent, useEffect, useState } from 'react';
import { ReportResource, ProjectResource } from '~/models/interfaces';
import { useNavigate, useParams } from 'react-router-dom';
import { Report } from '~/models/report';
import { ReportIndexView } from '../views/report';
import { ParamIndexType, ResponseIndexType, ResponseType } from '~/functions/fetch';
import PageWrapper from '../components/PageWrapper';
import { Project } from '~/models/project';
import { ProjectParam } from './project';
import { date_format } from '~/functions';

export type ReportParam = ProjectParam & {
	report: string;
};
export type ReportFilter = {
	from_date: string;
	to_date: string;
	sales: string[];
};
export function ReportIndexController(): JSX.Element {
	const [ProjectResource, setProjectResource] = useState<ProjectResource | undefined>(undefined);
	const [Resource, setResource] = useState<ReportResource | undefined>();
	const [Filter, setFilter] = useState<ReportFilter>({
		from_date: date_format(undefined, 'Y-m-01'),
		to_date: date_format(undefined, 'Y-m-d'),
		sales: [],
	});

	const { project } = useParams() as ProjectParam;

	useEffect(() => {
		getProject();
		getResource();
	}, [project]);

	function changeFilter(e: ChangeEvent<HTMLInputElement>): void {
		const name = e.currentTarget.name as keyof ReportFilter;
		switch (name) {
			case 'sales':
				const idx = Filter['sales'].indexOf(e.currentTarget.value);
				if (idx === -1) {
					Filter['sales'].push(e.currentTarget.value);
				} else {
					Filter['sales'].splice(idx, 1);
				}
				break;
			default:
				Filter[name] = e.currentTarget.value as never;
		}
		setFilter({ ...{}, ...Filter });
	}
	async function getResource(): Promise<void> {
		const model = new Report({
			project,
			from_date: Filter.from_date,
			to_date: Filter.to_date,
			sales: Filter.sales.join(','),
		});
		const response = await model.index<ResponseType<ReportResource>>();
		if (!response || !response.payloads) throw new Error('Unexpected response.');
		setResource({ ...{}, ...response.payloads });
	}
	async function getProject(): Promise<void> {
		const model = new Project();
		model.setResourceId(project);
		const response = await model.show();
		if (!response || !response.payloads) throw new Error('存在しないプロジェクトです');
		setProjectResource({ ...{}, ...response.payloads });
	}
	if (!ProjectResource || !Resource) return <></>;
	return (
		<PageWrapper
			title="会計"
			breadCrumb={[
				{
					link: route('project.index'),
					text: 'プロジェクト',
				},
				{
					link: route('project.show', { project: ProjectResource.projectId }),
					text: ProjectResource['name'],
				},
			]}
		>
			<ReportIndexView
				project={ProjectResource}
				Resource={Resource}
				Filter={Filter}
				getResource={getResource}
				changeFilter={changeFilter}
			/>
		</PageWrapper>
	);
}
