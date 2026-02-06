import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

const COLORS: Record<string, string> = {
	todo: '#49C4E5',
	doing: '#8471F2',
	done: '#67E2AE',
};

export default function Column({
	column,
	boardId,
}: {
	column: string;
	boardId: Id<'boards'>;
}) {
	const tasksByColumn = useQuery(api.tasks.getTasks, {
		boardId,
		status: column.toLowerCase(),
	});
	return (
		<div key={column} className='min-w-70'>
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
