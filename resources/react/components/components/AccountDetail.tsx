import { Table } from 'react-bootstrap';
import { number_format } from '~/functions';
import { AccountItemResource, AccountPaymentResource, AccountResource } from '~/models/interfaces';

export default function AccountDetail(props: { resource: AccountResource }): JSX.Element {
	return (
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
	);
}
