import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Anchor(
	props: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>
): JSX.Element {
	const navigate = useNavigate();

	function onClick(e: React.MouseEvent<HTMLAnchorElement>): void {
		e.preventDefault();
		navigate(props.href as string);
		if (props.onClick) props.onClick(e);
	}
	return <a {...props} onClick={onClick} />;
}
