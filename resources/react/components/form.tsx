import { ChangeEvent, FormEvent } from 'react';
import { ResponseType } from '~/functions/fetch';

export type FormProps<Resource = any | { [s: string]: any }, SubmitResponse = ResponseType> = {
	Resource: Resource;
	changeResourceStr?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	changeResourceNum?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	ButtonDisabled?: boolean;
	setButtonDisabled?: React.Dispatch<React.SetStateAction<boolean>>;
	onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<ResponseType<Resource> | SubmitResponse>;
	success?: (payloads: Resource) => void;
};
