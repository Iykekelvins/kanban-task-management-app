type BoardProps = {
	_id: Id<'boards'>;
	_creationTime: number;
	columns?: string[] | undefined;
	name: string;
	userId: Id<'users'>;
	slug: string;
};

type TaskProps = {
	_id: Id<'tasks'>;
	_creationTime: number;
	subtasks?:
		| {
				id: string;
				title: string;
				isCompleted: boolean;
		  }[]
		| undefined;
	userId: Id<'users'>;
	boardId: Id<'boards'>;
	title: string;
	description: string;
	status: string;
};
