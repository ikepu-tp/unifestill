import { ListView } from '@ikepu-tp/react-bootstrap-extender';
import { FormWrapper, InputWrapper } from '@ikepu-tp/react-bootstrap-extender/Form';
import { ListGroup, Form, Button } from 'react-bootstrap';
import { ParamIndexType, ResponseIndexType } from '~/functions/fetch';
import route from '~/functions/route';
import { ProjectPaymentResource, ProjectPaymentStoreResource, ProjectResource } from '~/models/interfaces';
import { FormProps } from '../components/form';
import Anchor from '../components/Anchor';
import { Navigate, useNavigate } from 'react-router-dom';
import { MouseEvent } from 'react';

export type ProjectPaymentIndexProps = {
	project: ProjectResource;
	getItems: (params: ParamIndexType) => Promise<ResponseIndexType<ProjectPaymentResource>>;
};
export function ProjectPaymentIndexView(props: ProjectPaymentIndexProps): JSX.Element {
	const navigate = useNavigate();

	function onClick(e: MouseEvent<HTMLAnchorElement>): void {
		e.preventDefault();
		navigate(e.currentTarget.pathname);
	}
	return (
		<>
			<div className="mb-2 text-end">
				<Anchor as="button" href={route('payment.store', { project: props.project['projectId'], payment: 'new' })}>
					新規登録
				</Anchor>
			</div>
			<ListView
				getItems={props.getItems}
				itemCallback={(item: ProjectPaymentResource): JSX.Element => (
					<ListGroup.Item
						key={item['paymentId']}
						action
						href={route('payment.show', { project: props.project['projectId'], payment: item['paymentId'] })}
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

export type ProjectPaymentShowProps = {
	project: ProjectResource;
	resource: ProjectPaymentResource;
};
export function ProjectPaymentShowView(props: ProjectPaymentShowProps): JSX.Element {
	return (
		<>
			<Navigate to={route('payment.index', { project: props.project['projectId'] })} />
		</>
	);
}

export type ProjectPaymentFormProps = FormProps<ProjectPaymentStoreResource> & {
	projectId?: string;
};
export default function ProjectPaymentForm(props: ProjectPaymentFormProps): JSX.Element {
	return (
		<FormWrapper onSubmit={props.onSubmit} success={props.success} setButtonDisabled={props.setButtonDisabled}>
			<InputWrapper label="支払い方法" required>
				<Form.Control
					type="text"
					name="name"
					value={props.Resource['name']}
					onChange={props.changeResourceStr}
					placeholder="支払い方法"
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
