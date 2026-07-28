// import dayjs from "dayjs";
// import type {
// 	AgeGroupSelectSchema,
// 	ParticipantSelectSchema,
// 	ResultSelectSchema,
// } from "#/server/db/schema";
import { generateEventNames } from "#/server/db/seed/generateEventNames";

// import { updateResultsRankings } from "#/server/db/seed/updateResultsRankings";

// type ResultWithGroupParticipant = {
// 	ageGroup: AgeGroupSelectSchema;
// 	participant: ParticipantSelectSchema;
// } & ResultSelectSchema;

// const fakeData: ResultWithGroupParticipant[] = [
// 	{
// 		ageGroup: {
// 			id: 1,
// 			eventId: 1,
// 			gender: "Male",
// 			label: "test_1",
// 			maxAge: 14,
// 			minAge: 8,
// 			createdAt: new Date(),
// 			updatedAt: new Date(),
// 			deletedAt: null,
// 		},
// 		ageGroupId: 1,
// 		ageGroupRank: null,
// 		ageOnDay: 13,
// 		bib: 1,
// 		chipTime: 35300,
// 		gunTime: 35332,
// 		eventId: 1,
// 		participant: {
// 			id: 1,
// 			city: null,
// 			state: null,
// 			dateOfBirth: dayjs().subtract(13, "years").format("YYYY-MM-DD"),
// 			email: "",
// 			firstName: "name_1",
// 			lastName: "name_1",
// 			gender: "Male",
// 			createdAt: new Date(),
// 			updatedAt: new Date(),
// 			deletedAt: null,
// 		},
// 		participantId: 1,
// 		raceId: 1,
// 		id: 1,
// 		genderRank: null,
// 		overallRank: null,
// 		createdAt: new Date(),
// 		updatedAt: new Date(),
// 		deletedAt: null,
// 	},
// 	{
// 		ageGroup: {
// 			id: 1,
// 			eventId: 1,
// 			gender: "Male",
// 			label: "test_1",
// 			maxAge: 14,
// 			minAge: 8,
// 			createdAt: new Date(),
// 			updatedAt: new Date(),
// 			deletedAt: null,
// 		},
// 		ageGroupId: 1,
// 		ageGroupRank: null,
// 		ageOnDay: 13,
// 		bib: 1,
// 		chipTime: 48600,
// 		gunTime: 48672,
// 		eventId: 1,
// 		participant: {
// 			id: 2,
// 			city: null,
// 			state: null,
// 			dateOfBirth: dayjs().subtract(13, "years").format("YYYY-MM-DD"),
// 			email: "",
// 			firstName: "name_2",
// 			lastName: "name_2",
// 			gender: "Male",
// 			createdAt: new Date(),
// 			updatedAt: new Date(),
// 			deletedAt: null,
// 		},
// 		participantId: 2,
// 		raceId: 1,
// 		id: 2,
// 		genderRank: null,
// 		overallRank: null,
// 		createdAt: new Date(),
// 		updatedAt: new Date(),
// 		deletedAt: null,
// 	},
// ];

// updateResultsRankings(fakeData);
console.log(generateEventNames(40).join("\n"));
