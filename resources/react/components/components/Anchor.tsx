import { Anchor as BaseAnchor, AnchorProps } from '@ikepu-tp/react-bootstrap-extender';
import { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Anchor(props: AnchorProps): JSX.Element {
	const navigate = useNavigate();

	function onClick(e: MouseEvent<HTMLAnchorElement>): void {
		if (props.onClick) {
			props.onClick(e);
			return;
		}
		e.preventDefault();
		navigate(e.currentTarget.pathname);
	}
	return <BaseAnchor {...props} onClick={onClick} />;
}
