import { MouseEvent, useEffect, useRef, useState } from 'react';
import { ProgressOrderView } from '../views/progress-order';
import { AccountOrderStatusType, AccountResource } from '~/models/interfaces';
import useES from '../components/EventSourse';
import { Account } from '~/models/account';

export function ProgressOrderController(): JSX.Element {
	const [Accounts, setAccounts] = useState<{ [s: string]: AccountResource }>({});
	const { openES, closeES } = useES<AccountResource>();
	const project = useRef<null | HTMLInputElement>(null);
	const progress = useRef<null | HTMLInputElement>(null);

	useEffect(() => {
		project.current = document.getElementById('project') as HTMLInputElement;
		progress.current = document.getElementById('progress') as HTMLInputElement;
		if (!project.current || !progress.current) return;
		//return;
		openES({
			esUrl: `/api/v1/project/${project.current.value}/account?sse=true&order_status=ordered&progress=${progress.current.value}`,
			onMessage: onMessage,
		});
		return () => {
			closeES();
		};
	}, []);

	function onMessage(me: MessageEvent<AccountResource>): void {
		Accounts[me.data.accountId] = me.data;
		setAccounts({ ...{}, ...Accounts });
		setTimeout(closeES, 2000);
	}
	async function changeOrderStatus(accountId: string, order_status: AccountOrderStatusType): Promise<void> {
		if (!project.current || !progress.current) return;
		const model = new Account({ project: project.current.value });
		model.setResourceId(accountId);
		Accounts[accountId]['order_status'] = order_status;
		await model.update(Accounts[accountId]);
		setAccounts({ ...{}, ...Accounts });
	}
	function changeToOrdered(e: MouseEvent<HTMLButtonElement>): void {
		changeOrderStatus(e.currentTarget.value, 'ordered');
	}
	function changeToProgress(e: MouseEvent<HTMLButtonElement>): void {
		changeOrderStatus(e.currentTarget.value, 'progress');
	}
	async function changeToCompleted(e: MouseEvent<HTMLButtonElement>): Promise<void> {
		const accountId = e.currentTarget.value;
		await changeOrderStatus(e.currentTarget.value, 'completed');
		if (Accounts[accountId]) delete Accounts[accountId];
		setAccounts({ ...{}, ...Accounts });
	}
	return (
		<>
			<ProgressOrderView
				Accounts={Accounts}
				changeToCompleted={changeToCompleted}
				changeToOrdered={changeToOrdered}
				changeToProgress={changeToProgress}
			/>
		</>
	);
}
