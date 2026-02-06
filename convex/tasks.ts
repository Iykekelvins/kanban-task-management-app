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
	args: { id: v.id('boards') },
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
			.withIndex('by_user_and_boardId', (q) =>
				q.eq('userId', user._id).eq('boardId', args.id),
			)
			.collect();

		return tasks;
	},
});
