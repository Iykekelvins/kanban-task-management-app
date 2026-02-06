import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { Button } from '../ui/button';
import { DialogContent, DialogDescription, DialogTitle } from '../ui/dialog';
import { Spinner } from '../ui/spinner';
import { toast } from 'sonner';
import { api } from '@/convex/_generated/api';

export default function DeleteBoard({
	board,
	setOpenDeleteBoardModal,
	onClose,
}: {
	board: BoardProps | null | undefined;
	setOpenDeleteBoardModal: (e: boolean) => void;
	onClose: () => void;
}) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const deleteBoard = useMutation(api.boards.deleteBoard);

	const handleDeleteBoard = async () => {
		setLoading(true);

		try {
			const result = await deleteBoard({ id: board?._id });
			toast.success(result.message);
			onClose();
			router.push('/');
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			toast.error(error.message || 'Failed to delete board');
		} finally {
			setLoading(false);
		}
	};

	return (
		<DialogContent>
			<DialogTitle className='text-red'>Delete this board?</DialogTitle>
			<DialogDescription className='text-medium-grey! font-medium text-b-l mt-2'>
				Are you sure you want to delete the &apos;{board?.name}&apos; board? This
				action will remove all columns and tasks and cannot be reversed.
			</DialogDescription>

			<div className='flex flex-col sm:flex-row items-center gap-4 mt-4'>
				<Button
					variant={'destructive'}
					className='w-full sm:w-1/2'
					onClick={handleDeleteBoard}>
					{loading && <Spinner />}
					Delete
				</Button>
				<Button
					variant={'secondary'}
					className='w-full sm:w-1/2'
					onClick={() => setOpenDeleteBoardModal(false)}>
					Cancel
				</Button>
			</div>
		</DialogContent>
	);
}
