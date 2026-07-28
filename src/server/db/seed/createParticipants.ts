import type { ParticipantInsertSchema } from "#/server/db/schema";
import { dayjs, faker } from "#/server/db/seed/index";

export function createParticipants(amount: number) {
	const data: ParticipantInsertSchema[] = [];

	for (let i = 0; i < amount; i++) {
		const firstName = faker.person.firstName();
		const lastName = faker.person.lastName();

		data.push({
			dateOfBirth: dayjs(
				faker.date.past({ years: { min: 8, max: 80 } }),
			).format("YYYY-MM-DD"),
			email: faker.internet.email({ firstName, lastName }),
			firstName,
			lastName,
			gender: Math.random() < 0.65 ? "Male" : "Female",
			city: faker.location.city(),
			state: faker.location.state({ abbreviated: true }).toUpperCase(),
		});
	}

	return data;
}
