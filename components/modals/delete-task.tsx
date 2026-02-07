import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { Button } from '../ui/button';
import { DialogContent, DialogDescription, DialogTitle } from '../ui/dialog';
import { Spinner } from '../ui/spinner';
import { toast } from 'sonner';
import { api } from '@/convex/_generated/api';

export default function DeleteTask({
	task,
	setOpenDeleteTaskModal,
	onClose,
}: {
	task: TaskProps | null | undefined;
	setOpenDeleteTaskModal: (e: boolean) => void;
	onClose: () => void;
}) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const deleteTask = useMutation(api.tasks.deleteTask);

	const handleDeleteTask = async () => {
		setLoading(true);

		try {
			const result = await deleteTask({ id: task?._id });
			toast.success(result.message);
			onClose();
			router.push('/');
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			toast.error(error.message || 'Failed to delete task');
		} finally {
			setLoading(false);
		}
	};

	return (
		<DialogContent>
			<DialogTitle className='text-red'>Delete this task?</DialogTitle>
			<DialogDescription className='text-medium-grey! font-medium text-b-l mt-2'>
				Are you sure you want to delete the &apos;{task?.title}&apos; task and its
				subtasks? This action cannot be reversed.
			</DialogDescription>

			<div className='flex flex-col sm:flex-row items-center gap-4 mt-4'>
				<Button
					variant={'destructive'}
					className='w-full sm:w-1/2'
					onClick={handleDeleteTask}>
					{loading && <Spinner />}
					Delete
				</Button>
				<Button
					variant={'secondary'}
					className='w-full sm:w-1/2'
					onClick={() => setOpenDeleteTaskModal(false)}>
					Cancel
				</Button>
			</div>
		</DialogContent>
	);
}
