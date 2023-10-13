import { ListView, Popup } from '@ikepu-tp/react-bootstrap-extender';
import { Control, FormWrapper, InputWrapper } from '@ikepu-tp/react-bootstrap-extender/Form';
import {
	ListGroup,
	Form,
	Button,
	Table,
	InputGroup,
	Row,
	Col,
	Popover,
	OverlayTrigger,
	Accordion,
} from 'react-bootstrap';
import { ParamIndexType, ResponseIndexType, ResponseType } from '~/functions/fetch';
import route from '~/functions/route';
import {
	ReportResource,
	ProjectItemResource,
	ProjectMemberResource,
	ProjectPaymentResource,
	ProjectResource,
	ReportMemberSaleResource,
} from '~/models/interfaces';
import { FormProps, FormResourceProps } from '../components/form';
import { useNavigate } from 'react-router-dom';
import React, {
	ChangeEvent,
	ChangeEventHandler,
	FocusEvent,
	MouseEvent,
	MouseEventHandler,
	useContext,
	useState,
} from 'react';
import Anchor from '../components/Anchor';
import { number_format } from '~/functions';
import { Member } from '~/models/member';
import { Item } from '~/models/item';
import { Payment } from '~/models/payment';
import TenkeyContext from '../components/Tenkey';
import { ReportFilter } from '../controllers/report';

export type ReportIndexProps = {
	project: ProjectResource;
	Resource: ReportResource;
	Filter: ReportFilter;
	getResource: () => Promise<void>;
	changeFilter: ChangeEventHandler<HTMLInputElement>;
};
export function ReportIndexView(props: ReportIndexProps): JSX.Element {
	return (
		<>
			<Row className="mb-3">
				<Col sm="auto">
					<Control
						label="集計開始日"
						type="date"
						name="from_date"
						value={props.Resource['from_date']}
						onChange={props.changeFilter}
					/>
				</Col>
				<Col sm="auto">
					<Control
						label="集計終了日"
						type="date"
						name="to_date"
						value={props.Resource['to_date']}
						onChange={props.changeFilter}
					/>
				</Col>
				<Col sm="auto">
					<InputWrapper label="集計対象">
						<Form.Check
							type="switch"
							name="sales"
							value="member"
							label="担当者別"
							onChange={props.changeFilter}
							checked={props.Filter['sales'].indexOf('member') > -1}
						/>
					</InputWrapper>
				</Col>
				<Col sm="auto">
					<Button type="button" onClick={props.getResource}>
						取得
					</Button>
				</Col>
			</Row>
			<div className="mb-3">
				全会計の概要
				<Table striped responsive>
					<tbody>
						<tr>
							<th>会計数</th>
							<td>{number_format(props.Resource['account_count'])}</td>
						</tr>
						<tr>
							<th>売り上げ金額</th>
							<td>{number_format(props.Resource['sum_sales'])}</td>
						</tr>
					</tbody>
				</Table>
			</div>
			<Accordion defaultActiveKey={props.Filter['sales'][0]}>
				{props.Resource['member_sales'] && (
					<Accordion.Item eventKey="member">
						<Accordion.Header>担当者別</Accordion.Header>
						<Accordion.Body>
							<ListGroup>
								{props.Resource['member_sales'].map(
									(memberSale: ReportMemberSaleResource): JSX.Element => (
										<ListGroup.Item key={memberSale.member.memberId}></ListGroup.Item>
									)
								)}
							</ListGroup>
						</Accordion.Body>
					</Accordion.Item>
				)}
			</Accordion>
		</>
	);
}
