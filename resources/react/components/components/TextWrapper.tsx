import { PropsWithChildren } from 'react';

export default function TextWrapper(props: PropsWithChildren): JSX.Element {
	return <div className="">{props.children}</div>;
}
