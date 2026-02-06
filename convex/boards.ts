import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const createBoard = mutation({
	args: {
		name: v.string(),
		columns: v.optional(v.array(v.string())),
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

		// find board by name
		const slug = args.name.replaceAll(' ', '-').toLowerCase();
		const board = await ctx.db
			.query('boards')
			.withIndex('by_user_and_slug', (q) =>
				q.eq('userId', user._id).eq('slug', slug),
			)
			.first();

		if (board) {
			return {
				success: false,
				message: 'Board already exists',
			};
		}

		const newBoardId = await ctx.db.insert('boards', {
			userId: user._id,
			name: args.name,
			columns: args.columns,
			slug: args.name.replaceAll(' ', '-').toLowerCase(),
		});

		return {
			success: true,
			message: 'Board created successfully',
			boardId: newBoardId,
			slug,
		};
	},
});

export const getBoards = query({
	handler: async (ctx) => {
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

		const boards = await ctx.db
			.query('boards')
			.withIndex('by_user', (q) => q.eq('userId', user._id))
			.collect();

		return boards;
	},
});

export const getBoard = query({
	args: { slug: v.string() },
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

		const board = await ctx.db
			.query('boards')
			.withIndex('by_user_and_slug', (q) =>
				q.eq('userId', user._id).eq('slug', args.slug),
			)
			.first();

		return board;
	},
});

export const getBoardMetadata = query({
	args: { slug: v.string() },
	handler: async (ctx, args) => {
		return await ctx.db
			.query('boards')
			.withIndex('by_slug', (q) => q.eq('slug', args.slug))
			.first();
	},
});

export const editBoard = mutation({
	args: {
		id: v.id('boards'),
		name: v.optional(v.string()),
		columns: v.optional(v.array(v.string())),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error('Not authenticated');
		}

		const board = await ctx.db.get(args.id);
		if (!board) {
			throw new Error('Board not found - It may have been deleted');
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

		if (!user || board.userId !== user._id) {
			throw new Error(
				"Unauthorized - You don't have permission to update this board",
			);
		}

		const { id, ...updateData } = args;
		await ctx.db.patch(id, updateData);

		return {
			success: true,
			message: 'Board updated successfully!',
			boardId: id,
		};
	},
});

export const deleteBoard = mutation({
	args: { id: v.id('boards') },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error('Not authenticated');
		}

		const board = await ctx.db.get(args.id);
		if (!board) {
			throw new Error('Board not found - It may have already been deleted');
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

		if (!user || board.userId !== user._id) {
			throw new Error(
				"Unauthorized - You don't have permission to delete this board",
			);
		}

		await ctx.db.delete(args.id);

		return {
			success: true,
			message: 'Board deleted successfully!',
		};
	},
});
