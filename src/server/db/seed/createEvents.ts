import { nanoid } from "nanoid";
import { slugify } from "#/lib/utils";
import type { EventInsertSchema, RaceSelectSchema } from "#/server/db/schema";
import { generateEventNames } from "#/server/db/seed/generateEventNames";
import { dayjs, faker } from "#/server/db/seed/index";

export const predefinedEvents = [
	{ label: "Fun Run", km: "2.3", ageGroup: "5-year" },
	{ label: "1 Mile", km: "1.6", ageGroup: "5-year" },
	{ label: "3K", km: "3", ageGroup: "youth" },
	{ label: "5K", km: "5", ageGroup: "5-year" },
	{ label: "10K", km: "10", ageGroup: "5-year" },
	{ label: "15K", km: "15", ageGroup: "5-year" },
	{ label: "10 Mile", km: "16.1", ageGroup: "5-year" },
	{ label: "Half Marathon", km: "21.0975", ageGroup: "5-year" },
	{ label: "Marathon", km: "42.195", ageGroup: "5-year" },
	{ label: "Ultra Marathon", km: "100", ageGroup: "10-year" },
	{ label: "SkyRace", km: "25", ageGroup: "youth-to-veteran" },
	{ label: "SkyMarathon", km: "42.195", ageGroup: "youth-to-veteran" },
] as const;

export function createEvents(races: RaceSelectSchema[]) {
	const data: EventInsertSchema[] = [];
	const eventNames = generateEventNames(races.length);

	for (const [i, race] of races.entries()) {
		const alreadyUsedDistances = new Set<(typeof predefinedEvents)[number]>();

		const getEventType = () => {
			const random = faker.helpers.arrayElement(predefinedEvents);

			if (alreadyUsedDistances.has(random)) {
				return getEventType();
			}

			alreadyUsedDistances.add(random);
			return random;
		};

		const eventType = getEventType();

		const name = eventNames[i];
		if (!name) {
			throw new Error(`No name in generated event names for index (${i})`);
		}

		const startDateTime = faker.date.between({
			from: dayjs().set("hour", 7).toDate(),
			to: dayjs().set("hour", 18).toDate(),
		});
		const startTimezone = faker.date.timeZone();
		const startTimeLocal = dayjs(startDateTime).format("YYYY-MM-DDTHH:mm:ss");
		const startTimeUtc = dayjs.tz(startTimeLocal, startTimezone).toDate();

		const finalizedTimeLocal = dayjs(startTimeLocal)
			.add(faker.number.int({ min: 1, max: 3 }), "hour")
			.format("YYYY-MM-DDTHH:mm:ss");
		const finalizedTimeUtc = dayjs
			.tz(finalizedTimeLocal, startTimezone)
			.toDate();

		const includeFinalizedDate =
			race.startDate !== null &&
			dayjs(race.startDate).isSameOrBefore(undefined, "date");

		data.push({
			distanceKm: eventType.km,
			distanceLabel: eventType.label,
			name,
			raceId: race.id,
			slug: `${slugify(name)}-${nanoid(6)}`,
			startDate: race.startDate,
			startTimeUtc: race.startDate ? startTimeUtc : null,
			startTimeLocal: race.startDate ? startTimeLocal : null,
			startTimezone: race.startDate ? startTimezone : null,
			finalizedDate: includeFinalizedDate ? race.startDate : null,
			finalizedTimeUtc: includeFinalizedDate ? finalizedTimeUtc : null,
			finalizedTimeLocal: includeFinalizedDate ? finalizedTimeLocal : null,
			finalizedTimezone: includeFinalizedDate ? startTimezone : null,
		});
	}

	return data;
}
