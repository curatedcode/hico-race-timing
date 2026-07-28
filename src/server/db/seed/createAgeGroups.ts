import type {
	AgeGroupInsertSchema,
	EventSelectSchema,
} from "#/server/db/schema";
import { predefinedEvents } from "#/server/db/seed/createEvents";

const ageGroupsDefined: Record<
	(typeof predefinedEvents)[number]["ageGroup"],
	{ min: number; max: number; label: string }[]
> = {
	"5-year": [
		{ min: 0, max: 14, label: "14 & Under" },
		{ min: 15, max: 19, label: "15-19" },
		{ min: 20, max: 24, label: "20-24" },
		{ min: 25, max: 29, label: "25-29" },
		{ min: 30, max: 34, label: "30-34" },
		{ min: 35, max: 39, label: "35-39" },
		{ min: 40, max: 44, label: "40-44" },
		{ min: 45, max: 49, label: "45-49" },
		{ min: 50, max: 54, label: "50-54" },
		{ min: 55, max: 59, label: "55-59" },
		{ min: 60, max: 64, label: "60-64" },
		{ min: 65, max: 69, label: "65-69" },
		{ min: 70, max: 74, label: "70-74" },
		{ min: 75, max: 999, label: "75+" },
	],
	"10-year": [
		{ min: 18, max: 29, label: "18-29" },
		{ min: 30, max: 39, label: "30-39" },
		{ min: 40, max: 49, label: "40-49" },
		{ min: 50, max: 59, label: "50-59" },
		{ min: 60, max: 69, label: "60-69" },
		{ min: 70, max: 79, label: "70-79" },
		{ min: 80, max: 999, label: "80+" },
	],
	"youth-to-veteran": [
		{ min: 0, max: 18, label: "Youth" },
		{ min: 19, max: 22, label: "U23" },
		{ min: 23, max: 39, label: "Senior" },
		{ min: 40, max: 44, label: "V40" },
		{ min: 45, max: 49, label: "V45" },
		{ min: 50, max: 54, label: "V50" },
		{ min: 55, max: 59, label: "V55" },
		{ min: 60, max: 64, label: "V60" },
		{ min: 65, max: 69, label: "V65" },
		{ min: 70, max: 74, label: "V70+" },
	],
	youth: [{ min: 0, max: 18, label: "Youth" }],
};

export function createAgeGroups(events: EventSelectSchema[]) {
	const data: AgeGroupInsertSchema[] = [];

	for (const event of events) {
		// event label will always be `predefinedEvents` label since we seeded from a defined set.
		const match = predefinedEvents.find((v) => v.label === event.distanceLabel);

		if (!match) {
			throw new Error(
				`Failed to find a match between "event.label" and "predefinedEvents.label". Event ID (${event.id})`,
			);
		}

		for (const group of ageGroupsDefined[match.ageGroup]) {
			if (event.distanceLabel === "Fun Run") {
				data.push({
					eventId: event.id,
					label: group.label,
					maxAge: group.max,
					minAge: group.min,
				});
			} else {
				data.push({
					eventId: event.id,
					gender: "Female",
					label: group.label,
					maxAge: group.max,
					minAge: group.min,
				});
				data.push({
					eventId: event.id,
					gender: "Male",
					label: group.label,
					maxAge: group.max,
					minAge: group.min,
				});
			}
		}
	}

	return data;
}
