import React from 'react';
import { Form } from 'react-bootstrap';

export type InputWrapperProps = React.PropsWithChildren & {
	label: string;
	required?: boolean;
};
export default function InputWrapper(props: InputWrapperProps): JSX.Element {
	return (
		<div className="mb-2">
			<Form.Label>
				{props.label}
				{props.required && <span className="text-danger">＊</span>}
			</Form.Label>
			<div className="ms-2">{props.children}</div>
		</div>
	);
}
