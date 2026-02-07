import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { PopoverContent } from '@/components/ui/popover';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { api } from '@/convex/_generated/api';

import NewTask from '@/components/modals/new-task';
import DeleteTask from '@/components/modals/delete-task';

export default function TaskOptions({
	task,
	setOpenTaskModal,
	setOpenTaskOptionsModal,
}: {
	task: TaskProps | null | undefined;
	setOpenTaskModal: (e: boolean) => void;
	setOpenTaskOptionsModal: (e: boolean) => void;
}) {
	const [openEditTaskModal, setOpenEditTaskModal] = useState(false);
	const [openDeleteTaskModal, setOpenDeleteTaskModal] = useState(false);

	const params = useParams();
	const boardSlug = params.slug || '';

	const board = useQuery(api.boards.getBoard, {
		slug: boardSlug as string,
	});

	return (
		<PopoverContent
			align='center'
			className='bg-white shadow-[0px_10px_20px_0px_#364E7E40] 
      rounded-lg p-4 w-48 mt-4 flex flex-col gap-4 items-start'>
			<Dialog open={openEditTaskModal} onOpenChange={setOpenEditTaskModal}>
				<DialogTrigger asChild>
					<button className='text-medium-grey font-medium text-b-l w-full text-left'>
						Edit Task
					</button>
				</DialogTrigger>
				<NewTask
					task={task}
					board={board}
					onClose={() => {
						setOpenEditTaskModal(false);
						setOpenTaskOptionsModal(false);
					}}
				/>
			</Dialog>
			<Dialog open={openDeleteTaskModal} onOpenChange={setOpenDeleteTaskModal}>
				<DialogTrigger asChild>
					<button className='text-red font-medium text-b-l w-full text-left'>
						Delete Task
					</button>
				</DialogTrigger>
				<DeleteTask
					task={task}
					setOpenDeleteTaskModal={setOpenDeleteTaskModal}
					onClose={() => setOpenTaskModal(false)}
				/>
			</Dialog>
		</PopoverContent>
	);
}
