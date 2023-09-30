import { ListView } from '@ikepu-tp/react-bootstrap-extender';
import { FormWrapper, InputWrapper } from '@ikepu-tp/react-bootstrap-extender/Form';
import { ListGroup, Form, Button } from 'react-bootstrap';
import { ParamIndexType, ResponseIndexType } from '~/functions/fetch';
import route from '~/functions/route';
import { ProgressResource, ProgressStoreResource, ProjectResource } from '~/models/interfaces';
import { FormProps } from '../components/form';
import { Navigate, useNavigate } from 'react-router-dom';
import { MouseEvent } from 'react';
import Anchor from '../components/Anchor';

export type ProgressIndexProps = {
	project: ProjectResource;
	getItems: (params: ParamIndexType) => Promise<ResponseIndexType<ProgressResource>>;
};
export function ProgressIndexView(props: ProgressIndexProps): JSX.Element {
	const navigate = useNavigate();

	function onClick(e: MouseEvent<HTMLAnchorElement>): void {
		e.preventDefault();
		navigate(e.currentTarget.pathname);
	}
	return (
		<>
			<div className="mb-2 text-end">
				<Anchor as="button" href={route('progress.store', { project: props.project['projectId'], progress: 'new' })}>
					登録
				</Anchor>
			</div>
			<ListView
				getItems={props.getItems}
				itemCallback={(item: ProgressResource): JSX.Element => (
					<ListGroup.Item
						key={item['progressId']}
						action
						href={route('progress.show', { project: props.project['projectId'], progress: item['progressId'] })}
						onClick={onClick}
					>
						{item['progressId']}
					</ListGroup.Item>
				)}
				itemWrapper={ListGroup}
			/>
		</>
	);
}

export type ProgressShowProps = {
	project: ProjectResource;
	resource: ProgressResource;
};
export function ProgressShowView(props: ProgressShowProps): JSX.Element {
	return (
		<>
			<Navigate
				to={route('progress.store', { project: props.project.projectId, progress: props.resource['progressId'] })}
			/>
		</>
	);
}

export type ProgressFormProps = FormProps<ProgressStoreResource> & {
	projectId: string;
};
export function ProgressForm(props: ProgressFormProps): JSX.Element {
	return (
		<FormWrapper onSubmit={props.onSubmit} success={props.success} setButtonDisabled={props.setButtonDisabled}>
			<InputWrapper label="認証必要可否" required>
				<Form.Check
					type="switch"
					name="need_auth"
					checked={props.Resource['need_auth']}
					onChange={props.changeResourceCheck}
				/>
			</InputWrapper>
			<Button variant="primary" type="submit" disabled={props.ButtonDisabled} className="mt-4">
				登録
			</Button>
		</FormWrapper>
	);
}
