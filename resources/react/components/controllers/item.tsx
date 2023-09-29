import route from '~/functions/route';
import { ChangeEvent, useEffect, useState } from 'react';
import { ProjectItemResource, ProjectItemStoreResource, ProjectResource } from '~/models/interfaces';
import { useNavigate, useParams } from 'react-router-dom';
import { Item, ProjectItemStoreInit } from '~/models/item';
import ProjectItemForm, { ProjectItemIndexView, ProjectItemShowView } from '../views/item';
import { ParamIndexType, ResponseIndexType, ResponseType } from '~/functions/fetch';
import PageWrapper from '../components/PageWrapper';
import { Project } from '~/models/project';
import { ProjectParam } from './project';

export type ItemParam = ProjectParam & {
	item: string;
};
export function ProjectItemIndexController(): JSX.Element {
	const [ProjectResource, setProjectResource] = useState<ProjectResource | undefined>(undefined);

	const { project } = useParams() as ProjectParam;

	useEffect(() => {
		getProject();
	}, [project]);

	async function getItems(params: ParamIndexType): Promise<ResponseIndexType<ProjectItemResource>> {
		const model = new Item({ project });
		const items: ResponseType<ResponseIndexType<ProjectItemResource>> = await model.index(params);
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
			title="商品"
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
			<ProjectItemIndexView getItems={getItems} project={ProjectResource} />
		</PageWrapper>
	);
}

export function ProjectItemShowController(): JSX.Element {
	const [ProjectResource, setProjectResource] = useState<ProjectResource | undefined>(undefined);
	const [Resource, setResource] = useState<ProjectItemResource | undefined>(undefined);

	const { project, item } = useParams() as ItemParam;

	useEffect(() => {
		getProject();
		getItem();
	}, [project, item]);

	async function getItem(): Promise<void> {
		const model = new Item({ project });
		model.setResourceId(item);
		const response = await model.show();
		if (!response || !response.payloads) throw new Error('存在しない商品です');
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
			title={Resource['name']}
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
			<ProjectItemShowView resource={Resource} project={ProjectResource} />
		</PageWrapper>
	);
}

export function ProjectItemStoreController(): JSX.Element {
	const [ProjectResource, setProjectResource] = useState<ProjectResource | undefined>(undefined);
	const [Resource, setResource] = useState<ProjectItemStoreResource>({ ...{}, ...ProjectItemStoreInit });
	const [ButtonDisabled, setButtonDisabled] = useState<boolean>(false);

	const { project, item } = useParams() as ItemParam;
	const navigate = useNavigate();

	useEffect(() => {
		getProject();
		getResource();
	}, [project, item]);

	async function getResource(): Promise<void> {
		if (item === 'new') {
			return;
		}
		const model = new Item({ project });
		model.setResourceId(item);
		const response = await model.show();
		if (!response || !response.payloads) throw new Error('存在しない商品です');
		setResource({ ...{}, category_id: response.payloads.category.categoryId, ...response.payloads });
	}
	async function getProject(): Promise<void> {
		const model = new Project();
		model.setResourceId(project);
		const response = await model.show();
		if (!response || !response.payloads) throw new Error('存在しないプロジェクトです');
		setProjectResource({ ...{}, ...response.payloads });
	}

	function changeResource(key: string, value: any): void {
		Resource[key as keyof ProjectItemStoreResource] = value as never;
		setResource({ ...{}, ...Resource });
	}
	function changeResourceStr(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
		changeResource(e.currentTarget.name, e.currentTarget.value);
	}
	function changeResourceNum(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
		changeResource(e.currentTarget.name, Number(e.currentTarget.value));
	}
	async function onSubmit(): Promise<ResponseType<ProjectItemResource>> {
		const model = new Item({ project });
		if (item === 'new') return model.store(Resource);
		model.setResourceId(item);
		return model.update(Resource);
	}
	function success(): void {
		navigate(route('item.index', { project: project }));
	}
	if (!ProjectResource || (project !== 'new' && !Resource)) return <></>;
	return (
		<PageWrapper
			title="商品登録"
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
					link: route('item.index', { project: project }),
					text: '商品',
				},
			]}
		>
			<ProjectItemForm
				Resource={Resource}
				projectId={project || undefined}
				success={success}
				changeResource={changeResource}
				changeResourceStr={changeResourceStr}
				changeResourceNum={changeResourceNum}
				onSubmit={onSubmit}
				ButtonDisabled={ButtonDisabled}
				setButtonDisabled={setButtonDisabled}
			/>
		</PageWrapper>
	);
}
