import route from '~/functions/route';
import { ChangeEvent, useEffect, useState } from 'react';
import { ProjectResource, ProjectStoreResource } from '~/models/interfaces';
import { useNavigate, useParams } from 'react-router-dom';
import { Project, ProjectStoreInit } from '~/models/project';
import ProjectForm, { ProjectIndexView, ProjectShowView } from '../views/project';
import { ParamIndexType, ResponseIndexType, ResponseType } from '~/functions/fetch';
import PageWrapper from '../components/PageWrapper';

export type ProjectParam = { project: string };
export function ProjectIndexController(): JSX.Element {
	async function getItems(params: ParamIndexType): Promise<ResponseIndexType<ProjectResource>> {
		const project = new Project();
		const items: ResponseType<ResponseIndexType<ProjectResource>> = await project.index(params);
		if (!items || !items.payloads) throw new Error('予期せぬエラーが発生しました');
		return items.payloads;
	}
	return (
		<PageWrapper title="プロジェクト" breadCrumb={[]}>
			<ProjectIndexView getItems={getItems} />
		</PageWrapper>
	);
}

export function ProjectShowController(): JSX.Element {
	const [Resource, setResource] = useState<ProjectResource | undefined>(undefined);

	const { project } = useParams() as { project: string };

	useEffect(() => {
		getItem();
	}, [project]);

	async function getItem(): Promise<void> {
		const projectModel = new Project();
		projectModel.setResourceId(project);
		const response = await projectModel.show();
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
			<ProjectShowView resource={Resource} />
		</PageWrapper>
	);
}

export function ProjectStoreController(): JSX.Element {
	const [Resource, setResource] = useState<ProjectStoreResource>({ ...{}, ...ProjectStoreInit });
	const [ButtonDisabled, setButtonDisabled] = useState<boolean>(false);

	const { project } = useParams() as { project: string };
	const navigate = useNavigate();

	useEffect(() => {
		getResource();
	}, [project]);

	async function getResource(): Promise<void> {
		if (project === 'new') {
			return;
		}
		const projectModel = new Project();
		projectModel.setResourceId(project);
		const response = await projectModel.show();
		if (!response || !response.payloads) throw new Error('予期せぬエラーが発生');
		setResource({ ...{}, ...response.payloads });
	}

	function changeResource(key: string, value: any): void {
		Resource[key as keyof ProjectStoreResource] = value as never;
		setResource({ ...{}, ...Resource });
	}
	function changeResourceStr(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
		changeResource(e.currentTarget.name, e.currentTarget.value);
	}
	async function onSubmit(): Promise<ResponseType<ProjectResource>> {
		const projectModel = new Project();
		if (project === 'new') return projectModel.store(Resource);
		projectModel.setResourceId(project);
		return projectModel.update(Resource);
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
			<ProjectForm
				Resource={Resource}
				projectId={project || undefined}
				success={success}
				changeResourceStr={changeResourceStr}
				onSubmit={onSubmit}
				ButtonDisabled={ButtonDisabled}
				setButtonDisabled={setButtonDisabled}
			/>
		</PageWrapper>
	);
}
