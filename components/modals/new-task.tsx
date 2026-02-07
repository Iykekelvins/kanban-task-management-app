import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useMutation } from 'convex/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogContent, DialogDescription, DialogTitle } from '../ui/dialog';
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
import { Textarea } from '../ui/textarea';
import { X } from 'lucide-react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select';

// import crypto from 'crypto';

const formSchema = z.object({
	title: z.string().min(1, 'Task title is required'),
	description: z.string().min(1, 'Task description is required'),
	subtasks: z
		.array(
			z.object({
				value: z.string().min(1, 'Subtask name cannot be empty'),
				id: z.string(),
			}),
		)
		.optional()
		.superRefine((subtasks, ctx) => {
			if (!subtasks || subtasks.length === 0) return;

			const seen = new Map<string, number>();
			subtasks.forEach((col, idx) => {
				const normalized = col.value.toLowerCase().trim();
				if (seen.has(normalized)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Subtask name already exists',
						path: [idx, 'value'],
					});
				} else {
					seen.set(normalized, idx);
				}
			});
		}),
	status: z.string().min(1, 'Task status is required'),
});

export default function NewTask({
	board,
	task,
	onClose,
}: {
	board: BoardProps | null | undefined;
	task?: TaskProps | null | undefined;
	onClose: () => void;
}) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			description: '',
			status: '',
			subtasks: [
				{ value: '', id: crypto.randomUUID() },
				{ value: '', id: crypto.randomUUID() },
			],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'subtasks',
	});

	const addSubtask = () => append({ value: '', id: crypto.randomUUID() });

	const createTask = useMutation(api.tasks.createTask);
	const editTask = useMutation(api.tasks.editTask);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const subtasks =
				values.subtasks?.map((col) => {
					return {
						id: col.id,
						title: col.value,
						isCompleted: false,
					};
				}) || [];

			if (!task) {
				const result = await createTask({
					boardId: board?._id,
					title: values.title,
					description: values.description,
					status: values.status,
					subtasks,
				});

				if (result.success) {
					toast.success(result?.message);
					onClose();
					form.reset({
						title: '',
						description: '',
						status: '',
					});
				} else {
					toast.error(result.message);
				}
			} else {
				const subtasks =
					values.subtasks?.map((col) => {
						return {
							title: col.value,
							id: col.id,
							isCompleted: task?.subtasks?.find((task) => task.id === col.id)
								?.isCompleted as boolean,
						};
					}) || [];

				const result = await editTask({
					id: task._id,
					title: values.title,
					description: values.description,
					status: values.status,
					subtasks,
				});

				if (result.success) {
					toast.success(result?.message);
					onClose();
				} else {
					toast.error(result.message);
				}
			}
		} catch (error) {
			console.log(error);
			toast.error('Failed to create/edit task');
		}
	}

	useEffect(() => {
		if (!task) return;

		form.reset({
			title: task?.title,
			description: task?.description,
			subtasks: task?.subtasks?.map((sub) => {
				return {
					value: sub?.title,
					id: sub.id,
				};
			}),
			status: task?.status,
		});
	}, [form, task]);

	return (
		<DialogContent>
			<DialogTitle>{!task ? 'Add New' : 'Edit'} Task</DialogTitle>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
					<FormField
						control={form.control}
						name='title'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Title</FormLabel>
								<FormControl>
									<Input placeholder='e.g. Take coffee break' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='description'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Textarea
										placeholder='e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little.'
										className='h-28'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div>
						<span className='text-medium-grey text-xs'>Subtasks</span>
						<div className='mt-2 flex flex-col gap-3'>
							{fields.map((field, idx) => (
								<FormField
									key={field.id}
									control={form.control}
									name={`subtasks.${idx}.value`}
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<div className='flex items-center gap-4'>
													<Input {...field} placeholder='e.g. Make coffee' />
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
								onClick={addSubtask}>
								+ Add New Subtask
							</Button>
						</div>
					</div>

					<FormField
						control={form.control}
						name='status'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Status</FormLabel>
								<Select onValueChange={field.onChange} defaultValue={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder='Select a status for your task' />
										</SelectTrigger>
									</FormControl>
									<SelectContent
										className='bg-white shadow-[0px_10px_20px_0px_#364E7E40]'
										align='center'>
										{board?.columns?.map((column) => (
											<SelectItem
												key={column}
												value={column}
												className='text-medium-grey! text-b-l font-medium'>
												{column}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button className='w-full' disabled={form.formState.isSubmitting}>
						{form.formState.isSubmitting && <Spinner />}
						{!task ? 'Create Task' : 'Save Changes'}
					</Button>
				</form>
			</Form>
			<DialogDescription hidden />
		</DialogContent>
	);
}
