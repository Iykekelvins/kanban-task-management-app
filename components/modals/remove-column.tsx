import { Button } from '../ui/button';
import { DialogContent, DialogDescription, DialogTitle } from '../ui/dialog';

export default function RemoveColumn({
	onRemove,
	onClose,
}: {
	onRemove: () => void;
	onClose: () => void;
}) {
	return (
		<DialogContent>
			<DialogTitle className='text-red'>Delete this column?</DialogTitle>
			<DialogDescription className='text-medium-grey! font-medium text-b-l mt-2'>
				Are you sure you want to delete this column? This action will remove all
				tasks from the column and cannot be reversed.
			</DialogDescription>

			<div className='flex flex-col sm:flex-row items-center gap-4 mt-4'>
				<Button
					variant={'destructive'}
					className='w-full sm:w-1/2'
					onClick={() => {
						onRemove();
						onClose();
					}}>
					Delete
				</Button>
				<Button variant={'secondary'} className='w-full sm:w-1/2' onClick={onClose}>
					Cancel
				</Button>
			</div>
		</DialogContent>
	);
}
