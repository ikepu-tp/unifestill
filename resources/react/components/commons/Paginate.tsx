import { Pagination } from 'react-bootstrap';
import { ResponseMetaType } from '~/functions/fetch';

export type PaginateType = {
	setPage: (page: number) => void;
	meta: ResponseMetaType;
};
export default function Paginate(props: PaginateType): JSX.Element {
	function toPrev(): void {
		props.setPage(Math.max(props.meta.currentPage, 1));
	}
	function toNext(): void {
		props.setPage(Math.min(props.meta.lastPage, props.meta.currentPage + 1));
	}
	function toFirst(): void {
		props.setPage(1);
	}
	function toLast(): void {
		props.setPage(props.meta.lastPage);
	}
	return (
		<Pagination>
			<Pagination.First onClick={toFirst} disabled={props.meta.currentPage === 1} />
			<Pagination.Prev onClick={toPrev} disabled={props.meta.currentPage === 1} />
			<Pagination.Item disabled>{props.meta.currentPage}</Pagination.Item>
			<Pagination.Next onClick={toNext} disabled={props.meta.lastPage === props.meta.currentPage} />
			<Pagination.Last onCanPlay={toLast} disabled={props.meta.currentPage === props.meta.lastPage} />
		</Pagination>
	);
}
