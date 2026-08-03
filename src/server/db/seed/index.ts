import { performance } from "node:perf_hooks";
import { faker as _faker } from "@faker-js/faker";
import _dayjs from "dayjs";
import isSameOrBeforePlugin from "dayjs/plugin/isSameOrBefore";
import timezonePlugin from "dayjs/plugin/timezone";
import utcPlugin from "dayjs/plugin/utc";
import { sql } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import { db } from "#/server/db";
import {
	ageGroup,
	award,
	event,
	participant,
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
	const MAX_ROW_ENTRIES = 1660;
	const parametersPerRecord = data[0] ? Object.keys(data[0]).length : 1;
	const maxSize = Math.floor(MAX_ROW_ENTRIES / parametersPerRecord);

	if (!size || size > maxSize) size = maxSize;

	for (let i = 0; i < data.length; i += size) {
		yield data.slice(i, i + size);
	}
}

async function chunkAndInsert<T extends Record<string, unknown>>(
	table: PgTable,
	data: T[],
) {
	return db.transaction(async (tx) => {
		const results: unknown[] = [];

		for (const batch of chunk(data)) {
			const inserted = await tx.insert(table).values(batch).returning();
			results.push(...inserted);
		}

		return results;
	});
}

async function updateResultsRankingsBulk(
	rankings: {
		id: number;
		ageGroupRank: number | null;
		genderRank: number | null;
		overallRank: number | null;
	}[],
) {
	if (rankings.length === 0) return;

	const toPgArray = (arr: (string | number | bigint | null)[]) =>
		`{${arr.join(",")}}`;

	const ids = toPgArray(rankings.map((r) => r.id));
	const ageGroupRanks = toPgArray(rankings.map((r) => r.ageGroupRank));
	const genderRanks = toPgArray(rankings.map((r) => r.genderRank));
	const overallRanks = toPgArray(rankings.map((r) => r.overallRank));

	await db.execute(sql`
		UPDATE ${result} AS r
		SET
			age_group_rank = data.age_group_rank,
			gender_rank = data.gender_rank,
			overall_rank = data.overall_rank
		FROM (
			SELECT *
			FROM unnest(
				${ids}::bigint[],
				${ageGroupRanks}::int[],
				${genderRanks}::int[],
				${overallRanks}::int[]
			) AS t(id, age_group_rank, gender_rank, overall_rank)
		) AS data
		WHERE r.id = data.id
	`);
}

await (async () => {
	const startTimeMS = performance.now();

	console.log("Creating races");
	await chunkAndInsert(race, createRaces(50));

	const raceData = await db.query.race.findMany();
	console.log("Created races");

	console.log("Creating events");
	const eventData = await chunkAndInsert(event, createEvents(raceData));
	console.log("Created events");

	const PARTICIPANTS_MIN = 400;
	const PARTICIPANTS_MAX = 1000;

	console.log("Creating participants");
	const participantsToCreate =
		faker.number.int({ min: PARTICIPANTS_MIN, max: PARTICIPANTS_MAX }) *
		eventData.length;
	const participantData = await chunkAndInsert(
		participant,
		createParticipants(participantsToCreate),
	);
	console.log("Created participants");

	console.log("Creating registrations");
	await chunkAndInsert(
		registration,
		createRegistrations({
			// @ts-expect-error
			events: eventData,
			// @ts-expect-error
			participants: participantData,
			amountPerEvent: participantsToCreate / eventData.length,
		}),
	);
	console.log("Created registrations");

	console.log("Creating age groups");
	// @ts-expect-error
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

	await updateResultsRankingsBulk(resultsRankings);
	console.log("Updated results rankings");

	console.log("Creating awards");
	await chunkAndInsert(award, createAwards(resultsRankings));
	console.log("Created awards");

	const endTimeMS = performance.now();

	console.log(
		`---DONE--- (took ${((endTimeMS - startTimeMS) / 1_000).toFixed(1)} seconds)`,
	);
	process.exit();
})();
