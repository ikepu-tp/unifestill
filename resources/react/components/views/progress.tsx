import { useCallback, useEffect, useRef } from 'react';
import { render } from '~/index';

export function ProgressView(): JSX.Element {
	const { openES, closeES } = useES();
	useEffect(() => {
		openES('');
		return () => {
			closeES();
		};
	}, []);
	return (
		<>
			Progress View
			<button type="button" className="btn btn-primary d-block" onClick={closeES}>
				close
			</button>
		</>
	);
}

export function useES<T = any>() {
	const ESRef = useRef<EventSource | null>(null);
	const openES = useCallback((esUrl: string, onMessage?: (props: T) => void, onError?: (ev: Event) => void) => {
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

	const closeES = useCallback(() => {
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
