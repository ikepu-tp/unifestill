import route from '~/functions/route';
import { ChangeEvent, useEffect, useState } from 'react';
import { ProgressResource, ProgressStoreResource, ProjectResource } from '~/models/interfaces';
import { useNavigate, useParams } from 'react-router-dom';
import { Progress, ProgressStoreInit } from '~/models/progress';
import { ProgressIndexView, ProgressShowView, ProgressForm } from '../views/progress';
import { ParamIndexType, ResponseIndexType, ResponseType } from '~/functions/fetch';
import PageWrapper from '../components/PageWrapper';
import { Project } from '~/models/project';
import { ProjectParam } from './project';

export type ProgressParam = ProjectParam & {
	progress: string;
};
export function ProgressIndexController(): JSX.Element {
	const [ProjectResource, setProjectResource] = useState<ProjectResource | undefined>(undefined);

	const { project } = useParams() as ProjectParam;

	useEffect(() => {
		getProject();
	}, [project]);

	async function getItems(params: ParamIndexType): Promise<ResponseIndexType<ProgressResource>> {
		const model = new Progress({ project });
		const items: ResponseType<ResponseIndexType<ProgressResource>> = await model.index(params);
		if (!items || !items.payloads) throw new Error('予期せぬエラーが発生しました');
		return items.payloads;
	}
	async function getProject(): Promise<void> {
		const model = new Project();
		model.setResourceId(project);
		const response = await model.show();
		if (!response || !response.payloads) throw new Error('存在しないプロジェクトです');
		setProjectResource({ ...{}, ...response.payloads });
	}
	if (!ProjectResource) return <></>;
	return (
		<PageWrapper
			title="プログレス"
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
			<ProgressIndexView getItems={getItems} project={ProjectResource} />
		</PageWrapper>
	);
}

export function ProgressShowController(): JSX.Element {
	const [ProjectResource, setProjectResource] = useState<ProjectResource | undefined>(undefined);
	const [Resource, setResource] = useState<ProgressResource | undefined>(undefined);

	const { project, progress } = useParams() as ProgressParam;

	useEffect(() => {
		getProject();
		getItem();
	}, [project, progress]);

	async function getItem(): Promise<void> {
		const model = new Progress({ project });
		model.setResourceId(progress);
		const response = await model.show();
		if (!response || !response.payloads) throw new Error('存在しないプログレスです');
		setResource({ ...{}, ...response.payloads });
	}
	async function getProject(): Promise<void> {
		const model = new Project();
		model.setResourceId(project);
		const response = await model.show();
		if (!response || !response.payloads) throw new Error('存在しないプロジェクトです');
		setProjectResource({ ...{}, ...response.payloads });
	}

	if (Resource === undefined || ProjectResource === undefined) return <></>;
	return (
		<PageWrapper
			title={Resource['progressId']}
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
			<ProgressShowView resource={Resource} project={ProjectResource} />
		</PageWrapper>
	);
}

export function ProgressStoreController(): JSX.Element {
	const [ProjectResource, setProjectResource] = useState<ProjectResource | undefined>(undefined);
	const [Resource, setResource] = useState<ProgressStoreResource>({ ...{}, ...ProgressStoreInit });
	const [ButtonDisabled, setButtonDisabled] = useState<boolean>(false);

	const { project, progress } = useParams() as ProgressParam;
	const navigate = useNavigate();

	useEffect(() => {
		getProject();
	}, [project]);
	useEffect(() => {
		getProgress();
	}, [progress]);

	async function getProject(): Promise<void> {
		const model = new Project();
		model.setResourceId(project);
		const response = await model.show();
		if (!response || !response.payloads) throw new Error('存在しないプロジェクトです');
		setProjectResource({ ...{}, ...response.payloads });
	}

	async function getProgress(): Promise<void> {
		if (progress === 'new') return;
		const model = new Progress({ project });
		model.setResourceId(progress);
		const response = await model.show();
		if (!response || !response.payloads) throw new Error('存在しないプログレスです');
		setResource({ ...{}, ...response.payloads });
	}

	function changeResource(key: string, value: any): void {
		Resource[key as keyof ProgressStoreResource] = value as never;
		setResource({ ...{}, ...Resource });
	}
	function changeResourceCheck(e: ChangeEvent<HTMLInputElement>): void {
		changeResource(e.currentTarget.name, e.currentTarget.checked);
	}
	async function onSubmit(): Promise<ResponseType<ProgressResource>> {
		const model = new Progress({ project });
		if (progress === 'new') return model.store(Resource);
		model.setResourceId(progress);
		return model.update(Resource);
	}
	function success(): void {
		navigate(route('progress.index', { project: project }));
	}
	if (!ProjectResource || (project !== 'new' && !Resource)) return <></>;
	return (
		<PageWrapper
			title="プログレス登録"
			breadCrumb={[
				{
					link: route('project.index'),
					text: 'プロジェクト',
				},
				{
					link: route('project.show', { project: project }),
					text: ProjectResource['name'],
				},
				{
					link: route('progress.index', { project: project }),
					text: 'プログレス',
				},
			]}
		>
			<ProgressForm
				Resource={Resource}
				projectId={project}
				success={success}
				changeResource={changeResource}
				changeResourceCheck={changeResourceCheck}
				onSubmit={onSubmit}
				ButtonDisabled={ButtonDisabled}
				setButtonDisabled={setButtonDisabled}
			/>
		</PageWrapper>
	);
}
