import React from 'react';
import { ButtonVariant } from 'react-bootstrap/esm/types';
import { useNavigate } from 'react-router-dom';

export default function Anchor(
	props: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> & {
		as?: string;
		variant?: ButtonVariant;
	}
): JSX.Element {
	const navigate = useNavigate();

	function onClick(e: React.MouseEvent<HTMLAnchorElement>): void {
		e.preventDefault();
		navigate(props.href as string);
		if (props.onClick) props.onClick(e);
	}
	return (
		<a
			{...props}
			onClick={onClick}
			className={(props.as === 'button' ? `btn btn-${props.variant || 'primary'}` : '') + ` ${props.className}`}
		/>
	);
}
