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
	for (let i = arr.length; i > 0; i--) {
		const result = arr[i - 1];
		const prevResult = arr[i];

		if (!result) {
			throw new Error(`Unable to assign a ranking to a result`);
		}

		if (prevResult && result[timeKey] === prevResult[timeKey]) {
			result[rankKey] = prevResult[rankKey] as number;
			continue;
		}

		result[rankKey] = i;
		arr[i - 1] = result;
	}

	return arr;
}

function assignAgeGroupRank(arr: ResultWithGroupParticipant[]) {
	const splitIntoAgeGroups: Record<number, ResultWithGroupParticipant[]> = {};

	for (const result of arr) {
		const ageGroup = splitIntoAgeGroups[result.ageGroupId];

		if (!ageGroup) {
			splitIntoAgeGroups[result.ageGroupId] = [];
		}

		splitIntoAgeGroups[result.ageGroupId]?.push(result);
	}

	for (const [key, value] of Object.entries(splitIntoAgeGroups)) {
		const sortedByChipTime = value.sort((a, b) => a.chipTime - b.chipTime);

		splitIntoAgeGroups[Number(key)] = assignRank(
			"ageGroupRank",
			"chipTime",
			sortedByChipTime,
		);
	}

	return Object.values(splitIntoAgeGroups).flat();
}

export function updateResultsRankings(results: ResultWithGroupParticipant[]) {
	const eventGroups: Record<number, ResultWithGroupParticipant[]> = {};

	for (const result of results) {
		if (!eventGroups[result.eventId]) {
			eventGroups[result.eventId] = [];
		}

		eventGroups[result.eventId]?.push(result);
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

		eventGroups[Number(key)] = maleAgeRanking.concat(femaleAgeRanking);
	}

	return Object.values(eventGroups).flat();
}
