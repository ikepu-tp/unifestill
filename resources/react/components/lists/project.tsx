import { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { ParamIndexType, ResponseIndexType, ResponseType } from '~/functions/fetch';
import { ProjectResource } from '~/models/interfaces';
import Paginate from '../commons/paginate';
import { Project } from '~/models/project';

export default function ProjectList(): JSX.Element {
	const [Page, setPage] = useState<number>(1);
	const [Items, setItems] = useState<ResponseIndexType<ProjectResource>>();

	useEffect(() => {
		getItems({ page: Page });
	}, [Page]);

	async function getItems(params: ParamIndexType): Promise<void> {
		const project = new Project();
		const items: ResponseType<ResponseIndexType<ProjectResource>> | null = await project.index(params);
		if (items === null || items.payloads === undefined) return;
		setItems({ ...{}, ...items.payloads });
	}

	if (!Items) return <></>;
	return (
		<>
			<ListGroup>
				{Items.items.map(
					(item: ProjectResource): JSX.Element => (
						<ListGroup.Item key={item['projectId']} action>
							{item['name']}
						</ListGroup.Item>
					)
				)}
			</ListGroup>
			<Paginate setPage={setPage} meta={Items.meta} />
		</>
	);
}
