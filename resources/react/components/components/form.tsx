import { ChangeEvent, FormEvent } from 'react';
import { ResponseType } from '~/functions/fetch';

export type FormResourceProps<Resource = any | { [s: string]: any }> = {
	Resource: Resource;
	changeResource?: (key: string, value: any) => void;
};
export type FormProps<
	Resource = any | { [s: string]: any },
	SubmitResponse = ResponseType
> = FormResourceProps<Resource> & {
	changeResourceStr?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	changeResourceNum?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	ButtonDisabled?: boolean;
	setButtonDisabled?: React.Dispatch<React.SetStateAction<boolean>>;
	onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<ResponseType<Resource> | SubmitResponse>;
	success?: (payloads: Resource) => void;
};
