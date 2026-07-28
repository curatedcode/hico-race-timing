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
import { event } from "#/server/db/schema/event";
import { participant } from "#/server/db/schema/participant";
import { race } from "#/server/db/schema/race";

export const result = pgTable(
	"result",
	(d) => ({
		participantId: d
			.bigint("participant_id", { mode: "number" })
			.notNull()
			.references(() => participant.id, { onDelete: "cascade" }),
		eventId: d
			.bigint("event_id", { mode: "number" })
			.notNull()
			.references(() => event.id, { onDelete: "cascade" }),
		raceId: d
			.bigint("race_id", { mode: "number" })
			.notNull()
			.references(() => race.id, { onDelete: "cascade" }),
		gunTime: d.integer("gun_time").notNull(),
		chipTime: d.integer("chip_time").notNull(),
		overallRank: d.integer("overall_rank"),
		genderRank: d.integer("gender_rank"),
		ageGroupRank: d.integer("age_group_rank"),
		ageGroupId: d
			.bigint("age_group_id", { mode: "number" })
			.notNull()
			.references(() => ageGroup.id, { onDelete: "cascade" }),
		bib: d.integer("bib").notNull(),
		ageOnDay: d.integer("age_on_day").notNull(),
		...defaultTableColumns(d),
	}),
	(table) => [
		index("result_participant_id_idx").on(table.participantId),
		index("result_event_id_idx").on(table.eventId),
		index("result_age_group_id_idx").on(table.ageGroupId),
		unique().on(table.participantId, table.eventId),
	],
);

export const resultRelations = relations(result, ({ one }) => ({
	participant: one(participant, {
		fields: [result.participantId],
		references: [participant.id],
	}),
	event: one(event, {
		fields: [result.eventId],
		references: [event.id],
	}),
	race: one(race, {
		fields: [result.raceId],
		references: [race.id],
	}),
	ageGroup: one(ageGroup, {
		fields: [result.ageGroupId],
		references: [ageGroup.id],
	}),
}));

export const resultInsertSchema = createInsertSchema(result);
export type ResultInsertSchema = z.infer<typeof resultInsertSchema>;
export const resultSelectSchema = createSelectSchema(result);
export type ResultSelectSchema = z.infer<typeof resultSelectSchema>;
export const resultUpdateSchema = createUpdateSchema(result);
export type ResultUpdateSchema = z.infer<typeof resultUpdateSchema>;
