import { ListView } from '@ikepu-tp/react-bootstrap-extender';
import { FormWrapper, InputWrapper } from '@ikepu-tp/react-bootstrap-extender/Form';
import { ListGroup, Form, Button } from 'react-bootstrap';
import { ParamIndexType, ResponseIndexType } from '~/functions/fetch';
import route from '~/functions/route';
import { ProjectCategoryResource, ProjectCategoryStoreResource, ProjectResource } from '~/models/interfaces';
import { FormProps } from '../components/form';
import Anchor from '../components/Anchor';
import { Navigate, useNavigate } from 'react-router-dom';
import { MouseEvent } from 'react';

export type ProjectCategoryIndexProps = {
	project: ProjectResource;
	getItems: (params: ParamIndexType) => Promise<ResponseIndexType<ProjectCategoryResource>>;
};
export function ProjectCategoryIndexView(props: ProjectCategoryIndexProps): JSX.Element {
	const navigate = useNavigate();

	function onClick(e: MouseEvent<HTMLAnchorElement>): void {
		e.preventDefault();
		navigate(e.currentTarget.pathname);
	}
	return (
		<>
			<div className="mb-2 text-end">
				<Anchor as="button" href={route('category.store', { project: props.project['projectId'], category: 'new' })}>
					新規登録
				</Anchor>
			</div>
			<ListView
				getItems={props.getItems}
				itemCallback={(item: ProjectCategoryResource): JSX.Element => (
					<ListGroup.Item
						key={item['categoryId']}
						action
						href={route('category.show', { project: props.project['projectId'], category: item['categoryId'] })}
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

export type ProjectCategoryShowProps = {
	project: ProjectResource;
	resource: ProjectCategoryResource;
};
export function ProjectCategoryShowView(props: ProjectCategoryShowProps): JSX.Element {
	return (
		<>
			<Navigate to={route('category.index', { project: props.project['projectId'] })} />
		</>
	);
}

export type ProjectCategoryFormProps = FormProps<ProjectCategoryStoreResource> & {
	projectId?: string;
};
export default function ProjectCategoryForm(props: ProjectCategoryFormProps): JSX.Element {
	return (
		<FormWrapper onSubmit={props.onSubmit} success={props.success} setButtonDisabled={props.setButtonDisabled}>
			<InputWrapper label="商品カテゴリー名" required>
				<Form.Control
					type="text"
					name="name"
					value={props.Resource['name']}
					onChange={props.changeResourceStr}
					placeholder="商品カテゴリー名"
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
