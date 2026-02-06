import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { PopoverContent } from '@/components/ui/popover';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { api } from '@/convex/_generated/api';

import DeleteBoard from '../modals/delete-board';

export default function BoardOptions({ onClose }: { onClose: () => void }) {
	const [openEditBoardModal, setOpenEditBoardModal] = useState(false);
	const [openDeleteBoardModal, setOpenDeleteBoardModal] = useState(false);

	const params = useSearchParams();
	const boardSlug = params.get('board') || '';

	const board = useQuery(api.boards.getBoard, {
		slug: boardSlug,
	});

	return (
		<PopoverContent
			align='end'
			className='bg-white shadow-[0px_10px_20px_0px_#364E7E40] 
      rounded-lg p-4 w-48 mt-6 flex flex-col gap-4 items-start'>
			<Dialog open={openEditBoardModal} onOpenChange={setOpenEditBoardModal}>
				<DialogTrigger asChild>
					<button className='text-medium-grey font-medium text-b-l w-full text-left'>
						Edit Board
					</button>
				</DialogTrigger>
			</Dialog>
			<Dialog open={openDeleteBoardModal} onOpenChange={setOpenDeleteBoardModal}>
				<DialogTrigger asChild>
					<button className='text-red font-medium text-b-l w-full text-left'>
						Delete Board
					</button>
				</DialogTrigger>
				<DeleteBoard
					board={board}
					setOpenDeleteBoardModal={setOpenDeleteBoardModal}
					onClose={() => {
						onClose();
						setOpenDeleteBoardModal(false);
					}}
				/>
			</Dialog>
		</PopoverContent>
	);
}
