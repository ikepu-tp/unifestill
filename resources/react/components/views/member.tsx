import { ListView } from '@ikepu-tp/react-bootstrap-extender';
import { FormWrapper, InputWrapper } from '@ikepu-tp/react-bootstrap-extender/Form';
import { ListGroup, Form, Button, Table } from 'react-bootstrap';
import { ParamIndexType, ResponseIndexType } from '~/functions/fetch';
import route from '~/functions/route';
import { ProjectMemberResource, ProjectMemberStoreResource } from '~/models/interfaces';
import { FormProps } from '../components/form';
import Anchor from '../components/Anchor';
import { useNavigate } from 'react-router-dom';
import { MouseEvent } from 'react';
import TextWrapper from '../components/TextWrapper';

export type ProjectMemberIndexProps = {
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
				<Anchor as="button" href={route('project.store', { project: 'new' })}>
					新規登録
				</Anchor>
			</div>
			<ListView
				getItems={props.getItems}
				itemCallback={(item: ProjectMemberResource): JSX.Element => (
					<ListGroup.Item
						key={item['memberId']}
						action
						href={route('project.show', { project: item['memberId'] })}
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
	resource: ProjectMemberResource;
};
export function ProjectMemberShowView(props: ProjectMemberShowProps): JSX.Element {
	return (
		<>
			<Table responsive className="w-auto">
				<tbody>
					<tr>
						<th>プロジェクト名</th>
						<td>{props.resource.name}</td>
					</tr>
					<tr>
						<th>備考</th>
						<td>
							<TextWrapper>{props.resource.note}</TextWrapper>
						</td>
					</tr>
				</tbody>
			</Table>
			<div className="text-end">
				<Anchor
					as="button"
					variant="secondary"
					href={route('project.show', { project: props.resource.memberId })}
					className="ms-2"
				>
					編集
				</Anchor>
			</div>
		</>
	);
}

export type ProjectMemberFormProps = FormProps<ProjectMemberStoreResource> & {
	projectId?: string;
};
export default function ProjectMemberForm(props: ProjectMemberFormProps): JSX.Element {
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
