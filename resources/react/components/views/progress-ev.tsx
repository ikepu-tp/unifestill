import { useCallback, useEffect, useRef, useState } from 'react';
import { render } from '~/index';
import { AccountResource } from '~/models/interfaces';

export function ProgressView(): JSX.Element {
	const [Accounts, setAccounts] = useState<{ [s: string]: AccountResource }>({});
	const { openES, closeES } = useES<AccountResource>();
	useEffect(() => {
		const project = document.getElementById('project') as HTMLInputElement;
		const progress = document.getElementById('progress') as HTMLInputElement;
		if (!project || !progress) return;
		//return;
		openES(
			`/api/v1/project/${project.value}/account?sse=true&order_status=ordered&progress=${progress.value}`,
			(account: AccountResource): void => {
				Accounts[account['accountId']] = account;
				setAccounts({ ...{}, ...Accounts });
			}
		);
		return () => {
			closeES();
		};
	}, []);
	return (
		<>
			<button type="button" className="btn btn-primary d-block" onClick={closeES}>
				close
			</button>
		</>
	);
}

export function useES<T = any>(): {
	openES: (esUrl: string, onMessage?: (props: T) => void, onError?: (ev: Event) => void) => void;
	closeES: () => void;
	ESRef: React.MutableRefObject<EventSource | null>;
} {
	const ESRef = useRef<EventSource | null>(null);
	const openES = useCallback((esUrl: string, onMessage?: (props: T) => void, onError?: (ev: Event) => void): void => {
		if (ESRef.current !== null || esUrl === '') return;
		const es = new EventSource(esUrl);
		es.onopen = function () {
			console.log('ev was opened');
		};
		es.onmessage = function (msg) {
			const data = JSON.parse(msg.data) as T;
			if (onMessage) onMessage(data);
		};
		es.onerror = function (error) {
			if (onError) onError(error);
		};
		ESRef.current = es;
	}, []);

	const closeES = useCallback((): void => {
		if (ESRef.current === null) return;
		ESRef.current.close();
		ESRef.current = null;
		console.log('es was closed');
	}, [ESRef.current]);
	return {
		openES,
		closeES,
		ESRef,
	};
}

render('root', <ProgressView />);
