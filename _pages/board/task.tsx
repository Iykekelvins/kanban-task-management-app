import { useState } from 'react';
import { useMutation } from 'convex/react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { EllipsisVertical, GripVertical } from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { cn } from '@/lib/utils';

import TaskOptions from './task-options';

export default function Task({
	task,
	board,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	isDragging = false,
}: {
	task: TaskProps;
	board: BoardProps;
	isDragging?: boolean;
}) {
	const [openTaskModal, setOpenTaskModal] = useState(false);
	const [openTaskOptionsModal, setOpenTaskOptionsModal] = useState(false);

	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
		id: task._id,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<li ref={setNodeRef} style={style} className='list-none'>
			<div
				className={cn(
					'bg-white rounded-lg py-6 px-4 w-full',
					'shadow-[0px_4px_6px_0px_#364E7E1A]',
					'flex items-start gap-3 group',
				)}>
				<button
					{...attributes}
					{...listeners}
					className='cursor-grab! active:cursor-grabbing! mt-1 shrink-0'
					type='button'>
					<GripVertical className='h-5 w-5 text-medium-grey' />
				</button>

				<Dialog open={openTaskModal} onOpenChange={setOpenTaskModal}>
					<DialogTrigger asChild>
						<button className='flex-1 text-left'>
							<h3
								className='text-black text-h-m transition-colors 
							duration-300 ease-in-out group-hover:text-purple'>
								{task?.title}
							</h3>
							<p className='mt-2 text-xs text-medium-grey'>
								{task?.subtasks?.filter((sub) => sub?.isCompleted).length} of{' '}
								{task?.subtasks?.length} subtasks
							</p>
						</button>
					</DialogTrigger>

					<DialogContent>
						<DialogHeader className='items-center justify-between'>
							<DialogTitle>{task?.title}</DialogTitle>
							<Popover
								open={openTaskOptionsModal}
								onOpenChange={setOpenTaskOptionsModal}>
								<PopoverTrigger asChild>
									<button>
										<EllipsisVertical className='text-medium-grey' />
									</button>
								</PopoverTrigger>
								<TaskOptions
									task={task}
									setOpenTaskOptionsModal={setOpenTaskOptionsModal}
									setOpenTaskModal={setOpenTaskModal}
								/>
							</Popover>
						</DialogHeader>

						<DialogDescription className='text-medium-grey font-medium'>
							{task?.description}
						</DialogDescription>

						<div>
							<h3 className='text-xs text-medium-grey'>
								Subtasks ({task?.subtasks?.filter((sub) => sub?.isCompleted).length}{' '}
								of {task?.subtasks?.length})
							</h3>

							<ul className='mt-4 flex flex-col gap-2'>
								{task?.subtasks?.map((subtask) => (
									<Subtask key={subtask.title} subtask={subtask} task={task} />
								))}
							</ul>
						</div>

						<div>
							<h3 className='text-xs text-medium-grey'>Current Status</h3>
							<Status task={task} board={board} />
						</div>
					</DialogContent>
				</Dialog>
			</div>
		</li>
	);
}

const Subtask = ({
	task,
	subtask,
}: {
	task: TaskProps;
	subtask: {
		title: string;
		isCompleted: boolean;
	};
}) => {
	const editTask = useMutation(api.tasks.editTask);

	const handleEditSubtasks = async () => {
		const subtasks = task?.subtasks?.map((sub) => {
			return sub.title === subtask.title
				? { ...sub, isCompleted: !sub.isCompleted }
				: sub;
		});

		await editTask({
			id: task?._id,
			subtasks,
		});
	};

	return (
		<li className='h-10 rounded-sm bg-background flex items-center px-3'>
			<label className='flex items-center gap-4' htmlFor={subtask.title}>
				<Checkbox
					id={subtask.title}
					className='size-4'
					checked={subtask?.isCompleted}
					onCheckedChange={handleEditSubtasks}
				/>
				<span
					className={cn(
						'text-black text-xs',
						subtask?.isCompleted && 'line-through opacity-50',
					)}>
					{subtask?.title}
				</span>
			</label>
		</li>
	);
};

const Status = ({ task, board }: { task: TaskProps; board: BoardProps }) => {
	const editTask = useMutation(api.tasks.editTask);

	const handleEdiStatus = async (status: string) => {
		await editTask({
			id: task?._id,
			status,
		});
	};

	return (
		<Select defaultValue={task?.status} onValueChange={(e) => handleEdiStatus(e)}>
			<SelectTrigger className='mt-2'>
				<SelectValue placeholder='Select a status for your task' />
			</SelectTrigger>
			<SelectContent
				className='bg-white shadow-[0px_10px_20px_0px_#364E7E40] mt-10'
				align='center'>
				{board?.columns?.map((column) => (
					<SelectItem
						key={column}
						value={column}
						className='text-medium-grey! text-b-l font-medium'>
						{column}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};
