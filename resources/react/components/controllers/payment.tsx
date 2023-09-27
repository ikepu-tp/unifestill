import route from '~/functions/route';
import { ChangeEvent, useEffect, useState } from 'react';
import { ProjectPaymentResource, ProjectPaymentStoreResource, ProjectResource } from '~/models/interfaces';
import { useNavigate, useParams } from 'react-router-dom';
import { Payment, ProjectPaymentStoreInit } from '~/models/payment';
import ProjectPaymentForm, { ProjectPaymentIndexView, ProjectPaymentShowView } from '../views/payment';
import { ParamIndexType, ResponseIndexType, ResponseType } from '~/functions/fetch';
import PageWrapper from '../components/PageWrapper';
import { Project } from '~/models/project';

export function ProjectPaymentIndexController(): JSX.Element {
	const [ProjectResource, setProjectResource] = useState<ProjectResource | undefined>(undefined);

	const { project } = useParams() as { project: string };

	useEffect(() => {
		getProject();
	}, [project]);

	async function getItems(params: ParamIndexType): Promise<ResponseIndexType<ProjectPaymentResource>> {
		const model = new Payment({ project });
		const items: ResponseType<ResponseIndexType<ProjectPaymentResource>> | null = await model.index(params);
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
			title="支払い方法"
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
			<ProjectPaymentIndexView getItems={getItems} project={ProjectResource} />
		</PageWrapper>
	);
}

export function ProjectPaymentShowController(): JSX.Element {
	const [ProjectResource, setProjectResource] = useState<ProjectResource | undefined>(undefined);
	const [Resource, setResource] = useState<ProjectPaymentResource | undefined>(undefined);

	const { project, payment } = useParams() as { project: string; payment: string };

	useEffect(() => {
		getProject();
		getItem();
	}, [project, payment]);

	async function getItem(): Promise<void> {
		const model = new Payment({ project });
		model.setResourceId(payment);
		const response = await model.show();
		if (!response || !response.payloads) throw new Error('存在しない支払い方法です');
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
			<ProjectPaymentShowView resource={Resource} project={ProjectResource} />
		</PageWrapper>
	);
}

export function ProjectPaymentStoreController(): JSX.Element {
	const [ProjectResource, setProjectResource] = useState<ProjectResource | undefined>(undefined);
	const [Resource, setResource] = useState<ProjectPaymentStoreResource>({ ...{}, ...ProjectPaymentStoreInit });
	const [ButtonDisabled, setButtonDisabled] = useState<boolean>(false);

	const { project, payment } = useParams() as { project: string; payment: string };
	const navigate = useNavigate();

	useEffect(() => {
		getProject();
		getResource();
	}, [project, payment]);

	async function getResource(): Promise<void> {
		if (payment === 'new') {
			return;
		}
		const model = new Payment({ project });
		model.setResourceId(payment);
		const response = await model.show();
		if (!response || !response.payloads) throw new Error('存在しない支払い方法です');
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
		Resource[key as keyof ProjectPaymentStoreResource] = value as never;
		setResource({ ...{}, ...Resource });
	}
	function changeResourceStr(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
		changeResource(e.currentTarget.name, e.currentTarget.value);
	}
	async function onSubmit(): Promise<ResponseType<ProjectPaymentResource>> {
		const model = new Payment({ project });
		if (payment === 'new') return model.store(Resource);
		model.setResourceId(project);
		return model.update(Resource);
	}
	function success(): void {
		navigate(route('payment.index', { project: project }));
	}
	if (!ProjectResource || (project !== 'new' && !Resource)) return <></>;
	return (
		<PageWrapper
			title="支払い方法登録"
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
					link: route('payment.index', { project: project }),
					text: '支払い方法',
				},
			]}
		>
			<ProjectPaymentForm
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
