import { useCallback, useRef } from 'react';

export type OpenESType<T = any> = {
	esUrl: string;
	onOpen?: (ev: Event) => void;
	onMessage?: (me: MessageEvent<T>) => void;
	onError?: (ev: Event) => void;
};
export default function useES<T = any>(): {
	openES: (props: OpenESType<T>) => void;
	closeES: () => void;
	ESRef: React.MutableRefObject<EventSource | null>;
} {
	const ESRef = useRef<EventSource | null>(null);
	const openES = useCallback((props: OpenESType): void => {
		if (ESRef.current !== null || props.esUrl === '') return;
		const es = new EventSource(props.esUrl);
		es.onopen = function (ev: Event) {
			console.log('es was opened');
			if (props.onOpen) props.onOpen(ev);
		};
		es.onmessage = function (me: MessageEvent<string>) {
			const data = JSON.parse(me.data) as T;
			const newMe: MessageEvent<T> = { ...{}, ...me, data };
			if (props.onMessage) props.onMessage(newMe);
		};
		es.onerror = function (ev: Event) {
			if (props.onError) props.onError(ev);
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
