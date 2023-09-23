import React, { FormEvent, useEffect, useState } from 'react';
import { Alert, Form } from 'react-bootstrap';
import { ResponseErrorType, ResponseType } from '~/functions/fetch';

export type FormWrapperProps = React.PropsWithChildren & {
	onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<ResponseType | null>;
	setButtonDisabled?: React.Dispatch<React.SetStateAction<boolean>>;
	success?: (payloads: object | any) => void;
};
export default function FormWrapper(props: FormWrapperProps): JSX.Element {
	const [Validated, setValidated] = useState<boolean>(false);
	const [ButtonDisabled, setButtonDisabled] = useState<boolean>(false);
	const [Errors, setError] = useState<undefined | ResponseErrorType>(undefined);

	useEffect(() => {
		if (props.setButtonDisabled) props.setButtonDisabled(ButtonDisabled);
	}, [ButtonDisabled]);

	async function onSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
		e.preventDefault();
		setButtonDisabled(true);
		setError(undefined);
		if (!e.currentTarget.checkValidity()) {
			setValidated(true);
			setButtonDisabled(false);
			return;
		}
		setValidated(false);
		const response: ResponseType | null = await props.onSubmit(e);
		if (response === null) throw new Error('予期せぬエラーが発生');
		if (response.error) setError({ ...response.error });
		if (response.payloads && props.success) props.success(response.payloads);
		setButtonDisabled(false);
	}
	return (
		<Form noValidate validated={Validated} onSubmit={onSubmit}>
			{Errors && (
				<Alert variant="warning">
					[{Errors.abstract}]{Errors.title}
				</Alert>
			)}
			{props.children}
		</Form>
	);
}
