'use client';

import { useState } from 'react';
import { useQuery } from 'convex/react';
import { useParams } from 'next/navigation';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
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

	if (!board) {
		return (
			<div className='flex flex-col items-center justify-center flex-1 p-4 gap-4'>
				<Spinner className='text-purple' />
			</div>
		);
	}

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
		<div className='py-6 flex-1 grid'>
			<div className='flex items-start gap-6 overflow-x-auto flex-1'>
				{board?.columns?.map((column, idx) => (
					<Column column={column} key={column} board={board} idx={idx} />
				))}
				<div
					className='flex items-center justify-center h-full min-w-70
					bg-linear-to-b from-slate-100 to-slate-100/50
				dark:from-slate-800/25 dark:to-slate-800/12
				  rounded-md mr-6
				  '>
					<Dialog open={openEditBoardModal} onOpenChange={setOpenEditBoardModal}>
						<DialogTrigger asChild>
							<button className='h-full text-medium-grey text-h-xl'>
								+ New Column
							</button>
						</DialogTrigger>
						<NewBoard board={board} onClose={() => setOpenEditBoardModal(false)} />
					</Dialog>
				</div>
			</div>
		</div>
	);
};

export default Board;
