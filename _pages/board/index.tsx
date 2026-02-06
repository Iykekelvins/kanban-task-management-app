'use client';

import { useState } from 'react';
import { useQuery } from 'convex/react';
import { useParams } from 'next/navigation';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';

import NewBoard from '@/components/modals/new-board';
import Column from './column';

const Board = () => {
	const params = useParams();
	const boardSlug = params.slug as string;

	const [openEditBoardModal, setOpenEditBoardModal] = useState(false);

	const board = useQuery(api.boards.getBoard, {
		slug: boardSlug,
	});

	if (board?.columns && board?.columns?.length === 0) {
		return (
			<div className='flex flex-col items-center justify-center flex-1 p-4 gap-4'>
				<p className='text-h-l text-medium-grey items-center text-center'>
					This board is empty. Create a new column to get started.
				</p>

				<Dialog open={openEditBoardModal} onOpenChange={setOpenEditBoardModal}>
					<DialogTrigger asChild>
						<Button>+ Add New Column</Button>
					</DialogTrigger>
					<NewBoard board={board} onClose={() => setOpenEditBoardModal(false)} />
				</Dialog>
			</div>
		);
	}

	return (
		<div className='p-6'>
			<div className='flex items-start gap-6 overflow-y-auto'>
				{board?.columns?.map((column) => (
					<Column column={column} key={column} boardId={board?._id} />
				))}
			</div>
		</div>
	);
};

export default Board;
