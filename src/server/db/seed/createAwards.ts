import { ordinalSuffix } from "#/lib/utils";
import type {
	AgeGroupSelectSchema,
	AwardInsertSchema,
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

export function createAwards(results: ResultWithGroupParticipant[]) {
	const data: AwardInsertSchema[] = [];

	function createAward({
		rankKey,
		awardKey,
		result,
		title,
	}: {
		rankKey: NumericOrNullKeys<ResultSelectSchema>;
		result: ResultWithGroupParticipant;
		title: string;
		awardKey: "eventId" | "raceId";
	}) {
		const place = result[rankKey];
		if (!place || place > 3) return;

		const award: AwardInsertSchema = {
			participantId: result.participantId,
			title,
		};
		award[awardKey] = result[awardKey];
		data.push(award);
	}

	for (const result of results) {
		createAward({
			rankKey: "ageGroupRank",
			result,
			title: `${result.participant.gender} ${result.ageGroup.label} - ${ordinalSuffix(result.ageGroupRank ?? 1)}`,
			awardKey: "eventId",
		});
		// createAward({
		// 	rankKey: "overallRank",
		// 	result,
		// 	title: `Overall - ${ordinalSuffix(result.ageGroupRank ?? 1)}`,
		// 	awardKey: "eventId",
		// });
		// createAward({
		// 	rankKey: "genderRank",
		// 	result,
		// 	title: `Overall Male - ${ordinalSuffix(result.ageGroupRank ?? 1)}`,
		// 	awardKey: "eventId",
		// });
	}

	return data;
}
