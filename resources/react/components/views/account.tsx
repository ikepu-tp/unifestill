import { ListView, Popup } from '@ikepu-tp/react-bootstrap-extender';
import { FormWrapper, InputWrapper } from '@ikepu-tp/react-bootstrap-extender/Form';
import { ListGroup, Form, Button, Table, InputGroup, Row, Col } from 'react-bootstrap';
import { ParamIndexType, ResponseIndexType, ResponseType } from '~/functions/fetch';
import route from '~/functions/route';
import {
	AccountItemResource,
	AccountItemStoreResource,
	AccountPaymentResource,
	AccountPaymentStoreResource,
	AccountResource,
	AccountStoreResource,
	ProjectMemberResource,
	ProjectResource,
} from '~/models/interfaces';
import { FormProps, FormResourceProps } from '../components/form';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { MouseEvent, useState } from 'react';
import Anchor from '../components/Anchor';
import { number_format } from '~/functions';
import { Member } from '~/models/member';
import { AccountParam } from '../controllers/account';

export type AccountIndexProps = {
	project: ProjectResource;
	getItems: (params: ParamIndexType) => Promise<ResponseIndexType<AccountResource>>;
};
export function AccountIndexView(props: AccountIndexProps): JSX.Element {
	const navigate = useNavigate();

	function onClick(e: MouseEvent<HTMLAnchorElement>): void {
		e.preventDefault();
		navigate(e.currentTarget.pathname);
	}
	return (
		<>
			<div className="mb-2 text-end">
				<Anchor as="button" href={route('account.store', { project: props.project['projectId'], account: 'new' })}>
					レジ
				</Anchor>
			</div>
			<ListView
				getItems={props.getItems}
				itemCallback={(item: AccountResource): JSX.Element => (
					<ListGroup.Item
						key={item['accountId']}
						action
						href={route('account.show', { project: props.project['projectId'], account: item['accountId'] })}
						onClick={onClick}
					>
						{item['accountId']}
					</ListGroup.Item>
				)}
				itemWrapper={ListGroup}
			/>
		</>
	);
}

export type AccountShowProps = {
	project: ProjectResource;
	resource: AccountResource;
};
export function AccountShowView(props: AccountShowProps): JSX.Element {
	return (
		<>
			<Table striped hover responsive>
				<tbody>
					<tr>
						<th>会計ID</th>
						<td>{props.resource['accountId']}</td>
					</tr>
					<tr>
						<th>担当者</th>
						<td>{props.resource['member']['name']}</td>
					</tr>
					<tr>
						<th>支払</th>
						<td>
							<ul>
								{props.resource['payments'].map(
									(payment: AccountPaymentResource): JSX.Element => (
										<li key={payment['accountPaymentId']}>
											{number_format(payment['price'])}円（{payment['payment']['name']}）
										</li>
									)
								)}
							</ul>
						</td>
					</tr>
					<tr>
						<th>購入内容</th>
						<td>
							<ul>
								{props.resource['items'].map(
									(item: AccountItemResource): JSX.Element => (
										<li key={item['accountItemId']}>
											{item['item']['name']}：{number_format(item['price'])}円＊{number_format(item['quantity'])}
											<ul>
												{item['children'].map(
													(item: AccountItemResource): JSX.Element => (
														<li key={item['accountItemId']}>
															{item['item']['name']}：{number_format(item['price'])}円＊
															{number_format(item['quantity'])}
														</li>
													)
												)}
											</ul>
										</li>
									)
								)}
							</ul>
						</td>
					</tr>
				</tbody>
			</Table>
		</>
	);
}

export type AccountFormProps = FormProps<AccountStoreResource> & {
	projectId?: string;
};
export function AccountForm(props: AccountFormProps): JSX.Element {
	return (
		<FormWrapper onSubmit={props.onSubmit} success={props.success} setButtonDisabled={props.setButtonDisabled}>
			<InputWrapper label="担当者" required>
				<SelectMember Resource={props.Resource} changeResource={props.changeResource} />
			</InputWrapper>
			<InputWrapper label="商品" required>
				<Row>
					<Col xs="auto">
						<SelectItems Resource={props.Resource} changeResource={props.changeResource} />
					</Col>
					<Col>
						{props.Resource['items'].map(
							(item: AccountItemStoreResource): JSX.Element => (
								<li key={item['item_id']}>
									{item['item']['name']}：{number_format(item['price'])}＊{number_format(item['quantity'])}
								</li>
							)
						)}
					</Col>
				</Row>
			</InputWrapper>
			<InputWrapper label="支払" required>
				<Row>
					<Col xs="auto">
						<SelectPayments Resource={props.Resource} changeResource={props.changeResource} />
					</Col>
					<Col>
						{props.Resource['payments'].map(
							(payment: AccountPaymentStoreResource): JSX.Element => (
								<li key={payment['payment_id']}>
									{payment['payment']['name']}：{number_format(payment['price'])}円
								</li>
							)
						)}
					</Col>
				</Row>
			</InputWrapper>
			<Row>
				<Col sm="auto">
					<InputWrapper label="合計金額" required>
						<InputGroup>
							<Form.Control
								type="number"
								name="price"
								placeholder="金額"
								value={props.Resource['price']}
								onChange={props.changeResourceNum}
								required
							/>
							<InputGroup.Text>円</InputGroup.Text>
						</InputGroup>
					</InputWrapper>
				</Col>
				<Col sm="auto">
					<Button variant="primary" type="submit" disabled={props.ButtonDisabled} className="mt-4">
						会計
					</Button>
				</Col>
			</Row>
		</FormWrapper>
	);
}

function SelectPayments(props: FormResourceProps<AccountStoreResource>): JSX.Element {
	return <></>;
}
function SelectItems(props: FormResourceProps<AccountStoreResource>): JSX.Element {
	return <></>;
}
function SelectMember(props: FormResourceProps<AccountStoreResource>): JSX.Element {
	const [Show, setShow] = useState<boolean>(false);
	const [Mem, setMem] = useState<undefined | ProjectMemberResource>();

	const { project } = useParams() as AccountParam;

	function changeShow() {
		setShow(!Show);
	}
	async function getItems(params: ParamIndexType): Promise<ResponseIndexType<ProjectMemberResource>> {
		const model = new Member({ project });
		const items: ResponseType<ResponseIndexType<ProjectMemberResource>> = await model.index(params);
		if (!items || !items.payloads) throw new Error('予期せぬエラーが発生しました');
		return items.payloads;
	}
	function ItemCallback(prop: { item: ProjectMemberResource }): JSX.Element {
		function onClick(e: MouseEvent<HTMLAnchorElement>): void {
			e.preventDefault();
			setMem({ ...{}, ...prop.item });
			if (props.changeResource) props.changeResource('member_id', prop.item.memberId);
			changeShow();
		}
		return (
			<ListGroup.Item action href="#" onClick={onClick}>
				{prop.item['name']}
			</ListGroup.Item>
		);
	}
	return (
		<>
			{Mem && Mem['name']}
			<Button variant="outline-secondary" type="button" onClick={changeShow} className="ms-2">
				担当者を選択
			</Button>
			<Popup show={Show} onHide={changeShow} header={'担当者選択'}>
				<ListView
					getItems={getItems}
					itemWrapper={ListGroup}
					itemCallback={(item: ProjectMemberResource): JSX.Element => (
						<ItemCallback key={item['memberId']} item={item} />
					)}
				/>
			</Popup>
		</>
	);
}
