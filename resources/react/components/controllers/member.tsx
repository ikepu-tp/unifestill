import route from '~/functions/route';
import { ChangeEvent, useEffect, useState } from 'react';
import { ProjectMemberResource, ProjectMemberStoreResource, ProjectResource } from '~/models/interfaces';
import { useNavigate, useParams } from 'react-router-dom';
import { Member, ProjectMemberStoreInit } from '~/models/member';
import ProjectMemberForm, { ProjectMemberIndexView, ProjectMemberShowView } from '../views/member';
import { ParamIndexType, ResponseIndexType, ResponseType } from '~/functions/fetch';
import PageWrapper from '../components/PageWrapper';
import { Project } from '~/models/project';

export function ProjectMemberIndexController(): JSX.Element {
	const [ProjectResource, setProjectResource] = useState<ProjectResource | undefined>(undefined);

	const { project } = useParams() as { project: string };

	useEffect(() => {
		getProject();
	}, [project]);

	async function getItems(params: ParamIndexType): Promise<ResponseIndexType<ProjectMemberResource>> {
		const model = new Member();
		const items: ResponseType<ResponseIndexType<ProjectMemberResource>> | null = await model.index(params);
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
			title="プロジェクトメンバー"
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
			<ProjectMemberIndexView getItems={getItems} />
		</PageWrapper>
	);
}

export function ProjectMemberShowController(): JSX.Element {
	const [ProjectResource, setProjectResource] = useState<ProjectResource | undefined>(undefined);
	const [Resource, setResource] = useState<ProjectMemberResource | undefined>(undefined);

	const { project, member } = useParams() as { project: string; member: string };

	useEffect(() => {
		getProject();
		getItem();
	}, [project, member]);

	async function getItem(): Promise<void> {
		const model = new Member();
		model.setResourceId(member);
		const response = await model.show();
		if (!response || !response.payloads) throw new Error('存在しないプロジェクトメンバーです');
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
			<ProjectMemberShowView resource={Resource} />
		</PageWrapper>
	);
}

export function ProjectMemberStoreController(): JSX.Element {
	const [ProjectResource, setProjectResource] = useState<ProjectResource | undefined>(undefined);
	const [Resource, setResource] = useState<ProjectMemberStoreResource>({ ...{}, ...ProjectMemberStoreInit });
	const [ButtonDisabled, setButtonDisabled] = useState<boolean>(false);

	const { project, member } = useParams() as { project: string; member: string };
	const navigate = useNavigate();

	useEffect(() => {
		getProject();
		getResource();
	}, [project]);

	async function getResource(): Promise<void> {
		if (project === 'new') {
			return;
		}
		const model = new Member();
		model.setResourceId(member);
		const response = await new Member().show(project);
		if (!response || !response.payloads) throw new Error('予期せぬエラーが発生');
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
		Resource[key as keyof ProjectMemberStoreResource] = value as never;
		setResource({ ...{}, ...Resource });
	}
	function changeResourceStr(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
		changeResource(e.currentTarget.name, e.currentTarget.value);
	}
	async function onSubmit(): Promise<ResponseType<ProjectMemberResource>> {
		const model = new Member();
		if (member === 'new') return model.store(Resource);
		model.setResourceId(project);
		return model.update(Resource);
	}
	function success(): void {
		navigate(route('member.index', { project: project }));
	}
	if (!ProjectResource || (project !== 'new' && !Resource)) return <></>;
	return (
		<PageWrapper
			title="メンバー登録"
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
					link: route('member.index', { project: project }),
					text: 'プロジェクトメンバー',
				},
			]}
		>
			<ProjectMemberForm
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
