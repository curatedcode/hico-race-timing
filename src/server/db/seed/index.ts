import { faker as _faker } from "@faker-js/faker";
import _dayjs from "dayjs";
import isSameOrBeforePlugin from "dayjs/plugin/isSameOrBefore";
import timezonePlugin from "dayjs/plugin/timezone";
import utcPlugin from "dayjs/plugin/utc";
import { eq } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import { db } from "#/server/db";
import {
	ageGroup,
	award,
	event,
	participant,
	type ResultUpdateSchema,
	race,
	registration,
	result,
} from "#/server/db/schema";
import { createAgeGroups } from "#/server/db/seed/createAgeGroups";
import { createAwards } from "#/server/db/seed/createAwards";
import { createEvents } from "#/server/db/seed/createEvents";
import { createParticipants } from "#/server/db/seed/createParticipants";
import { createRaces } from "#/server/db/seed/createRaces";
import { createRegistrations } from "#/server/db/seed/createRegistrations";
import { createResults } from "#/server/db/seed/createResults";
import { updateResultsRankings } from "#/server/db/seed/updateResultsRankings";

_dayjs.extend(utcPlugin);
_dayjs.extend(timezonePlugin);
_dayjs.extend(isSameOrBeforePlugin);

_faker.seed(17382167);
export const faker = _faker;

export const dayjs = _dayjs;

function* chunk<T>(data: readonly T[], size?: number) {
	const MAX_PARAMETERS = 2 ** 16 - 2;
	const parametersPerRecord = data[0] ? Object.keys(data[0]).length : 1;
	const maxSize = Math.floor(MAX_PARAMETERS / parametersPerRecord);

	if (!size || size > maxSize) size = maxSize;

	for (let i = 0; i < data.length; i += size) {
		yield data.slice(i, i + size);
	}
}

async function chunkAndInsert(table: PgTable, data: unknown[]) {
	const chunks = chunk(data);

	for (const chunk of chunks) {
		await db.insert(table).values(chunk);
	}
}

await (async () => {
	console.log("Creating races");
	await chunkAndInsert(race, createRaces(50));

	const raceData = await db.query.race.findMany();
	console.log("Created races");

	console.log("Creating events");
	await chunkAndInsert(event, createEvents(raceData));

	const eventData = await db.query.event.findMany();
	console.log("Created events");

	const PARTICIPANTS_MIN = 400;
	const PARTICIPANTS_MAX = 1000;

	console.log("Creating participants");
	const participantsToCreate =
		faker.number.int({ min: PARTICIPANTS_MIN, max: PARTICIPANTS_MAX }) *
		eventData.length;
	await chunkAndInsert(participant, createParticipants(participantsToCreate));

	const participantData = await db.query.participant.findMany();
	console.log("Created participants");

	console.log("Creating registrations");
	await chunkAndInsert(
		registration,
		createRegistrations({
			events: eventData,
			participants: participantData,
			amountPerEvent: participantsToCreate / eventData.length,
		}),
	);
	console.log("Created registrations");

	console.log("Creating age groups");
	await chunkAndInsert(ageGroup, createAgeGroups(eventData));
	console.log("Created age groups");

	console.log("Creating results");
	const createResultsData = await db.query.registration.findMany({
		with: {
			event: {
				with: {
					ageGroups: true,
				},
			},
			participant: {
				with: {
					registrations: true,
				},
			},
		},
	});

	await chunkAndInsert(
		result,
		createResults(
			createResultsData.map((res) => ({
				...res,
				registration: res.participant.registrations.find(
					(reg) => reg.eventId === res.eventId,
				),
			})),
		),
	);
	console.log("Created results");

	console.log("Updating results rankings");
	const resultsRankings = updateResultsRankings(
		await db.query.result.findMany({
			with: {
				ageGroup: true,
				participant: true,
			},
		}),
	);

	await db.transaction(async (tx) => {
		for (const data of resultsRankings) {
			const dataToSet: ResultUpdateSchema = {
				ageGroupRank: data.ageGroupRank,
				genderRank: data.genderRank,
				overallRank: data.overallRank,
			};

			await tx.update(result).set(dataToSet).where(eq(result.id, data.id));
		}
	});
	console.log("Updated results rankings");

	console.log("Creating awards");
	await chunkAndInsert(award, createAwards(resultsRankings));
	console.log("Created awards");

	console.log("---DONE---");
	process.exit();
})();
