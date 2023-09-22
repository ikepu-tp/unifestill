import { PropsWithChildren } from 'react';
import { Breadcrumb } from 'react-bootstrap';
import Anchor from './Anchor';

export type PageWrapperProps = PropsWithChildren & {
	title: string;
	breadCrumb?: BreadCrumbProp[];
};
export type BreadCrumbProp = {
	link: string;
	text: string;
};
export default function PageWrapper(props: PageWrapperProps): JSX.Element {
	return (
		<div>
			<h3>{props.title}</h3>
			{props.breadCrumb && (
				<Breadcrumb>
					<Breadcrumb.Item as={Anchor} href="/">
						HOME
					</Breadcrumb.Item>
					{props.breadCrumb.map(
						(item: BreadCrumbProp): JSX.Element => (
							<Breadcrumb.Item key={item.text} href={item.link}>
								{item.text}
							</Breadcrumb.Item>
						)
					)}
					<Breadcrumb.Item active>{props.title}</Breadcrumb.Item>
				</Breadcrumb>
			)}
			{props.children}
		</div>
	);
}
