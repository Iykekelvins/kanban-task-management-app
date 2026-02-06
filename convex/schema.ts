import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
	users: defineTable({
		tokenIdentifier: v.string(),
		email: v.string(),
		name: v.optional(v.string()),
		imageUrl: v.optional(v.string()),
	}).index('by_token', ['tokenIdentifier']),

	boards: defineTable({
		userId: v.id('users'),
		name: v.string(),
		slug: v.string(),
		columns: v.optional(v.array(v.string())),
	})
		.index('by_user', ['userId'])
		.index('by_slug', ['slug'])
		.index('by_user_and_slug', ['userId', 'slug']),

	tasks: defineTable({
		userId: v.id('users'),
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
	}).index('by_user_and_boardId_and_status', ['userId', 'boardId', 'status']),
});
