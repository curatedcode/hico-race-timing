import { relations, sql } from "drizzle-orm";
import { index, pgEnum, pgTable } from "drizzle-orm/pg-core";
import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
} from "drizzle-zod";
import type z from "zod";
import { defaultTableColumns } from "#/server/db/schema/default-table-columns";
import { event } from "#/server/db/schema/event";

export const statusEnum = pgEnum("race_status", [
	"Scheduled",
	"In Progress",
	"Completed",
	"Finalized",
	"Canceled",
	"Rescheduled",
	"Postponed",
]);

export const race = pgTable(
	"race",
	(d) => ({
		name: d.text().notNull(),
		description: d.text().notNull(),
		imageUrl: d.text("image_url").notNull(),
		slug: d.text().unique().notNull(),
		startDate: d.date("start_date", { mode: "string" }),
		city: d.varchar({ length: 50 }).notNull(),
		state: d.varchar({ length: 2 }).notNull(),
		timingCompany: d.text("timing_company").notNull(),
		website: d.text().notNull(),
		organizer: d.text().notNull(),
		status: statusEnum().notNull(),
		...defaultTableColumns(d),
	}),
	(table) => [
		index("race_start_date_id_idx").on(table.startDate, table.id),
		index("race_created_at_id_idx").on(table.createdAt, table.id),
		index("race_tbd_created_at_id_idx")
			.on(table.createdAt, table.id)
			.where(sql`${table.startDate} IS NULL`),
	],
);

export const raceRelations = relations(race, ({ many }) => ({
	events: many(event),
}));

export const raceInsertSchema = createInsertSchema(race);
export type RaceInsertSchema = z.infer<typeof raceInsertSchema>;
export const raceSelectSchema = createSelectSchema(race);
export type RaceSelectSchema = z.infer<typeof raceSelectSchema>;
export const raceUpdateSchema = createUpdateSchema(race);
export type RaceUpdateSchema = z.infer<typeof raceUpdateSchema>;
