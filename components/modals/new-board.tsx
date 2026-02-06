import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { useMutation } from 'convex/react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { api } from '@/convex/_generated/api';
import { z } from 'zod';
import { X } from 'lucide-react';
import RemoveColumn from './remove-column';

const formSchema = z.object({
	name: z.string().min(1, 'Board name is required'),
	columns: z
		.array(
			z.object({
				value: z.string().min(1, 'Column name cannot be empty'),
			}),
		)
		.optional()
		.superRefine((columns, ctx) => {
			if (!columns || columns.length === 0) return;

			const seen = new Map<string, number>();
			columns.forEach((col, idx) => {
				const normalized = col.value.toLowerCase().trim();
				if (seen.has(normalized)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Column name already exists',
						path: [idx, 'value'],
					});
				} else {
					seen.set(normalized, idx);
				}
			});
		}),
});

export default function NewBoard({
	board,
	onClose,
}: {
	board?: BoardProps | undefined | null;
	onClose: () => void;
}) {
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			columns: [{ value: 'Todo' }, { value: 'Doing' }, { value: 'Done' }],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'columns',
	});

	const [openDeleteColumnModal, setOpenDeleteColumnModal] = useState(false);

	const addColumn = () => append({ value: '' });

	const createBoard = useMutation(api.boards.createBoard);
	const editBoard = useMutation(api.boards.editBoard);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const columnStrings = values.columns?.map((col) => col.value) || [];

			if (!board) {
				const result = await createBoard({
					name: values.name,
					columns: columnStrings,
				});

				if (result.success) {
					toast.success(result.message);
					router.push(`/boards/${result?.slug}`);
					onClose();
					form.reset({
						name: '',
						columns: [{ value: 'Todo' }, { value: 'Doing' }, { value: 'Done' }],
					});
				} else {
					toast.error(result.message);
				}
			} else {
				const result = await editBoard({
					id: board?._id,
					name: values.name,
					columns: columnStrings,
				});

				if (result.success) {
					toast.success(result.message);
					onClose();
				} else {
					toast.error(result.message);
				}
			}
		} catch (error) {
			console.log(error);
			toast.error('Failed to create board');
		}
	}

	useEffect(() => {
		if (board) {
			form.reset({
				name: board.name,
				columns: board.columns?.map((column) => {
					return {
						value: column,
					};
				}),
			});
		}
	}, [board, form]);

	return (
		<DialogContent>
			<DialogTitle>{!board ? 'Add New' : 'Edit'} Board</DialogTitle>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input placeholder='e.g. Web Design' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div>
						<span className='text-medium-grey text-xs'>Board Columns</span>
						<div className='mt-2 flex flex-col gap-3'>
							{fields.map((field, idx) => (
								<FormField
									key={field.id}
									control={form.control}
									name={`columns.${idx}.value`}
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<div className='flex gap-4 items-center'>
													<Input placeholder='e.g. Todo' {...field} />
													{!board ? (
														<button type='button' onClick={() => remove(idx)}>
															<X className='h-4 w-4 text-medium-grey hover:text-red' />
														</button>
													) : (
														<Dialog
															open={openDeleteColumnModal}
															onOpenChange={setOpenDeleteColumnModal}>
															<DialogTrigger asChild>
																<button type='button'>
																	<X className='h-4 w-4 text-medium-grey hover:text-red' />
																</button>
															</DialogTrigger>
															<RemoveColumn
																onRemove={() => remove(idx)}
																onClose={() => setOpenDeleteColumnModal(false)}
															/>
														</Dialog>
													)}
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							))}
							<Button
								variant={'secondary'}
								className='w-full'
								type='button'
								onClick={addColumn}>
								+ Add New Column
							</Button>
						</div>
					</div>

					<Button
						className='w-full'
						type='submit'
						disabled={form.formState.isSubmitting}>
						{form.formState.isSubmitting && <Spinner />}
						<span>{!board ? 'Create New Board' : 'Save Changes'}</span>
					</Button>
				</form>
			</Form>
		</DialogContent>
	);
}
