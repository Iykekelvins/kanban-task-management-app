import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { cn } from '@/lib/utils';

const COLORS: Record<string, string> = {
	todo: '#49C4E5',
	doing: '#8471F2',
	done: '#67E2AE',
};

export default function Column({
	column,
	boardId,
	idx,
}: {
	column: string;
	boardId: Id<'boards'>;
	idx: number;
}) {
	const tasksByColumn = useQuery(api.tasks.getTasksByStatus, {
		boardId,
		status: column.toLowerCase(),
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
		</div>
	);
}
