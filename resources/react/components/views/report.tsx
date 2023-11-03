import { Control, InputWrapper } from '@ikepu-tp/react-bootstrap-extender/Form';
import { Form, Button, Table, Row, Col, Accordion } from 'react-bootstrap';
import {
	ReportResource,
	ProjectResource,
	ReportMemberSaleResource,
	ReportPaymentSaleResource,
	ReportCategorySaleResource,
	ReportItemSaleResource,
} from '~/models/interfaces';
import { ChangeEventHandler } from 'react';
import { number_format } from '~/functions';
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
							id="member_sales"
							value="member"
							label="担当者別"
							onChange={props.changeFilter}
							checked={props.Filter['sales'].indexOf('member') > -1}
						/>
						<Form.Check
							type="switch"
							name="sales"
							id="payment_sales"
							value="payment"
							label="支払い方法別"
							onChange={props.changeFilter}
							checked={props.Filter['sales'].indexOf('payment') > -1}
						/>
						<Form.Check
							type="switch"
							name="sales"
							id="item_sales"
							value="item"
							label="商品別"
							onChange={props.changeFilter}
							checked={props.Filter['sales'].indexOf('item') > -1}
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
							<td>{number_format(props.Resource['account_count'])}件</td>
						</tr>
						<tr>
							<th>売り上げ金額</th>
							<td>{number_format(props.Resource['sum_sales'])}円</td>
						</tr>
					</tbody>
				</Table>
			</div>
			<Accordion defaultActiveKey={props.Filter['sales'][0]}>
				{props.Resource['member_sales'] && (
					<Accordion.Item eventKey="member">
						<Accordion.Header>担当者別</Accordion.Header>
						<Accordion.Body>
							<Table striped responsive hover>
								<thead>
									<tr>
										<th>担当者</th>
										<th>会計数</th>
										<th>会計金額</th>
									</tr>
								</thead>
								<tbody>
									{props.Resource['member_sales'].map(
										(memberSale: ReportMemberSaleResource): JSX.Element => (
											<tr key={memberSale.member.memberId}>
												<td>{memberSale.member.name}</td>
												<td>{number_format(memberSale.count)}件</td>
												<td>{number_format(memberSale.price)}円</td>
											</tr>
										)
									)}
								</tbody>
							</Table>
						</Accordion.Body>
					</Accordion.Item>
				)}
				{props.Resource['payment_sales'] && (
					<Accordion.Item eventKey="payment">
						<Accordion.Header>支払い方法別</Accordion.Header>
						<Accordion.Body>
							<Table striped responsive hover>
								<thead>
									<tr>
										<th>支払い方法</th>
										<th>会計数</th>
										<th>会計金額</th>
									</tr>
								</thead>
								<tbody>
									{props.Resource['payment_sales'].map(
										(sale: ReportPaymentSaleResource): JSX.Element => (
											<tr key={sale.payment.paymentId}>
												<td>{sale.payment.name}</td>
												<td>{number_format(sale.count)}件</td>
												<td>{number_format(sale.price)}円</td>
											</tr>
										)
									)}
								</tbody>
							</Table>
						</Accordion.Body>
					</Accordion.Item>
				)}
				{props.Resource['category_sales'] && (
					<Accordion.Item eventKey="category">
						<Accordion.Header>商品カテゴリー別</Accordion.Header>
						<Accordion.Body>
							<Table striped responsive hover>
								<thead>
									<tr>
										<th>商品カテゴリー</th>
										<th>会計数</th>
										<th>会計金額</th>
									</tr>
								</thead>
								<tbody>
									{props.Resource['category_sales'].map(
										(sale: ReportCategorySaleResource): JSX.Element => (
											<tr key={sale.category.categoryId}>
												<td>{sale.category.name}</td>
												<td>{number_format(sale.count)}件</td>
												<td>{number_format(sale.price)}円</td>
											</tr>
										)
									)}
								</tbody>
							</Table>
						</Accordion.Body>
					</Accordion.Item>
				)}
				{props.Resource['item_sales'] && (
					<Accordion.Item eventKey="item">
						<Accordion.Header>商品別</Accordion.Header>
						<Accordion.Body>
							<Table striped responsive hover>
								<thead>
									<tr>
										<th>商品</th>
										<th>会計数</th>
										<th>会計金額</th>
									</tr>
								</thead>
								<tbody>
									{props.Resource['item_sales'].map(
										(sale: ReportItemSaleResource): JSX.Element => (
											<tr key={sale.item.itemId}>
												<td>{sale.item.name}</td>
												<td>{number_format(sale.count)}件</td>
												<td>{number_format(sale.price)}円</td>
											</tr>
										)
									)}
								</tbody>
							</Table>
						</Accordion.Body>
					</Accordion.Item>
				)}
			</Accordion>
		</>
	);
}
