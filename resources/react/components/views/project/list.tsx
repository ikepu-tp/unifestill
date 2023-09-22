import { ListGroup } from 'react-bootstrap';
import ListView from '~/components/commons/ListView';
import { ParamIndexType, ResponseIndexType, ResponseType } from '~/functions/fetch';
import { ProjectResource } from '~/models/interfaces';
import { Project } from '~/models/project';

export default function ProjectList(): JSX.Element {
	async function getItems(params: ParamIndexType): Promise<ResponseIndexType<ProjectResource>> {
		const project = new Project();
		const items: ResponseType<ResponseIndexType<ProjectResource>> | null = await project.index(params);
		if (!items || !items.payloads) throw new Error('予期せぬエラーが発生しました');
		return items.payloads;
	}
	return (
		<>
			<ListView
				getItems={getItems}
				itemCallback={(item: ProjectResource): JSX.Element => (
					<ListGroup.Item key={item['projectId']} action>
						{item['name']}
					</ListGroup.Item>
				)}
				itemWrapper={ListGroup}
			/>
		</>
	);
}
