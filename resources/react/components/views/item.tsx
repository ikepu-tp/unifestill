import { ListView, Popup } from '@ikepu-tp/react-bootstrap-extender';
import { FormWrapper, InputWrapper } from '@ikepu-tp/react-bootstrap-extender/Form';
import { ListGroup, Form, Button, InputGroup } from 'react-bootstrap';
import { ParamIndexType, ResponseIndexType, ResponseType } from '~/functions/fetch';
import route from '~/functions/route';
import {
	ProjectCategoryResource,
	ProjectItemResource,
	ProjectItemStoreResource,
	ProjectResource,
} from '~/models/interfaces';
import { FormProps } from '../components/form';
import Anchor from '../components/Anchor';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { MouseEvent, useEffect, useState } from 'react';
import { Category } from '~/models/category';
import { ItemParam } from '../controllers/item';
import { Item } from '~/models/item';

export type ProjectItemIndexProps = {
	project: ProjectResource;
	getItems: (params: ParamIndexType) => Promise<ResponseIndexType<ProjectItemResource>>;
};
export function ProjectItemIndexView(props: ProjectItemIndexProps): JSX.Element {
	const navigate = useNavigate();

	function onClick(e: MouseEvent<HTMLAnchorElement>): void {
		e.preventDefault();
		navigate(e.currentTarget.pathname);
	}
	return (
		<>
			<div className="mb-2 text-end">
				<Anchor as="button" href={route('item.store', { project: props.project['projectId'], item: 'new' })}>
					新規登録
				</Anchor>
			</div>
			<ListView
				getItems={props.getItems}
				itemCallback={(item: ProjectItemResource): JSX.Element => (
					<ListGroup.Item
						key={item['itemId']}
						action
						href={route('item.show', { project: props.project['projectId'], item: item['itemId'] })}
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

export type ProjectItemShowProps = {
	project: ProjectResource;
	resource: ProjectItemResource;
};
export function ProjectItemShowView(props: ProjectItemShowProps): JSX.Element {
	return (
		<>
			<Navigate to={route('item.store', { project: props.project['projectId'], item: props.resource['itemId'] })} />
		</>
	);
}

export type ProjectItemFormProps = FormProps<ProjectItemStoreResource> & {
	projectId?: string;
};
export default function ProjectItemForm(props: ProjectItemFormProps): JSX.Element {
	return (
		<FormWrapper onSubmit={props.onSubmit} success={props.success} setButtonDisabled={props.setButtonDisabled}>
			<InputWrapper label="商品カテゴリー" required>
				<SelectCategory
					changeResource={props.changeResource}
					category={props.Resource['category'] ? props.Resource['category'] : undefined}
				/>
			</InputWrapper>
			<InputWrapper label="親商品">
				<SelectParent changeResource={props.changeResource} />
			</InputWrapper>
			<InputWrapper label="商品名" required>
				<Form.Control
					type="text"
					name="name"
					value={props.Resource['name']}
					onChange={props.changeResourceStr}
					placeholder="商品名"
					required
				/>
			</InputWrapper>
			<InputWrapper label="金額" required>
				<InputGroup>
					<Form.Control
						type="number"
						name="price"
						value={props.Resource['price']}
						onChange={props.changeResourceNum}
						placeholder="金額"
						min={0}
						required
					/>
					<InputGroup.Text>円</InputGroup.Text>
				</InputGroup>
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
function SelectCategory(props: {
	changeResource?: (key: string, value: any) => void;
	category?: ProjectCategoryResource;
}) {
	const [Show, setShow] = useState<boolean>(false);
	const [Cat, setCat] = useState<undefined | ProjectCategoryResource>();

	const { project } = useParams() as ItemParam;

	useEffect(() => {
		setCat(props.category ? { ...{}, ...props.category } : undefined);
	}, [props.category]);

	function changeShow() {
		setShow(!Show);
	}
	async function getItems(params: ParamIndexType): Promise<ResponseIndexType<ProjectCategoryResource>> {
		const model = new Category({ project });
		const items: ResponseType<ResponseIndexType<ProjectCategoryResource>> = await model.index(params);
		if (!items || !items.payloads) throw new Error('予期せぬエラーが発生しました');
		return items.payloads;
	}
	function ItemCallback(prop: { item: ProjectCategoryResource }): JSX.Element {
		function onClick(e: MouseEvent<HTMLAnchorElement>): void {
			e.preventDefault();
			setCat({ ...{}, ...prop.item });
			if (props.changeResource) props.changeResource('category_id', prop.item.categoryId);
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
			{Cat && Cat['name']}
			<Button variant="outline-secondary" type="button" onClick={changeShow} className="ms-2">
				カテゴリーを選択
			</Button>
			<Popup show={Show} onHide={changeShow} header={'カテゴリー選択'}>
				<ListView
					getItems={getItems}
					itemWrapper={ListGroup}
					itemCallback={(item: ProjectCategoryResource): JSX.Element => (
						<ItemCallback key={item['categoryId']} item={item} />
					)}
				/>
			</Popup>
		</>
	);
}

function SelectParent(props: { changeResource?: (key: string, value: any) => void }) {
	const [Show, setShow] = useState<boolean>(false);
	const [PItem, setItem] = useState<undefined | ProjectItemResource>();

	const { project, item } = useParams() as ItemParam;

	function changeShow() {
		setShow(!Show);
	}
	async function getItems(params: ParamIndexType): Promise<ResponseIndexType<ProjectItemResource>> {
		const model = new Item({ project, parent: null, except: item });
		const items: ResponseType<ResponseIndexType<ProjectItemResource>> = await model.index(params);
		if (!items || !items.payloads) throw new Error('予期せぬエラーが発生しました');
		return items.payloads;
	}
	function removeParentItem(): void {
		if (props.changeResource) props.changeResource('parent_id', null);
		setItem(undefined);
	}
	function ItemCallback(prop: { item: ProjectItemResource }): JSX.Element {
		function onClick(e: MouseEvent<HTMLAnchorElement>): void {
			e.preventDefault();
			setItem({ ...{}, ...prop.item });
			if (props.changeResource) props.changeResource('parent_id', prop.item['parent_id']);
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
			{PItem && PItem['name']}
			<Button variant="outline-secondary" type="button" onClick={changeShow} className="ms-2">
				親商品を選択
			</Button>
			{PItem && (
				<Button variant="outline-warning" type="button" onClick={removeParentItem} className="ms-2">
					解除
				</Button>
			)}
			<Popup show={Show} onHide={changeShow} header={'親商品選択'}>
				<ListView
					getItems={getItems}
					itemWrapper={ListGroup}
					itemCallback={(item: ProjectItemResource): JSX.Element => (
						<ItemCallback key={item['parent_id']} item={item} />
					)}
				/>
			</Popup>
		</>
	);
}
