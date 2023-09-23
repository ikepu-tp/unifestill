import { ListGroup } from 'react-bootstrap';
import Anchor from '~/components/commons/Anchor';
import ListView from '~/components/commons/ListView';
import { ParamIndexType, ResponseIndexType, ResponseType } from '~/functions/fetch';
import route from '~/functions/route';
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
					<ListGroup.Item
						as={Anchor}
						key={item['projectId']}
						action
						href={route('project.show', { project: item['projectId'] })}
					>
						{item['name']}
					</ListGroup.Item>
				)}
				itemWrapper={ListGroup}
			/>
		</>
	);
}
