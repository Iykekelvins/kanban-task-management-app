import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const createTask = mutation({
	args: {
		boardId: v.id('boards'),
		title: v.string(),
		description: v.string(),
		subtasks: v.optional(
			v.array(
				v.object({
					id: v.string(),
					title: v.string(),
					isCompleted: v.boolean(),
				}),
			),
		),
		status: v.string(),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error('Not authenticated');
		}

		const user = await ctx.db
			.query('users')
			.withIndex('by_token', (q) =>
				q.eq('tokenIdentifier', identity.tokenIdentifier),
			)
			.unique();

		if (!user) {
			throw new Error('User not found');
		}

		const taskId = await ctx.db.insert('tasks', {
			userId: user._id,
			...args,
		});

		return {
			success: true,
			message: 'Task created successfully',
			taskId,
		};
	},
});

export const getTasks = query({
	args: { boardId: v.id('boards') },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error('Not authenticated');
		}

		const user = await ctx.db
			.query('users')
			.withIndex('by_token', (q) =>
				q.eq('tokenIdentifier', identity.tokenIdentifier),
			)
			.unique();
		if (!user) {
			throw new Error('User not found');
		}

		const tasks = await ctx.db
			.query('tasks')
			.withIndex('by_user_and_boardId_and_status', (q) =>
				q.eq('userId', user._id).eq('boardId', args.boardId),
			)
			.collect();

		return tasks;
	},
});

export const getTasksByStatus = query({
	args: { boardId: v.id('boards'), status: v.string() },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error('Not authenticated');
		}

		const user = await ctx.db
			.query('users')
			.withIndex('by_token', (q) =>
				q.eq('tokenIdentifier', identity.tokenIdentifier),
			)
			.unique();
		if (!user) {
			throw new Error('User not found');
		}

		const tasks = await ctx.db
			.query('tasks')
			.withIndex('by_user_and_boardId_and_status', (q) =>
				q
					.eq('userId', user._id)
					.eq('boardId', args.boardId)
					.eq('status', args.status),
			)
			.collect();

		return tasks;
	},
});

export const editTask = mutation({
	args: {
		id: v.id('tasks'),
		title: v.optional(v.string()),
		description: v.optional(v.string()),
		subtasks: v.optional(
			v.array(
				v.object({
					id: v.string(),
					title: v.string(),
					isCompleted: v.boolean(),
				}),
			),
		),
		status: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error('Not authenticated');
		}

		const task = await ctx.db.get(args.id);
		if (!task) {
			throw new Error('Task not found - It may have been deleted');
		}

		const user = await ctx.db
			.query('users')
			.withIndex('by_token', (q) =>
				q.eq('tokenIdentifier', identity.tokenIdentifier),
			)
			.unique();
		if (!user) {
			throw new Error('User not found');
		}

		if (!user || task.userId !== user._id) {
			throw new Error(
				"Unauthorized - You don't have permission to update this task",
			);
		}

		const { id, ...updateData } = args;
		await ctx.db.patch(id, updateData);

		return {
			success: true,
			message: 'Task updated successfully!',
			taskId: id,
		};
	},
});

export const deleteTask = mutation({
	args: { id: v.id('tasks') },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error('Not authenticated');
		}

		const task = await ctx.db.get(args.id);
		if (!task) {
			throw new Error('Task not found - It may have already been deleted');
		}

		const user = await ctx.db
			.query('users')
			.withIndex('by_token', (q) =>
				q.eq('tokenIdentifier', identity.tokenIdentifier),
			)
			.unique();
		if (!user) {
			throw new Error('User not found');
		}

		if (!user || task.userId !== user?._id) {
			throw new Error(
				"Unauthorized - You don't have permission to delete this task",
			);
		}

		await ctx.db.delete(args.id);

		return {
			success: true,
			message: 'Task deleted successfully!',
		};
	},
});
