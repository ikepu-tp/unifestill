import { ListView, Popup } from '@ikepu-tp/react-bootstrap-extender';
import { FormWrapper, InputWrapper } from '@ikepu-tp/react-bootstrap-extender/Form';
import { ListGroup, Form, Button, Table, InputGroup, Row, Col, Accordion } from 'react-bootstrap';
import { ParamIndexType, ResponseIndexType, ResponseType } from '~/functions/fetch';
import route from '~/functions/route';
import {
	AccountItemResource,
	AccountItemStoreResource,
	AccountPaymentResource,
	AccountPaymentStoreResource,
	AccountResource,
	AccountStoreResource,
	ProjectItemResource,
	ProjectMemberResource,
	ProjectPaymentResource,
	ProjectResource,
} from '~/models/interfaces';
import { FormProps, FormResourceProps } from '../components/form';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ChangeEvent, MouseEvent, useState } from 'react';
import Anchor from '../components/Anchor';
import { number_format } from '~/functions';
import { Member } from '~/models/member';
import { AccountParam } from '../controllers/account';
import { Item } from '~/models/item';
import { Payment } from '~/models/payment';

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
	projectId: string;
};
export function AccountForm(props: AccountFormProps): JSX.Element {
	return (
		<FormWrapper onSubmit={props.onSubmit} success={props.success} setButtonDisabled={props.setButtonDisabled}>
			<InputWrapper label="担当者" required>
				<SelectMember Resource={props.Resource} changeResource={props.changeResource} projectId={props.projectId} />
			</InputWrapper>
			<InputWrapper label="商品" required>
				<Row>
					<Col xs="auto">
						<SelectItems Resource={props.Resource} changeResource={props.changeResource} projectId={props.projectId} />
					</Col>
					<Col>
						{props.Resource['items'].map(
							(item: AccountItemStoreResource, idx: number): JSX.Element => (
								<li key={item['item_id'] + idx}>
									{item['item']['name']}：{number_format(item['price'])}円＊{number_format(item['quantity'])}個
								</li>
							)
						)}
					</Col>
				</Row>
			</InputWrapper>
			<InputWrapper label="支払" required>
				<Row>
					<Col xs="auto">
						<SelectPayments
							Resource={props.Resource}
							changeResource={props.changeResource}
							projectId={props.projectId}
						/>
					</Col>
					<Col>
						{props.Resource['payments'].map(
							(payment: AccountPaymentStoreResource, idx: number): JSX.Element => (
								<li key={payment['payment_id'] + idx}>
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

function SelectPayments(props: FormResourceProps<AccountStoreResource> & { projectId: string }): JSX.Element {
	const [Show, setShow] = useState<boolean>(false);

	function changeShow() {
		setShow(!Show);
	}
	async function getItems(params: ParamIndexType): Promise<ResponseIndexType<ProjectPaymentResource>> {
		const model = new Payment({ project: props.projectId });
		const items: ResponseType<ResponseIndexType<ProjectPaymentResource>> = await model.index(params);
		if (!items || !items.payloads) throw new Error('予期せぬエラーが発生しました');
		return items.payloads;
	}
	function ItemCallback(prop: { item: ProjectPaymentResource }): JSX.Element {
		function onClick(e: MouseEvent<HTMLAnchorElement>): void {
			e.preventDefault();
			if (!props.changeResource) return;
			props.Resource['payments'] = props.Resource['payments'].concat({
				payment: prop.item,
				payment_id: prop.item['paymentId'],
				price: props.Resource.price,
			});
			props.changeResource('payments', props.Resource.payments);
		}
		return (
			<ListGroup.Item action href="#" onClick={onClick}>
				{prop.item['name']}
			</ListGroup.Item>
		);
	}
	function changePayment(payment: AccountPaymentStoreResource, idx: number): void {
		if (!props.changeResource) return;
		props.Resource['payments'][idx] = { ...{}, ...payment };
		props.changeResource('payments', props.Resource['payments']);
	}
	function ItemSettingCallback(prop: { item: AccountPaymentStoreResource; idx: number }): JSX.Element {
		const [ItemResource, setItemResource] = useState<AccountPaymentStoreResource>({ ...{}, ...prop.item });
		function onChange(e: ChangeEvent<HTMLInputElement>): void {
			ItemResource[e.currentTarget.name as keyof AccountPaymentStoreResource] = Number(e.currentTarget.value) as never;
			setItemResource({ ...{}, ...ItemResource });
		}
		function onBlur(): void {
			changePayment(ItemResource, prop.idx);
		}
		return (
			<Accordion.Item eventKey={`${ItemResource['payment_id']}-${prop.idx}`}>
				<Accordion.Header>
					{ItemResource['payment']['name']}({ItemResource['price']}円)
				</Accordion.Header>
				<Accordion.Body className="visible">
					<InputGroup>
						<InputGroup.Text>{ItemResource['payment']['name']}：</InputGroup.Text>
						<Form.Control
							type="number"
							name="price"
							value={ItemResource['price']}
							placeholder="金額"
							onChange={onChange}
							onBlur={onBlur}
							required
						/>
						<InputGroup.Text>円</InputGroup.Text>
					</InputGroup>
				</Accordion.Body>
			</Accordion.Item>
		);
	}
	return (
		<>
			<Button variant="outline-secondary" type="button" onClick={changeShow} className="ms-2">
				支払い方法を選択
			</Button>
			<Popup show={Show} onHide={changeShow} size="lg" header={'支払い方法選択'}>
				<Row>
					<Col xs="auto">
						<ListView
							getItems={getItems}
							itemWrapper={ListGroup}
							itemCallback={(item: ProjectPaymentResource): JSX.Element => (
								<ItemCallback key={item['paymentId']} item={item} />
							)}
						/>
					</Col>
					<Col>
						<Accordion className="w-100">
							{props.Resource.payments.map(
								(item: AccountPaymentStoreResource, idx: number): JSX.Element => (
									<ItemSettingCallback key={`${item['payment_id']}-${idx}`} item={item} idx={idx} />
								)
							)}
						</Accordion>
					</Col>
				</Row>
			</Popup>
		</>
	);
}
function SelectItems(props: FormResourceProps<AccountStoreResource> & { projectId: string }): JSX.Element {
	const [Show, setShow] = useState<boolean>(false);

	function changeShow() {
		setShow(!Show);
	}
	async function getItems(params: ParamIndexType): Promise<ResponseIndexType<ProjectItemResource>> {
		const model = new Item({ project: props.projectId });
		const items: ResponseType<ResponseIndexType<ProjectItemResource>> = await model.index(params);
		if (!items || !items.payloads) throw new Error('予期せぬエラーが発生しました');
		return items.payloads;
	}
	function ItemCallback(prop: { item: ProjectItemResource }): JSX.Element {
		function onClick(e: MouseEvent<HTMLAnchorElement>): void {
			if (!props.changeResource) return;
			props.Resource['items'] = props.Resource['items'].concat({
				item_id: prop.item['itemId'],
				price: prop.item['price'],
				quantity: 1,
				children: [],
				item: prop.item,
			});
			props.changeResource('items', props.Resource.items);
		}
		return (
			<ListGroup.Item action href="#" onClick={onClick}>
				{prop.item['name']}
			</ListGroup.Item>
		);
	}
	function ItemSettingCallback(prop: { item: AccountItemStoreResource; idx: number }): JSX.Element {
		const [ItemResource, setItemResource] = useState<AccountItemStoreResource>({ ...{}, ...prop.item });

		function onChange(e: ChangeEvent<HTMLInputElement>): void {
			ItemResource[e.currentTarget.name as keyof AccountItemStoreResource] = Number(e.currentTarget.value) as never;
			setItemResource({ ...{}, ...ItemResource });
		}
		function onBlur(): void {
			if (!props.changeResource) return;
			props.Resource['items'][prop.idx] = ItemResource;
			props.changeResource('items', props.Resource['items']);
		}
		return (
			<Accordion.Item eventKey={`${ItemResource['item_id']}-${prop.idx}`}>
				<Accordion.Header>
					{ItemResource['item']['name']}({ItemResource['price']}円＊{ItemResource['quantity']}=
					{ItemResource['price'] * ItemResource['quantity']}円)
				</Accordion.Header>
				<Accordion.Body className="visible">
					<InputGroup>
						<InputGroup.Text>{ItemResource['item']['name']}：</InputGroup.Text>
						<Form.Control
							type="number"
							name="price"
							value={ItemResource['price']}
							placeholder="金額"
							onChange={onChange}
							onBlur={onBlur}
							required
						/>
						<InputGroup.Text>円</InputGroup.Text>
						<InputGroup.Text>＊</InputGroup.Text>
						<Form.Control
							type="number"
							name="quantity"
							value={ItemResource['quantity']}
							placeholder="個数"
							min={0}
							onChange={onChange}
							required
						/>
						<InputGroup.Text>個</InputGroup.Text>
					</InputGroup>
				</Accordion.Body>
			</Accordion.Item>
		);
	}
	return (
		<>
			<Button variant="outline-secondary" type="button" onClick={changeShow} className="ms-2">
				商品を選択
			</Button>
			<Popup show={Show} onHide={changeShow} size="lg" header={'商品選択'}>
				<Row>
					<Col xs="auto">
						<ListView
							getItems={getItems}
							itemWrapper={ListGroup}
							itemCallback={(item: ProjectItemResource): JSX.Element => (
								<ItemCallback key={item['itemId']} item={item} />
							)}
						/>
					</Col>
					<Col>
						<Accordion className="w-100">
							{props.Resource.items.map(
								(item: AccountItemStoreResource, idx: number): JSX.Element => (
									<ItemSettingCallback key={`${item['item_id']}${idx}`} item={item} idx={idx} />
								)
							)}
						</Accordion>
					</Col>
				</Row>
			</Popup>
		</>
	);
}
function SelectMember(props: FormResourceProps<AccountStoreResource> & { projectId: string }): JSX.Element {
	const [Show, setShow] = useState<boolean>(false);
	const [Mem, setMem] = useState<undefined | ProjectMemberResource>();

	function changeShow() {
		setShow(!Show);
	}
	async function getItems(params: ParamIndexType): Promise<ResponseIndexType<ProjectMemberResource>> {
		const model = new Member({ project: props.projectId });
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
