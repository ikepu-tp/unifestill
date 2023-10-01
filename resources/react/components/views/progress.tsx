import { ListView } from '@ikepu-tp/react-bootstrap-extender';
import { FormWrapper, InputWrapper } from '@ikepu-tp/react-bootstrap-extender/Form';
import { Form, Button, Table } from 'react-bootstrap';
import { ParamIndexType, ResponseIndexType } from '~/functions/fetch';
import route from '~/functions/route';
import { ProgressResource, ProgressStoreResource, ProjectResource } from '~/models/interfaces';
import { FormProps } from '../components/form';
import { Navigate } from 'react-router-dom';
import { FocusEvent, PropsWithChildren } from 'react';
import Anchor from '../components/Anchor';

export type ProgressIndexProps = {
	project: ProjectResource;
	getItems: (params: ParamIndexType) => Promise<ResponseIndexType<ProgressResource>>;
};
export function ProgressIndexView(props: ProgressIndexProps): JSX.Element {
	const url = `${window.location.protocol}//${window.location.hostname}`;
	function onFocus(e: FocusEvent<HTMLInputElement>): void {
		e.currentTarget.select();
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
					<tr key={item['progressId']}>
						<td>
							<Form.Control type="text" value={`${url}/progress/${item['progressId']}`} readOnly onFocus={onFocus} />
						</td>
						<td>{item['need_auth'] ? '必要' : '不要'}</td>
						<td>{item['logged'] ? '利用中' : '未利用中'}</td>
						<td>
							<Anchor
								as="button"
								variant="info"
								href={route('progress.show', { project: props.project['projectId'], progress: item['progressId'] })}
							>
								編集
							</Anchor>
						</td>
					</tr>
				)}
				itemWrapper={ItemWrapper}
			/>
		</>
	);
}
function ItemWrapper(props: PropsWithChildren): JSX.Element {
	return (
		<Table striped hover responsive>
			<thead>
				<tr>
					<th>URL</th>
					<th>認証有無</th>
					<th>利用中</th>
					<th></th>
				</tr>
			</thead>
			<tbody>{props.children}</tbody>
		</Table>
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
