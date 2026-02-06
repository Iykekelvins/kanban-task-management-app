interface BoardProps {
	_id: Id<'boards'>;
	_creationTime: number;
	columns?: string[] | undefined;
	name: string;
	userId: Id<'users'>;
	slug: string;
}
