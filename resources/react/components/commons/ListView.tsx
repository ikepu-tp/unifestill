import { useEffect, useState } from 'react';
import Paginate from '~/components/commons/Paginate';
import { ParamIndexType, ResponseIndexType } from '~/functions/fetch';

export type ListViewProps = {
	getItems: (params: ParamIndexType) => Promise<ResponseIndexType>;
	itemCallback: (value: object | any, index: number, array: object[]) => JSX.Element;
	itemWrapper: any;
	reload?: string | number | boolean;
};
export default function ListView(props: ListViewProps): JSX.Element {
	const [Page, setPage] = useState<number>(1);
	const [Items, setItems] = useState<ResponseIndexType>();

	useEffect(() => {
		getItems({ page: Page });
	}, [Page, props.reload]);

	async function getItems(params: ParamIndexType): Promise<void> {
		const response = await props.getItems(params);
		setItems({ ...{}, ...response });
	}

	if (!Items) return <></>;
	return (
		<>
			<props.itemWrapper>{Items.items.map(props.itemCallback)}</props.itemWrapper>
			<Paginate setPage={setPage} meta={Items.meta} />
		</>
	);
}
