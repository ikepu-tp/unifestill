import { Anchor, ListView } from '@ikepu-tp/react-bootstrap-extender';
import { FormWrapper, InputWrapper } from '@ikepu-tp/react-bootstrap-extender/Form';
import { ListGroup, Form, Button } from 'react-bootstrap';
import { ParamIndexType, ResponseIndexType } from '~/functions/fetch';
import route from '~/functions/route';
import { ProjectResource, ProjectStoreResource } from '~/models/interfaces';
import { FormProps } from '../form';

export type ProjectIndexProps = {
	getItems: (params: ParamIndexType) => Promise<ResponseIndexType<ProjectResource>>;
};
export function ProjectIndexView(props: ProjectIndexProps): JSX.Element {
	return (
		<>
			<ListView
				getItems={props.getItems}
				itemCallback={(item: ProjectResource): JSX.Element => (
					<ListGroup.Item
						as={Anchor}
						key={item['projectId']}
						action
						href={route('project.show', { project: item['projectId'] })}
					>
						{item['name']}
					</ListGroup.Item>
				)}
				itemWrapper={ListGroup}
			/>
		</>
	);
}

export type ProjectShowProps = {
	resource: ProjectResource;
};
export function ProjectShowView(props: ProjectShowProps): JSX.Element {
	return <></>;
}

export type ProjectFormProps = FormProps<ProjectStoreResource> & {
	projectId?: string;
};
export default function ProjectForm(props: ProjectFormProps): JSX.Element {
	return (
		<FormWrapper onSubmit={props.onSubmit} success={props.success} setButtonDisabled={props.setButtonDisabled}>
			<InputWrapper label="プロジェクト名" required>
				<Form.Control
					type="text"
					name="name"
					value={props.Resource['name']}
					onChange={props.changeResourceStr}
					placeholder="プロジェクト名"
					required
				/>
			</InputWrapper>
			<InputWrapper label="備考">
				<Form.Control
					as={'textarea'}
					name="note"
					value={props.Resource['note'] || ''}
					onChange={props.changeResourceStr}
					placeholder="備考"
				/>
			</InputWrapper>
			<Button variant="primary" type="submit" disabled={props.ButtonDisabled}>
				{props.projectId ? '変更' : '登録'}
			</Button>
		</FormWrapper>
	);
}
