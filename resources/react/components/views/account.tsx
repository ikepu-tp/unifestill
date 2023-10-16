import { ListView, Popup } from '@ikepu-tp/react-bootstrap-extender';
import { FormWrapper, InputWrapper } from '@ikepu-tp/react-bootstrap-extender/Form';
import { ListGroup, Form, Button, Table, InputGroup, Row, Col, Popover, OverlayTrigger } from 'react-bootstrap';
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
import { useNavigate } from 'react-router-dom';
import React, { ChangeEvent, FocusEvent, MouseEvent, MouseEventHandler, useContext, useEffect, useState } from 'react';
import Anchor from '../components/Anchor';
import { number_format } from '~/functions';
import { Member } from '~/models/member';
import { Item } from '~/models/item';
import { Payment } from '~/models/payment';
import TenkeyContext from '../components/Tenkey';

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
	deleteAccount: () => Promise<void>;
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
			<Button variant={'danger'} type="button" onClick={props.deleteAccount}>
				削除
			</Button>
		</>
	);
}

export type AccountFormProps = FormProps<AccountStoreResource> & {
	projectId: string;
};
export function AccountForm(props: AccountFormProps): JSX.Element {
	const [PaymentPrice, setPaymentPrice] = useState<number>(0);

	const Tenkey = useContext(TenkeyContext);

	useEffect(() => {
		calculatePrice();
	}, [props.Resource['payments']]);
	function calculatePrice(): void {
		let price = 0;
		props.Resource['payments'].forEach((payment: AccountPaymentStoreResource) => {
			price += payment['price'];
		});
		setPaymentPrice(price);
	}
	return (
		<FormWrapper onSubmit={props.onSubmit} success={props.success} setButtonDisabled={props.setButtonDisabled}>
			<Row className="justify-content-end">
				<Col xs="auto">
					<Form.Check
						type="switch"
						label="ソフトウェアテンキーの利用"
						id="tenkeyOnOff"
						checked={Tenkey.Tenkey}
						onChange={Tenkey.changeTenkey}
					/>
				</Col>
			</Row>
			<InputWrapper label="担当者" required>
				<SelectMember Resource={props.Resource} changeResource={props.changeResource} projectId={props.projectId} />
			</InputWrapper>
			<InputWrapper label="商品" required>
				<Row>
					<SelectItems Resource={props.Resource} changeResource={props.changeResource} projectId={props.projectId} />
				</Row>
			</InputWrapper>
			<InputWrapper label="支払" required>
				<Row>
					<SelectPayments
						Resource={props.Resource}
						changeResource={props.changeResource}
						projectId={props.projectId}
						calculatePrice={calculatePrice}
					/>
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
				<Col>
					{PaymentPrice < props.Resource['price'] && (
						<span className="text-danger">支払い金額が合計金額より小さいです。</span>
					)}
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

function SelectPayments(
	props: FormResourceProps<AccountStoreResource> & { projectId: string; calculatePrice: () => void }
): JSX.Element {
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
			<ListGroup.Item action onClick={onClick}>
				{prop.item['name']}
			</ListGroup.Item>
		);
	}
	function changePayment(payment: AccountPaymentStoreResource, idx: number): void {
		if (!props.changeResource) return;
		props.Resource['payments'][idx] = { ...{}, ...payment };
		props.changeResource('payments', props.Resource['payments']);
	}
	return (
		<>
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
				<Table striped responsive>
					<thead>
						<tr>
							<th>支払い方法</th>
							<th>金額</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{props.Resource.payments.map(
							(item: AccountPaymentStoreResource, idx: number): JSX.Element => (
								<PaymentSettingCallback
									key={`${item['payment_id']}-${idx}`}
									item={item}
									idx={idx}
									Resource={props.Resource}
									changeResource={props.changeResource}
									changePayment={changePayment}
									calculatePrice={props.calculatePrice}
								/>
							)
						)}
					</tbody>
				</Table>
			</Col>
		</>
	);
}

function PaymentSettingCallback(props: {
	item: AccountPaymentStoreResource;
	idx: number;
	Resource: AccountStoreResource;
	changeResource?: (key: string, value: any) => void;
	calculatePrice: () => void;
	changePayment: (payment: AccountPaymentStoreResource, idx: number) => void;
}): JSX.Element {
	const [ItemResource, setItemResource] = useState<AccountPaymentStoreResource>({ ...{}, ...props.item });
	const [Focusing, setFocusing] = useState<'' | 'price'>('');

	const Tenkey = useContext(TenkeyContext);

	function changeTenkey(e: MouseEvent<HTMLButtonElement>): void {
		if (Focusing === '') return;
		let value: string | number = e.currentTarget.value;
		switch (e.currentTarget.value) {
			case 'C':
			case 'c':
				value = 0;
				break;
			case 'BS':
			case 'bs':
				value = String(ItemResource[Focusing]);
				value = value.substring(0, value.length - 1);
				break;
			default:
				if (ItemResource[Focusing]) value = `${ItemResource[Focusing]}${value}`;
		}
		ItemResource[Focusing] = Number(value);
		setItemResource({ ...{}, ...ItemResource });
	}
	function revokeFocusing(): void {
		setFocusing('');
		update();
	}
	function onFocus(e: FocusEvent<HTMLInputElement>): void {
		setFocusing(e.currentTarget.name as 'price');
	}
	function onChange(e: ChangeEvent<HTMLInputElement>): void {
		ItemResource[e.currentTarget.name as keyof AccountPaymentStoreResource] = Number(e.currentTarget.value) as never;
		setItemResource({ ...{}, ...ItemResource });
	}
	function onBlur(): void {
		update();
	}
	function update(): void {
		props.changePayment(ItemResource, props.idx);
		props.calculatePrice();
	}
	function deletePayment(): void {
		if (!props.changeResource) return;
		props.Resource['payments'].splice(props.idx, 1);
		props.changeResource('payments', props.Resource['payments']);
	}
	return (
		<tr>
			<td>{ItemResource['payment']['name']}</td>
			<td>
				<InputGroup>
					<Form.Control
						type="number"
						name="price"
						value={ItemResource['price']}
						placeholder="金額"
						onChange={onChange}
						onFocus={onFocus}
						onBlur={onBlur}
						required
						readOnly={Tenkey.Tenkey}
					/>
					<InputGroup.Text>円</InputGroup.Text>
				</InputGroup>
				{Tenkey.Tenkey && (
					<TenkeyElement
						id={`payment-${props.idx}-price`}
						show={Focusing.indexOf('price') > -1}
						onClick={changeTenkey}
						onClose={revokeFocusing}
					></TenkeyElement>
				)}
			</td>
			<td>
				<Button variant="danger" type="button" onClick={deletePayment}>
					削除
				</Button>
			</td>
		</tr>
	);
}
function SelectItems(props: FormResourceProps<AccountStoreResource> & { projectId: string }): JSX.Element {
	async function getItems(params: ParamIndexType): Promise<ResponseIndexType<ProjectItemResource>> {
		const model = new Item({ project: props.projectId });
		const items: ResponseType<ResponseIndexType<ProjectItemResource>> = await model.index(params);
		if (!items || !items.payloads) throw new Error('予期せぬエラーが発生しました');
		return items.payloads;
	}
	function ItemCallback(prop: { item: ProjectItemResource }): JSX.Element {
		function onClick(): void {
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
			<ListGroup.Item action onClick={onClick}>
				{prop.item['name']}
			</ListGroup.Item>
		);
	}
	function calculate(): void {
		let price: number = 0;
		props.Resource['items'].forEach((item: AccountItemStoreResource): void => {
			price += item['price'] * item['quantity'];
		});
		if (props.changeResource) props.changeResource('price', price);
	}
	return (
		<>
			<Col xs="auto">
				<ListView
					getItems={getItems}
					itemWrapper={ListGroup}
					itemCallback={(item: ProjectItemResource): JSX.Element => <ItemCallback key={item['itemId']} item={item} />}
				/>
			</Col>
			<Col>
				<Table striped responsive>
					<thead>
						<tr>
							<th>商品名</th>
							<th>単価</th>
							<th>個数</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{props.Resource.items.map(
							(item: AccountItemStoreResource, idx: number): JSX.Element => (
								<ItemSettingCallback
									key={`${item['item_id']}${idx}`}
									item={item}
									idx={idx}
									Resource={props.Resource}
									changeResource={props.changeResource}
									calculate={calculate}
								/>
							)
						)}
					</tbody>
				</Table>
			</Col>
		</>
	);
}

function ItemSettingCallback(props: {
	item: AccountItemStoreResource;
	idx: number;
	Resource: AccountStoreResource;
	changeResource?: (key: string, value: any) => void;
	calculate: () => void;
}): JSX.Element {
	const [ItemResource, setItemResource] = useState<AccountItemStoreResource>({ ...{}, ...props.item });
	const [Focusing, setFocusing] = useState<'' | 'price' | 'quantity'>('');

	const Tenkey = useContext(TenkeyContext);

	function changeTenkey(e: MouseEvent<HTMLButtonElement>): void {
		if (Focusing === '') return;
		let value: string | number = e.currentTarget.value;
		switch (e.currentTarget.value) {
			case 'C':
			case 'c':
				value = 0;
				break;
			case 'BS':
			case 'bs':
				value = String(ItemResource[Focusing]);
				value = value.substring(0, value.length - 1);
				break;
			default:
				if (ItemResource[Focusing]) value = `${ItemResource[Focusing]}${value}`;
		}
		ItemResource[Focusing] = Number(value);
		setItemResource({ ...{}, ...ItemResource });
	}
	function onChange(e: ChangeEvent<HTMLInputElement>): void {
		ItemResource[e.currentTarget.name as keyof AccountItemStoreResource] = Number(e.currentTarget.value) as never;
		setItemResource({ ...{}, ...ItemResource });
	}
	function revokeFocusing(): void {
		setFocusing('');
		update();
	}
	function onFocus(e: FocusEvent<HTMLInputElement>): void {
		setFocusing(e.currentTarget.name as 'price' | 'quantity');
	}
	function onBlur(): void {
		update();
	}
	function update(): void {
		if (!props.changeResource) return;
		props.Resource['items'][props.idx] = ItemResource;
		props.changeResource('items', props.Resource['items']);
		props.calculate();
	}
	function deleteItem(): void {
		if (!props.changeResource) return;
		props.Resource['items'].splice(props.idx, 1);
		props.changeResource('items', props.Resource['items']);
		props.calculate();
	}
	return (
		<tr>
			<td>{ItemResource['item']['name']}</td>
			<td>
				<InputGroup>
					<Form.Control
						type="number"
						name="price"
						value={ItemResource['price'] || 0}
						placeholder="金額"
						onChange={onChange}
						onBlur={onBlur}
						onFocus={onFocus}
						required
						style={{ minWidth: '70px' }}
						readOnly={Tenkey.Tenkey}
					/>
					<InputGroup.Text>円</InputGroup.Text>
				</InputGroup>
				{Tenkey.Tenkey && (
					<TenkeyElement
						id={`item-${props.idx}-price`}
						show={Focusing.indexOf('price') > -1}
						onClick={changeTenkey}
						onClose={revokeFocusing}
					></TenkeyElement>
				)}
			</td>
			<td>
				<InputGroup>
					<Form.Control
						type="number"
						name="quantity"
						value={ItemResource['quantity']}
						placeholder="個数"
						min={0}
						onFocus={onFocus}
						onChange={onChange}
						required
						readOnly={Tenkey.Tenkey}
					/>
					<InputGroup.Text>個</InputGroup.Text>
				</InputGroup>
				{Tenkey.Tenkey && (
					<TenkeyElement
						id={`item-${props.idx}-quantity`}
						show={Focusing.indexOf('quantity') > -1}
						onClick={changeTenkey}
						onClose={revokeFocusing}
					></TenkeyElement>
				)}
			</td>
			<td>
				<Button variant="danger" type="button" onClick={deleteItem}>
					削除
				</Button>
			</td>
		</tr>
	);
}

function TenkeyElement(props: {
	children?: React.ReactElement;
	id: string;
	show: boolean;
	onClick: MouseEventHandler<HTMLButtonElement>;
	onClose: () => void;
}): JSX.Element {
	function onToggle(): void {}
	return (
		<OverlayTrigger
			placement="bottom"
			show={props.show}
			onToggle={onToggle}
			overlay={
				<Popover id={props.id}>
					<Popover.Body>
						<table>
							<tbody>
								<tr>
									<td style={{ width: '60px' }}>
										<Button type="button" value={7} onClick={props.onClick} className="w-100 py-3">
											7
										</Button>
									</td>
									<td style={{ width: '60px' }}>
										<Button type="button" value={8} onClick={props.onClick} className="w-100 py-3">
											8
										</Button>
									</td>
									<td style={{ width: '60px' }}>
										<Button type="button" value={9} onClick={props.onClick} className="w-100 py-3">
											9
										</Button>
									</td>
								</tr>
								<tr>
									<td>
										<Button type="button" value={4} onClick={props.onClick} className="w-100 py-3">
											4
										</Button>
									</td>
									<td>
										<Button type="button" value={5} onClick={props.onClick} className="w-100 py-3">
											5
										</Button>
									</td>
									<td>
										<Button type="button" value={6} onClick={props.onClick} className="w-100 py-3">
											6
										</Button>
									</td>
								</tr>
								<tr>
									<td>
										<Button type="button" value={1} onClick={props.onClick} className="w-100 py-3">
											1
										</Button>
									</td>
									<td>
										<Button type="button" value={2} onClick={props.onClick} className="w-100 py-3">
											2
										</Button>
									</td>
									<td>
										<Button type="button" value={3} onClick={props.onClick} className="w-100 py-3">
											3
										</Button>
									</td>
								</tr>
								<tr>
									<td>
										<Button type="button" value={0} onClick={props.onClick} className="w-100 py-3">
											0
										</Button>
									</td>
									<td>
										<Button type="button" value={'C'} onClick={props.onClick} className="w-100 py-3">
											C
										</Button>
									</td>
									<td>
										<Button type="button" value={'BS'} onClick={props.onClick} className="w-100 py-3">
											BS
										</Button>
									</td>
								</tr>
							</tbody>
							<tfoot>
								<tr>
									<td colSpan={3}>
										<Button type="button" onClick={props.onClose}>
											閉じる
										</Button>
									</td>
								</tr>
							</tfoot>
						</table>
					</Popover.Body>
				</Popover>
			}
		>
			{props.children || <button type="button" className=""></button>}
		</OverlayTrigger>
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
			{Mem ? Mem['name'] : <span className="text-danger">担当者を選択してください</span>}
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
