import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { cn } from '@/lib/utils';

import Task from './task';

const COLORS: Record<string, string> = {
	todo: '#49C4E5',
	doing: '#8471F2',
	done: '#67E2AE',
};

export default function Column({
	column,
	board,
	idx,
	tasks,
}: {
	column: string;
	board: BoardProps;
	idx: number;
	tasks: TaskProps[];
}) {
	const { setNodeRef, isOver } = useDroppable({
		id: column,
	});

	const taskIds = tasks.map((task) => task._id);

	return (
		<div
			key={column}
			className={cn('min-w-70 flex flex-col h-full', idx === 0 && 'ml-6')}>
			<h2 className='flex items-center gap-3'>
				<span
					className='size-3.75 rounded-full'
					style={{ backgroundColor: COLORS[column.toLowerCase()] || '#828FA3' }}
				/>{' '}
				<span className='text-medium-grey text-h-s tracking-[2.4px]'>
					{column.toUpperCase()} ({tasks.length})
				</span>
			</h2>

			<SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
				<ul
					ref={setNodeRef}
					className={cn(
						'mt-6 flex flex-col gap-5 rounded-lg transition-colors p-2 flex-1',
						isOver &&
							`bg-linear-to-b from-slate-100 to-slate-100/50
					dark:from-slate-800/25 dark:to-slate-800/12`,
					)}>
					{tasks.map((task) => (
						<Task key={task._id} task={task} board={board} />
					))}
				</ul>
			</SortableContext>
		</div>
	);
}
