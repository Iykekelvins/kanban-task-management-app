import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { useMutation } from 'convex/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogContent, DialogTitle } from '@/components/ui/dialog';
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
import { z } from 'zod';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

const formSchema = z.object({
	name: z.string().min(1, 'Board name is required'),
	columns: z
		.array(
			z.object({
				value: z.string().min(1, 'Column name cannot be empty'),
			}),
		)
		.optional(),
});

export default function NewBoard({ onClose }: { onClose: () => void }) {
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

	const addColumn = () => append({ value: '' });

	const createBoard = useMutation(api.boards.createBoard);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const columnStrings = values.columns?.map((col) => col.value) || [];

			const result = await createBoard({
				name: values.name,
				columns: columnStrings,
			});

			if (result.success) {
				toast.success(result.message);
				router.push(`/?board=${result?.slug}`);
				onClose();
				form.reset({
					name: '',
					columns: [{ value: 'Todo' }, { value: 'Doing' }, { value: 'Done' }],
				});
			} else {
				toast.error(result.message);
			}
		} catch (error) {
			console.log(error);
			toast.error('Failed to create board');
		}
	}

	return (
		<DialogContent>
			<DialogTitle>Add New Board</DialogTitle>
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
													<button type='button' onClick={() => remove(idx)}>
														<X className='h-4 w-4 text-medium-grey hover:text-red' />
													</button>
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
						<span>Create New Board</span>
					</Button>
				</form>
			</Form>
		</DialogContent>
	);
}
