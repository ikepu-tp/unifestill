import route from '~/functions/route';
import { ChangeEvent, useEffect, useState } from 'react';
import { ProjectCategoryResource, ProjectCategoryStoreResource, ProjectResource } from '~/models/interfaces';
import { useNavigate, useParams } from 'react-router-dom';
import { Category, ProjectCategoryStoreInit } from '~/models/category';
import ProjectCategoryForm, { ProjectCategoryIndexView, ProjectCategoryShowView } from '../views/category';
import { ParamIndexType, ResponseIndexType, ResponseType } from '~/functions/fetch';
import PageWrapper from '../components/PageWrapper';
import { Project } from '~/models/project';
import { ProjectParam } from './project';

export type CategoryParam = ProjectParam & {
	category: string;
};
export function ProjectCategoryIndexController(): JSX.Element {
	const [ProjectResource, setProjectResource] = useState<ProjectResource | undefined>(undefined);

	const { project } = useParams() as ProjectParam;

	useEffect(() => {
		getProject();
	}, [project]);

	async function getItems(params: ParamIndexType): Promise<ResponseIndexType<ProjectCategoryResource>> {
		const model = new Category({ project });
		const items: ResponseType<ResponseIndexType<ProjectCategoryResource>> | null = await model.index(params);
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
			title="商品カテゴリー"
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
			<ProjectCategoryIndexView getItems={getItems} project={ProjectResource} />
		</PageWrapper>
	);
}

export function ProjectCategoryShowController(): JSX.Element {
	const [ProjectResource, setProjectResource] = useState<ProjectResource | undefined>(undefined);
	const [Resource, setResource] = useState<ProjectCategoryResource | undefined>(undefined);

	const { project, category } = useParams() as CategoryParam;

	useEffect(() => {
		getProject();
		getItem();
	}, [project, category]);

	async function getItem(): Promise<void> {
		const model = new Category({ project });
		model.setResourceId(category);
		const response = await model.show();
		if (!response || !response.payloads) throw new Error('存在しない商品カテゴリーです');
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
			<ProjectCategoryShowView resource={Resource} project={ProjectResource} />
		</PageWrapper>
	);
}

export function ProjectCategoryStoreController(): JSX.Element {
	const [ProjectResource, setProjectResource] = useState<ProjectResource | undefined>(undefined);
	const [Resource, setResource] = useState<ProjectCategoryStoreResource>({ ...{}, ...ProjectCategoryStoreInit });
	const [ButtonDisabled, setButtonDisabled] = useState<boolean>(false);

	const { project, category } = useParams() as CategoryParam;
	const navigate = useNavigate();

	useEffect(() => {
		getProject();
		getResource();
	}, [project, category]);

	async function getResource(): Promise<void> {
		if (category === 'new') {
			return;
		}
		const model = new Category({ project });
		model.setResourceId(category);
		const response = await model.show();
		if (!response || !response.payloads) throw new Error('存在しない商品カテゴリーです');
		setResource({ ...{}, ...response.payloads });
	}
	async function getProject(): Promise<void> {
		const model = new Project();
		model.setResourceId(project);
		const response = await model.show();
		if (!response || !response.payloads) throw new Error('存在しないプロジェクトです');
		setProjectResource({ ...{}, ...response.payloads });
	}

	function changeResource(key: string, value: any): void {
		Resource[key as keyof ProjectCategoryStoreResource] = value as never;
		setResource({ ...{}, ...Resource });
	}
	function changeResourceStr(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
		changeResource(e.currentTarget.name, e.currentTarget.value);
	}
	async function onSubmit(): Promise<ResponseType<ProjectCategoryResource>> {
		const model = new Category({ project });
		if (category === 'new') return model.store(Resource);
		model.setResourceId(category);
		return model.update(Resource);
	}
	function success(): void {
		navigate(route('category.index', { project: project }));
	}
	if (!ProjectResource || (project !== 'new' && !Resource)) return <></>;
	return (
		<PageWrapper
			title="商品カテゴリー登録"
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
					link: route('category.index', { project: project }),
					text: '商品カテゴリー',
				},
			]}
		>
			<ProjectCategoryForm
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
