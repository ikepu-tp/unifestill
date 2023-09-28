import route from '~/functions/route';
import { ChangeEvent, useEffect, useState } from 'react';
import { AccountResource, AccountStoreResource, ProjectResource } from '~/models/interfaces';
import { useNavigate, useParams } from 'react-router-dom';
import { Account, AccountStoreInit } from '~/models/account';
import { AccountIndexView, AccountShowView, AccountForm } from '../views/account';
import { ParamIndexType, ResponseIndexType, ResponseType } from '~/functions/fetch';
import PageWrapper from '../components/PageWrapper';
import { Project } from '~/models/project';
import { ProjectParam } from './project';

export type AccountParam = ProjectParam & {
	account: string;
};
export function AccountIndexController(): JSX.Element {
	const [ProjectResource, setProjectResource] = useState<ProjectResource | undefined>(undefined);

	const { project } = useParams() as ProjectParam;

	useEffect(() => {
		getProject();
	}, [project]);

	async function getItems(params: ParamIndexType): Promise<ResponseIndexType<AccountResource>> {
		const model = new Account({ project });
		const items: ResponseType<ResponseIndexType<AccountResource>> = await model.index(params);
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
			<AccountIndexView getItems={getItems} project={ProjectResource} />
		</PageWrapper>
	);
}

export function AccountShowController(): JSX.Element {
	const [ProjectResource, setProjectResource] = useState<ProjectResource | undefined>(undefined);
	const [Resource, setResource] = useState<AccountResource | undefined>(undefined);

	const { project, account } = useParams() as AccountParam;

	useEffect(() => {
		getProject();
		getItem();
	}, [project, account]);

	async function getItem(): Promise<void> {
		const model = new Account({ project });
		model.setResourceId(account);
		const response = await model.show();
		if (!response || !response.payloads) throw new Error('存在しない会計です');
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
			title={Resource['accountId']}
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
			<AccountShowView resource={Resource} project={ProjectResource} />
		</PageWrapper>
	);
}

export function AccountStoreController(): JSX.Element {
	const [ProjectResource, setProjectResource] = useState<ProjectResource | undefined>(undefined);
	const [Resource, setResource] = useState<AccountStoreResource>({ ...{}, ...AccountStoreInit });
	const [ButtonDisabled, setButtonDisabled] = useState<boolean>(false);

	const { project, account } = useParams() as AccountParam;
	const navigate = useNavigate();

	useEffect(() => {
		if (account !== 'new') {
			navigate(route('account.show', { project, account }));
			return;
		}
		getProject();
	}, [project]);
	async function getProject(): Promise<void> {
		const model = new Project();
		model.setResourceId(project);
		const response = await model.show();
		if (!response || !response.payloads) throw new Error('存在しないプロジェクトです');
		setProjectResource({ ...{}, ...response.payloads });
	}

	function changeResource(key: string, value: any): void {
		Resource[key as keyof AccountStoreResource] = value as never;
		setResource({ ...{}, ...Resource });
	}
	function changeResourceStr(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
		changeResource(e.currentTarget.name, e.currentTarget.value);
	}
	async function onSubmit(): Promise<ResponseType<AccountResource>> {
		const model = new Account({ project });
		if (account === 'new') return model.store(Resource);
		model.setResourceId(account);
		return model.update(Resource);
	}
	function success(): void {
		setResource({ ...{}, ...AccountStoreInit, member_id: Resource['member_id'] || '' });
	}
	if (!ProjectResource || (project !== 'new' && !Resource)) return <></>;
	return (
		<PageWrapper
			title="レジ"
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
					link: route('account.index', { project: project }),
					text: '会計',
				},
			]}
		>
			<AccountForm
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
