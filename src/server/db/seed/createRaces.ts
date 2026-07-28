import { nanoid } from "nanoid";
import { slugify } from "#/lib/utils";
import type { RaceInsertSchema } from "#/server/db/schema";
import { generateEventNames } from "#/server/db/seed/generateEventNames";
import { dayjs, faker } from "#/server/db/seed/index";

export function createRaces(amount: number) {
	const data: RaceInsertSchema[] = [];
	const raceNames = generateEventNames(amount);

	for (let i = 0; i < amount; i++) {
		const shouldIncludeStartDate = faker.datatype.boolean(0.75);
		let startDate: string | null = null;

		if (shouldIncludeStartDate) {
			startDate = dayjs(
				faker.date.between({
					from: dayjs().subtract(2, "year").toDate(),
					to: dayjs().add(3, "month").toDate(),
				}),
			).toISOString();
		}

		const name = raceNames[i];
		if (!name) {
			throw new Error(`No name in generated event names for index (${i})`);
		}

		data.push({
			city: faker.location.city(),
			description: faker.lorem.paragraph({ min: 3, max: 12 }),
			imageUrl: `/assets/images/races/mountains-${faker.number.int({ min: 1, max: 3 })}.webp`,
			name,
			organizer: faker.company.name(),
			slug: `${slugify(name)}-${nanoid(6)}`,
			state: faker.location.state({ abbreviated: true }).toUpperCase(),
			status: "Scheduled",
			timingCompany: faker.company.name(),
			website: `https://${faker.internet.domainName()}`,
			startDate,
		});
	}

	return data;
}
