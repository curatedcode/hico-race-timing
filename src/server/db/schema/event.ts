import { relations } from "drizzle-orm";
import { index, pgTable, unique } from "drizzle-orm/pg-core";
import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
} from "drizzle-zod";
import type z from "zod";
import { ageGroup } from "#/server/db/schema/ageGroup";
import { defaultTableColumns } from "#/server/db/schema/default-table-columns";
import { race } from "#/server/db/schema/race";
import { registration } from "#/server/db/schema/registration";
import { result } from "#/server/db/schema/result";

export const event = pgTable(
	"event",
	(d) => ({
		name: d.text().notNull(),
		slug: d.text().unique().notNull(),
		raceId: d
			.bigint("race_id", { mode: "number" })
			.notNull()
			.references(() => race.id, { onDelete: "cascade" }),
		distanceKm: d.numeric("distance_km", { precision: 8, scale: 4 }).notNull(),
		distanceLabel: d.varchar("distance_label", { length: 50 }).notNull(),
		startTimeUtc: d.timestamp("start_time_utc", { withTimezone: true }),
		startTimeLocal: d.text("start_time_local"),
		startTimezone: d.text("start_timezone"),
		startDate: d.date("start_date", { mode: "string" }),
		finalizedTimeUtc: d.timestamp("finalized_time_utc", { withTimezone: true }),
		finalizedTimeLocal: d.text("finalized_time_local"),
		finalizedTimezone: d.text("finalized_timezone"),
		finalizedDate: d.date("finalized_date", { mode: "string" }),
		...defaultTableColumns(d),
	}),
	(table) => [
		index("event_race_id_idx").on(table.raceId),
		unique().on(table.raceId, table.distanceLabel),
		unique().on(table.raceId, table.slug),
		index("event_start_time_utc").on(table.startTimeUtc),
	],
);

export const eventRelations = relations(event, ({ one, many }) => ({
	race: one(race, {
		fields: [event.raceId],
		references: [race.id],
	}),
	ageGroups: many(ageGroup),
	registrations: many(registration),
	results: many(result),
}));

export const eventInsertSchema = createInsertSchema(event);
export type EventInsertSchema = z.infer<typeof eventInsertSchema>;
export const eventSelectSchema = createSelectSchema(event);
export type EventSelectSchema = z.infer<typeof eventSelectSchema>;
export const eventUpdateSchema = createUpdateSchema(event);
export type EventUpdateSchema = z.infer<typeof eventUpdateSchema>;
