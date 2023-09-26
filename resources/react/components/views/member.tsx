import { ListView } from '@ikepu-tp/react-bootstrap-extender';
import { FormWrapper, InputWrapper } from '@ikepu-tp/react-bootstrap-extender/Form';
import { ListGroup, Form, Button } from 'react-bootstrap';
import { ParamIndexType, ResponseIndexType } from '~/functions/fetch';
import route from '~/functions/route';
import { ProjectMemberResource, ProjectMemberStoreResource, ProjectResource } from '~/models/interfaces';
import { FormProps } from '../components/form';
import Anchor from '../components/Anchor';
import { Navigate, useNavigate } from 'react-router-dom';
import { MouseEvent } from 'react';

export type ProjectMemberIndexProps = {
	project: ProjectResource;
	getItems: (params: ParamIndexType) => Promise<ResponseIndexType<ProjectMemberResource>>;
};
export function ProjectMemberIndexView(props: ProjectMemberIndexProps): JSX.Element {
	const navigate = useNavigate();

	function onClick(e: MouseEvent<HTMLAnchorElement>): void {
		e.preventDefault();
		navigate(e.currentTarget.pathname);
	}
	return (
		<>
			<div className="mb-2 text-end">
				<Anchor as="button" href={route('member.store', { project: props.project['projectId'], member: 'new' })}>
					新規登録
				</Anchor>
			</div>
			<ListView
				getItems={props.getItems}
				itemCallback={(item: ProjectMemberResource): JSX.Element => (
					<ListGroup.Item
						key={item['memberId']}
						action
						href={route('member.show', { project: props.project['projectId'], member: item['memberId'] })}
						onClick={onClick}
					>
						{item['name']}
					</ListGroup.Item>
				)}
				itemWrapper={ListGroup}
			/>
		</>
	);
}

export type ProjectMemberShowProps = {
	project: ProjectResource;
	resource: ProjectMemberResource;
};
export function ProjectMemberShowView(props: ProjectMemberShowProps): JSX.Element {
	return (
		<>
			<Navigate to={route('member.index', { project: props.project['projectId'] })} />
		</>
	);
}

export type ProjectMemberFormProps = FormProps<ProjectMemberStoreResource> & {
	projectId?: string;
};
export default function ProjectMemberForm(props: ProjectMemberFormProps): JSX.Element {
	return (
		<FormWrapper onSubmit={props.onSubmit} success={props.success} setButtonDisabled={props.setButtonDisabled}>
			<InputWrapper label="メンバー名" required>
				<Form.Control
					type="text"
					name="name"
					value={props.Resource['name']}
					onChange={props.changeResourceStr}
					placeholder="メンバー名"
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
