import { relations } from "drizzle-orm";
import { index, pgTable, unique } from "drizzle-orm/pg-core";
import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
} from "drizzle-zod";
import type z from "zod";
import { defaultTableColumns } from "#/server/db/schema/default-table-columns";
import { event } from "#/server/db/schema/event";
import { genderEnum } from "#/server/db/schema/shared";

export const ageGroup = pgTable(
	"age_group",
	(d) => ({
		eventId: d
			.bigint("event_id", { mode: "number" })
			.notNull()
			.references(() => event.id, { onDelete: "cascade" }),
		minAge: d.integer().notNull(),
		maxAge: d.integer().notNull(),
		gender: genderEnum(),
		label: d.text().notNull(),
		...defaultTableColumns(d),
	}),
	(table) => [
		index("age_group_event_id_idx").on(table.eventId),
		unique().on(table.eventId, table.gender, table.minAge, table.maxAge),
	],
);

export const ageGroupRelations = relations(ageGroup, ({ one }) => ({
	event: one(event, {
		fields: [ageGroup.eventId],
		references: [event.id],
	}),
}));

export const ageGroupInsertSchema = createInsertSchema(ageGroup);
export type AgeGroupInsertSchema = z.infer<typeof ageGroupInsertSchema>;
export const ageGroupSelectSchema = createSelectSchema(ageGroup);
export type AgeGroupSelectSchema = z.infer<typeof ageGroupSelectSchema>;
export const ageGroupUpdateSchema = createUpdateSchema(ageGroup);
export type AgeGroupUpdateSchema = z.infer<typeof ageGroupUpdateSchema>;
