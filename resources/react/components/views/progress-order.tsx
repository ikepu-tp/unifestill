import { MouseEvent } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { AccountItemResource, AccountResource } from '~/models/interfaces';

export type ProgressOrderProps = {
	Accounts: { [s: string]: AccountResource };
	changeToOrdered: (e: MouseEvent<HTMLButtonElement>) => void;
	changeToProgress: (e: MouseEvent<HTMLButtonElement>) => void;
	changeToCompleted: (e: MouseEvent<HTMLButtonElement>) => void | Promise<void>;
};
export function ProgressOrderView(props: ProgressOrderProps): JSX.Element {
	return (
		<>
			<Row>
				{Object.keys(props.Accounts).map(
					(accountId: string): JSX.Element => (
						<Col xs="auto" sm="auto" md="auto" lg="auto" className="m-3 p-3 border border-dark rounded" key={accountId}>
							<div className="mb-1">会計ID:{accountId}</div>
							<div>
								処理状況：
								{props.Accounts[accountId]['order_status'] === 'ordered' && (
									<span className="text-warning">注文済み</span>
								)}
								{props.Accounts[accountId]['order_status'] === 'progress' && (
									<span className="text-danger">準備中</span>
								)}
								{props.Accounts[accountId]['order_status'] === 'completed' && (
									<span className="text-primary">完了・引き渡し済み</span>
								)}
							</div>
							<div className="my-2">
								注文内容
								<ul className="fs-4">
									{props.Accounts[accountId]['items'].map(
										(item: AccountItemResource): JSX.Element => (
											<li key={item['accountItemId']}>
												{item['item']['name']}＊
												<span className={item['quantity'] > 1 ? 'text-danger' : ''}>{item['quantity']}</span>
												{item.children.length ? (
													<ul>
														{item.children.map(
															(child: AccountItemResource): JSX.Element => (
																<li key={child['accountItemId']}>
																	{child['item']['name']}＊
																	<span className={child['quantity'] > 1 ? 'text-danger' : ''}>
																		{child['quantity']}
																	</span>
																</li>
															)
														)}
													</ul>
												) : (
													''
												)}
											</li>
										)
									)}
								</ul>
							</div>
							<div>
								<Button
									variant="outline-success"
									type="button"
									value={accountId}
									onClick={props.changeToOrdered}
									className="d-block w-100 py-2 mb-2"
								>
									注文済み
								</Button>
								<Button
									variant="secondary"
									type="button"
									value={accountId}
									onClick={props.changeToProgress}
									className="d-block w-100 py-2 mb-2"
								>
									準備中
								</Button>
								<Button
									variant="primary"
									type="button"
									value={accountId}
									onClick={props.changeToCompleted}
									className="d-block w-100 py-2 mb-2"
								>
									完了・引き渡し済み
								</Button>
							</div>
						</Col>
					)
				)}
			</Row>
		</>
	);
}
