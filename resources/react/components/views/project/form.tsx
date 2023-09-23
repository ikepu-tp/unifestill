import { ChangeEvent, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import FormWrapper from '~/components/commons/forms/FormWrapper';
import InputWrapper from '~/components/commons/forms/InputWrapper';
import { ResponseType } from '~/functions/fetch';
import { ProjectResource, ProjectStoreResource } from '~/models/interfaces';
import { Project } from '~/models/project';

export type ProjectFormProps = {
	resource?: ProjectStoreResource;
	projectId?: string;
	success?: (payloads: ProjectResource) => void;
};
export default function ProjectForm(props: ProjectFormProps): JSX.Element {
	const [ButtonDisabled, setButtonDisabled] = useState<boolean>(false);
	const [Resource, setResource] = useState<ProjectStoreResource>({
		...{},
		...(props.resource || { name: '', note: '' }),
	});

	function changeResource(key: string, value: any): void {
		Resource[key as keyof ProjectStoreResource] = value as never;
		setResource({ ...{}, ...Resource });
	}
	function changeResourceStr(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
		changeResource(e.currentTarget.name, e.currentTarget.value);
	}
	async function onSubmit(): Promise<ResponseType<ProjectResource> | null> {
		const project = new Project();
		if (props.projectId) return project.update(props.projectId, Resource);
		return project.store(Resource);
	}
	function success(payloads: ProjectResource): void {
		if (props.success) props.success(payloads);
	}
	return (
		<FormWrapper onSubmit={onSubmit} success={success} setButtonDisabled={setButtonDisabled}>
			<InputWrapper label="プロジェクト名" required>
				<Form.Control
					type="text"
					name="name"
					value={Resource['name']}
					onChange={changeResourceStr}
					placeholder="プロジェクト名"
					required
				/>
			</InputWrapper>
			<InputWrapper label="備考">
				<Form.Control
					as={'textarea'}
					name="note"
					value={Resource['note'] || ''}
					onChange={changeResourceStr}
					placeholder="備考"
				/>
			</InputWrapper>
			<Button variant="primary" type="submit" disabled={ButtonDisabled}>
				{props.projectId ? '変更' : '登録'}
			</Button>
		</FormWrapper>
	);
}
