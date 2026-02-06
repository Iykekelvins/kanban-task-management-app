'use client';

import { useState } from 'react';
import { useQuery } from 'convex/react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { api } from '@/convex/_generated/api';

import NewBoard from '@/components/modals/new-board';

const Homepage = () => {
	const boards = useQuery(api.boards.getBoards);

	const [openNewBoardModal, setOpenNewBoardModal] = useState(false);

	return (
		<div className='flex items-center justify-center flex-1 p-4'>
			{boards && boards.length === 0 && (
				<div className='flex flex-col items-center gap-8'>
					<p className='text-h-l text-medium-grey items-center text-center'>
						Your workspace is empty. Create a new board to get started.{' '}
					</p>
					<Dialog open={openNewBoardModal} onOpenChange={setOpenNewBoardModal}>
						<DialogTrigger asChild>
							<Button>+ Create New Board</Button>
						</DialogTrigger>
						<NewBoard onClose={() => setOpenNewBoardModal(false)} />
					</Dialog>
				</div>
			)}
		</div>
	);
};

export default Homepage;
