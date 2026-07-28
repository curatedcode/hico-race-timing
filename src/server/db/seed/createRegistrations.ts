import {
	type EventSelectSchema,
	type ParticipantSelectSchema,
	type RegistrationInsertSchema,
	registrationInsertSchema,
} from "#/server/db/schema";
import { faker } from "#/server/db/seed/index";

export function createRegistrations({
	events,
	participants,
	amountPerEvent,
}: {
	events: EventSelectSchema[];
	participants: ParticipantSelectSchema[];
	amountPerEvent: number;
}) {
	const data: RegistrationInsertSchema[] = [];

	const getRandomParticipant = (usedIds: Set<number>) => {
		const random = faker.helpers.arrayElement(participants);

		if (usedIds.has(random.id)) {
			return getRandomParticipant(usedIds);
		}
		return random;
	};

	for (const event of events) {
		const participantsUsed = new Set<number>();

		for (let i = 0; i < amountPerEvent; i++) {
			const randomParticipant = getRandomParticipant(participantsUsed);
			participantsUsed.add(randomParticipant.id);

			data.push({
				bib: i,
				eventId: event.id,
				participantId: randomParticipant.id,
				shirtSize: faker.helpers.arrayElement(
					registrationInsertSchema.shape.shirtSize.options,
				),
			});
		}
	}

	return data;
}
