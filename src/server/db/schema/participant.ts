import { relations } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
} from "drizzle-zod";
import type z from "zod";
import { defaultTableColumns } from "#/server/db/schema/default-table-columns";
import { registration } from "#/server/db/schema/registration";
import { result } from "#/server/db/schema/result";
import { genderEnum } from "#/server/db/schema/shared";

export const participant = pgTable("participant", (d) => ({
	firstName: d.varchar("first_name", { length: 100 }).notNull(),
	lastName: d.varchar("last_name", { length: 100 }).notNull(),
	gender: genderEnum().notNull(),
	city: d.varchar({ length: 50 }),
	state: d.varchar({ length: 15 }),
	email: d.text().notNull(),
	dateOfBirth: d.date("date_of_birth", { mode: "string" }).notNull(),
	...defaultTableColumns(d),
}));

export const participantRelations = relations(participant, ({ many }) => ({
	registrations: many(registration),
	results: many(result),
}));

export const participantInsertSchema = createInsertSchema(participant);
export type ParticipantInsertSchema = z.infer<typeof participantInsertSchema>;
export const participantSelectSchema = createSelectSchema(participant);
export type ParticipantSelectSchema = z.infer<typeof participantSelectSchema>;
export const participantUpdateSchema = createUpdateSchema(participant);
export type ParticipantUpdateSchema = z.infer<typeof participantUpdateSchema>;
