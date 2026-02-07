'use client';

import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { useParams } from 'next/navigation';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
	closestCorners,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import { toast } from 'sonner';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

import NewBoard from '@/components/modals/new-board';
import Column from './column';
import Task from './task';

const Board = () => {
	const params = useParams();
	const boardSlug = params.slug as string;

	const [openEditBoardModal, setOpenEditBoardModal] = useState(false);
	const [activeTask, setActiveTask] = useState<TaskProps | null>(null);
	const [optimisticTasks, setOptimisticTasks] = useState<TaskProps[] | null>(null);

	const board = useQuery(api.boards.getBoard, {
		slug: boardSlug,
	});

	const tasksFromDb = useQuery(api.tasks.getTasks, {
		boardId: board?._id as Id<'boards'>,
	});

	const tasks = optimisticTasks || tasksFromDb;

	const updateTaskStatus = useMutation(api.tasks.editTask);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
	);

	function handleDragStart(event: DragStartEvent) {
		const { active } = event;
		const task = tasks?.find((t) => t._id === active.id);
		setActiveTask(task || null);
	}

	async function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		setActiveTask(null);

		if (!over) {
			return;
		}

		const taskId = active.id as string;
		const overId = over.id as string;

		const task = tasks?.find((t) => t._id === taskId);
		if (!task) {
			return;
		}

		let newStatus: string;

		if (board?.columns?.includes(overId)) {
			newStatus = overId;
		} else {
			const targetTask = tasks?.find((t) => t._id === overId);
			if (targetTask) {
				newStatus = targetTask.status;
			} else {
				return;
			}
		}

		if (task.status === newStatus) {
			return;
		}

		if (tasksFromDb) {
			const updatedTasks = tasksFromDb.map((t) =>
				t._id === taskId ? { ...t, status: newStatus } : t,
			);
			setOptimisticTasks(updatedTasks);
		}

		try {
			await updateTaskStatus({
				id: task._id,
				status: newStatus,
			});
			toast.success('Task moved successfully');

			setOptimisticTasks(null);
		} catch (error) {
			console.error(error);
			toast.error('Failed to move task');

			setOptimisticTasks(null);
		}
	}

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
			<div className='flex items-start gap-6 overflow-x-auto flex-1 hide-scroll'>
				<DndContext
					sensors={sensors}
					onDragStart={handleDragStart}
					onDragEnd={handleDragEnd}
					collisionDetection={closestCorners}>
					<div className='flex items-start gap-6'>
						{board?.columns?.map((column, idx) => (
							<Column
								column={column}
								key={column}
								board={board}
								idx={idx}
								tasks={tasks?.filter((task) => task.status === column) || []}
							/>
						))}
					</div>

					<DragOverlay>
						{activeTask ? <Task board={board} task={activeTask} isDragging /> : null}
					</DragOverlay>
				</DndContext>
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
