import { ListView } from '@ikepu-tp/react-bootstrap-extender';
import { FormWrapper, InputWrapper } from '@ikepu-tp/react-bootstrap-extender/Form';
import { ListGroup, Form, Button, Table } from 'react-bootstrap';
import { ParamIndexType, ResponseIndexType } from '~/functions/fetch';
import route from '~/functions/route';
import { ProjectResource, ProjectStoreResource } from '~/models/interfaces';
import { FormProps } from '../components/form';
import Anchor from '../components/Anchor';
import { useNavigate } from 'react-router-dom';
import { MouseEvent } from 'react';
import TextWrapper from '../components/TextWrapper';

export type ProjectIndexProps = {
	getItems: (params: ParamIndexType) => Promise<ResponseIndexType<ProjectResource>>;
};
export function ProjectIndexView(props: ProjectIndexProps): JSX.Element {
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
				itemCallback={(item: ProjectResource): JSX.Element => (
					<ListGroup.Item
						key={item['projectId']}
						action
						href={route('project.show', { project: item['projectId'] })}
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

export type ProjectShowProps = {
	resource: ProjectResource;
};
export function ProjectShowView(props: ProjectShowProps): JSX.Element {
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
			<div>
				<Anchor
					as="button"
					variant="primary"
					href={route('member.index', { project: props.resource['projectId'] })}
					className="me-2"
				>
					プロジェクトメンバー
				</Anchor>
				<Anchor
					as="button"
					variant="primary"
					href={route('payment.index', { project: props.resource['projectId'] })}
					className="me-2"
				>
					支払い方法
				</Anchor>
				<Anchor
					as="button"
					variant="primary"
					href={route('category.index', { project: props.resource['projectId'] })}
					className="me-2"
				>
					商品カテゴリー
				</Anchor>
			</div>
			<div className="text-end">
				<Anchor
					as="button"
					variant="secondary"
					href={route('project.show', { project: props.resource['projectId'] })}
					className="ms-2"
				>
					編集
				</Anchor>
			</div>
		</>
	);
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
