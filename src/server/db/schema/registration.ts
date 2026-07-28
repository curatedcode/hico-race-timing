import { relations } from "drizzle-orm";
import { index, pgEnum, pgTable, unique } from "drizzle-orm/pg-core";
import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
} from "drizzle-zod";
import type z from "zod";
import { defaultTableColumns } from "#/server/db/schema/default-table-columns";
import { event } from "#/server/db/schema/event";
import { participant } from "#/server/db/schema/participant";

export const shirtSizeEnum = pgEnum("registration_shirt_size", [
	"S",
	"M",
	"L",
	"XL",
	"2XL",
	"3XL",
	"4XL",
	"5XL",
]);

export const registration = pgTable(
	"registration",
	(d) => ({
		participantId: d
			.bigint("participant_id", { mode: "number" })
			.notNull()
			.references(() => participant.id, { onDelete: "cascade" }),
		eventId: d
			.bigint("event_id", { mode: "number" })
			.notNull()
			.references(() => event.id, { onDelete: "cascade" }),
		bib: d.integer().notNull(),
		shirtSize: shirtSizeEnum("shirt_size").notNull(),
		...defaultTableColumns(d),
	}),
	(table) => [
		index("registration_participant_id_idx").on(table.participantId),
		index("registration_event_id_idx").on(table.eventId),
		unique().on(table.eventId, table.bib),
		unique().on(table.participantId, table.eventId),
	],
);

export const registrationRelations = relations(registration, ({ one }) => ({
	participant: one(participant, {
		fields: [registration.participantId],
		references: [participant.id],
	}),
	event: one(event, {
		fields: [registration.eventId],
		references: [event.id],
	}),
}));

export const registrationInsertSchema = createInsertSchema(registration);
export type RegistrationInsertSchema = z.infer<typeof registrationInsertSchema>;
export const registrationSelectSchema = createSelectSchema(registration);
export type RegistrationSelectSchema = z.infer<typeof registrationSelectSchema>;
export const registrationUpdateSchema = createUpdateSchema(registration);
export type RegistrationUpdateSchema = z.infer<typeof registrationUpdateSchema>;
