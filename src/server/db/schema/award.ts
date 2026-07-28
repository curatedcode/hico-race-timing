import { relations } from "drizzle-orm";
import { index, pgTable } from "drizzle-orm/pg-core";
import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
} from "drizzle-zod";
import type z from "zod";
import { defaultTableColumns } from "#/server/db/schema/default-table-columns";
import { event } from "#/server/db/schema/event";
import { participant } from "#/server/db/schema/participant";
import { race } from "#/server/db/schema/race";

export const award = pgTable(
	"award",
	(d) => ({
		participantId: d
			.bigint("participant_id", { mode: "number" })
			.notNull()
			.references(() => participant.id, { onDelete: "cascade" }),
		eventId: d
			.bigint("event_id", { mode: "number" })
			.references(() => event.id, { onDelete: "cascade" }),
		raceId: d
			.bigint("race_id", { mode: "number" })
			.references(() => race.id, { onDelete: "cascade" }),
		title: d.text().notNull(),
		...defaultTableColumns(d),
	}),
	(table) => [
		index("award_participant_id_idx").on(table.participantId),
		index("award_event_id_idx").on(table.eventId),
		index("award_race_id_idx").on(table.raceId),
	],
);

export const awardRelations = relations(award, ({ one }) => ({
	participant: one(participant, {
		fields: [award.participantId],
		references: [participant.id],
	}),
	event: one(event, {
		fields: [award.eventId],
		references: [event.id],
	}),
	race: one(race, {
		fields: [award.raceId],
		references: [race.id],
	}),
}));

export const awardInsertSchema = createInsertSchema(award);
export type AwardInsertSchema = z.infer<typeof awardInsertSchema>;
export const awardSelectSchema = createSelectSchema(award);
export type AwardSelectSchema = z.infer<typeof awardSelectSchema>;
export const awardUpdateSchema = createUpdateSchema(award);
export type AwardUpdateSchema = z.infer<typeof awardUpdateSchema>;
