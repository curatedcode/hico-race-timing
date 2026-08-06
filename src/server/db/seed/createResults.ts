import type {
	AgeGroupSelectSchema,
	EventSelectSchema,
	ParticipantSelectSchema,
	RegistrationSelectSchema,
	ResultInsertSchema,
} from "#/server/db/schema";
import { dayjs, faker } from "#/server/db/seed/index";

const ageGroupPaces = [
	{ age: { min: 0, max: 14 }, pace: { min: 240, max: 480 } },
	{ age: { min: 15, max: 19 }, pace: { min: 210, max: 450 } },
	{ age: { min: 20, max: 24 }, pace: { min: 200, max: 480 } },
	{ age: { min: 25, max: 29 }, pace: { min: 200, max: 480 } },
	{ age: { min: 30, max: 34 }, pace: { min: 210, max: 510 } },
	{ age: { min: 35, max: 39 }, pace: { min: 210, max: 510 } },
	{ age: { min: 40, max: 44 }, pace: { min: 220, max: 540 } },
	{ age: { min: 45, max: 49 }, pace: { min: 220, max: 540 } },
	{ age: { min: 50, max: 54 }, pace: { min: 240, max: 570 } },
	{ age: { min: 55, max: 59 }, pace: { min: 240, max: 570 } },
	{ age: { min: 60, max: 64 }, pace: { min: 280, max: 630 } },
	{ age: { min: 65, max: 69 }, pace: { min: 280, max: 630 } },
	{ age: { min: 70, max: 74 }, pace: { min: 330, max: 720 } },
	{ age: { min: 75, max: 999 }, pace: { min: 330, max: 720 } },
];

type CreateResultsParam = ({
	event: {
		ageGroups: AgeGroupSelectSchema[];
	} & EventSelectSchema;
	participant: ParticipantSelectSchema;
	registration?: RegistrationSelectSchema;
} & RegistrationSelectSchema)[];

export function createResults(registrations: CreateResultsParam) {
	const data: ResultInsertSchema[] = [];

	// some registrants may not finish the race
	const DNF_RATE = 0.05;

	for (const _data of registrations) {
		if (!_data.registration) {
			throw new Error(
				`Unable to find registration for participant (${_data.participantId}) on event (${_data.eventId})`,
			);
		}

		if (dayjs(_data.event.startDate).isAfter(undefined, "date")) continue;

		const { participant, event, registration } = _data;

		const isDNF = Math.random() < DNF_RATE;
		if (isDNF) continue;

		const age = dayjs().diff(participant.dateOfBirth, "years");
		const ageGroupMatch = event.ageGroups.find(
			(d) => age >= d.minAge && age <= d.maxAge,
		);
		const ageGroupPace = ageGroupPaces.find(
			(d) => age >= d.age.min && age <= d.age.max,
		);

		if (!ageGroupMatch) {
			continue;
		}
		if (!ageGroupPace) {
			throw new Error(
				`Unable to find age group pace match for participant (${participant.id}) event (${event.id})`,
			);
		}

		const randomPace = faker.number.int(ageGroupPace.pace);
		// add a random second advance since gun time is usually slightly ahead
		const randomGunAdvance = faker.number.int({ min: 10, max: 120 });
		const randomChipAdvance = faker.number.int({
			min: 0,
			max: randomGunAdvance,
		});
		const chipTime =
			Number.parseInt(
				`${Number.parseFloat(event.distanceKm) * randomPace}`,
				10,
			) + randomChipAdvance;

		data.push({
			ageGroupId: ageGroupMatch.id,
			chipTime,
			gunTime: chipTime + randomGunAdvance,
			eventId: event.id,
			participantId: participant.id,
			raceId: event.raceId,
			ageOnDay: age,
			bib: registration.bib,
		});
	}

	return data;
}
