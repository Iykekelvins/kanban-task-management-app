import { api } from '@/convex/_generated/api';
import { fetchQuery } from 'convex/nextjs';
import { Metadata } from 'next';

import Board from '@/_pages/board';

type Props = {
	params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const slug = (await params).slug;

	if (!slug) {
		return {
			title: 'Kanban - Task Management App',
		};
	}

	const board = await fetchQuery(api.boards.getBoardMetadata, { slug });

	return {
		title: `${board?.name} Board`,
		description: `Manage your ${board?.name} board`,
	};
}

const Boardpage = () => {
	return <Board/>
};

export default Boardpage;
