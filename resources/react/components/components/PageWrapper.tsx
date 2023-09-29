import { PageWrapper as BasePageWrapper, BreadCrumbType, PageWrapperProps } from '@ikepu-tp/react-bootstrap-extender';
import { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PageWrapper(props: PageWrapperProps): JSX.Element {
	const navigate = useNavigate();

	function onClick(e: MouseEvent<HTMLAnchorElement>, item: BreadCrumbType): void {
		e.preventDefault();
		navigate(item.link);
	}
	return <BasePageWrapper {...props} breadCrumbOnClick={onClick} />;
}
