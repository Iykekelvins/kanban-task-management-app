import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
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
}: {
	column: string;
	board: BoardProps;
	idx: number;
}) {
	const tasksByColumn = useQuery(api.tasks.getTasksByStatus, {
		boardId: board?._id,
		status: column,
	});

	return (
		<div key={column} className={cn('min-w-70', idx === 0 && 'ml-6')}>
			<h2 className='flex items-center gap-3'>
				<span
					className='size-3.75 rounded-full'
					style={{ backgroundColor: COLORS[column.toLowerCase()] || '#828FA3' }}
				/>{' '}
				<span className='text-medium-grey text-h-s tracking-[2.4px]'>
					{column.toUpperCase()} ({tasksByColumn?.length})
				</span>
			</h2>

			<ul className='mt-6 flex flex-col gap-5'>
				{tasksByColumn?.map((task) => (
					<Task key={task?._id} task={task} board={board} />
				))}
			</ul>
		</div>
	);
}
