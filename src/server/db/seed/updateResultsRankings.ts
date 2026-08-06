import type {
	AgeGroupSelectSchema,
	ParticipantSelectSchema,
	ResultSelectSchema,
} from "#/server/db/schema";

type ResultWithGroupParticipant = {
	ageGroup: AgeGroupSelectSchema;
	participant: ParticipantSelectSchema;
} & ResultSelectSchema;

type NumericOrNullKeys<T> = {
	[K in keyof T]: T[K] extends number | null ? K : never;
}[keyof T];

function assignRank(
	rankKey: NumericOrNullKeys<ResultWithGroupParticipant>,
	timeKey: NumericOrNullKeys<ResultWithGroupParticipant>,
	arr: ResultWithGroupParticipant[],
) {
	for (let i = 0; i < arr.length; i++) {
		const result = arr[i];
		const prevResult = arr[i - 1];

		if (!result) {
			throw new Error(`Unable to assign a ranking to a result`);
		}

		const isSameTime = result[timeKey] === prevResult?.[timeKey];

		if (isSameTime) {
			result[rankKey] = prevResult[rankKey] as number;
			arr[i] = result;
			continue;
		}

		// We need to ensure the `rank` doesn't skip numbers so we'll increment from the previous result if available
		const prevRank = prevResult?.[rankKey] ?? i;
		result[rankKey] = prevRank + 1;
		arr[i] = result;
	}

	return arr;
}

function assignAgeGroupRank(arr: ResultWithGroupParticipant[]) {
	const splitIntoAgeGroups: Record<string, ResultWithGroupParticipant[]> = {};

	for (const result of arr) {
		const uniqueId = `${result.raceId}-${result.eventId}-${result.ageGroupId}`;
		const ageGroup = splitIntoAgeGroups[uniqueId] ?? [];

		ageGroup.push(result);
		splitIntoAgeGroups[uniqueId] = ageGroup;
	}

	for (const [key, value] of Object.entries(splitIntoAgeGroups)) {
		const sortedByChipTime = value.sort((a, b) => a.chipTime - b.chipTime);

		splitIntoAgeGroups[key] = assignRank(
			"ageGroupRank",
			"chipTime",
			sortedByChipTime,
		);
	}

	return Object.values(splitIntoAgeGroups).flat();
}

export function updateResultsRankings(results: ResultWithGroupParticipant[]) {
	const eventGroups: Record<string, ResultWithGroupParticipant[]> = {};

	for (const result of results) {
		const uniqueId = `${result.raceId}-${result.eventId}`;
		const group = eventGroups[uniqueId] ?? [];

		group.push(result);
		eventGroups[uniqueId] = group;
	}

	for (const [key, group] of Object.entries(eventGroups)) {
		const sortedByChipTime = group.sort((a, b) => a.chipTime - b.chipTime);

		const overallRanking = assignRank(
			"overallRank",
			"chipTime",
			sortedByChipTime,
		);

		const maleRanking = assignRank(
			"genderRank",
			"chipTime",
			overallRanking.filter((v) => v.participant.gender === "Male"),
		);
		const femaleRanking = assignRank(
			"genderRank",
			"chipTime",
			overallRanking.filter((v) => v.participant.gender === "Female"),
		);

		const maleAgeRanking = assignAgeGroupRank(maleRanking);
		const femaleAgeRanking = assignAgeGroupRank(femaleRanking);

		eventGroups[key] = maleAgeRanking.concat(femaleAgeRanking);
	}

	return Object.values(eventGroups).flat();
}
