import { TRPCError } from "@trpc/server";
import { and, isNotNull } from "drizzle-orm";
import z from "zod";
import type { EventsTableColumns } from "#/components/events-table";
import type { ParticipantsTableColumns } from "#/components/participants-table";
import {
	KM_PER_MILE,
	paceFromTimeAndDistance,
	secondsToTimestamp,
} from "#/lib/utils";
import { createTRPCRouter, publicProcedure } from "#/server/api/trpc";
import { event, eventSelectSchema } from "#/server/db/schema";

export const eventRouter = createTRPCRouter({
	result: publicProcedure
		.input(z.object({ slug: eventSelectSchema.shape.slug }))
		.query(async ({ input, ctx }) => {
			const data = await ctx.db.query.event.findFirst({
				columns: {
					id: true,
					name: true,
					startDate: true,
					finalizedDate: true,
					distanceKm: true,
					distanceLabel: true,
				},
				with: {
					race: {
						columns: {
							city: true,
							state: true,
						},
					},
					ageGroups: {
						columns: {
							id: true,
							label: true,
						},
					},
					results: {
						columns: {
							chipTime: true,
							overallRank: true,
							ageGroupRank: true,
							bib: true,
							ageOnDay: true,
							pace: true,
							gunTime: true,
						},
						with: {
							participant: {
								columns: {
									firstName: true,
									lastName: true,
									gender: true,
								},
							},
							ageGroup: {
								columns: {
									id: true,
									label: true,
								},
							},
						},
					},
					registrations: {
						columns: {
							id: true,
						},
					},
				},
				where: (event, { eq }) => eq(event.slug, input.slug),
			});

			if (!data) {
				throw new TRPCError({
					message: `Event "${input.slug}" not found.`,
					code: "NOT_FOUND",
				});
			}

			const participants: ParticipantsTableColumns[] = data.results.map((v) => {
				const pace = paceFromTimeAndDistance(v.chipTime, data.distanceKm);

				return {
					overallRank: v.overallRank,
					bib: v.bib,
					name: `${v.participant.firstName} ${v.participant.lastName}`,
					age: v.ageOnDay,
					gender: v.participant.gender,
					ageGroupLabel: v.ageGroup.label,
					ageGroupRank: v.ageGroupRank,
					chipTime: secondsToTimestamp(v.chipTime),
					gunTime: secondsToTimestamp(v.gunTime),
					pacePerKm: secondsToTimestamp(pace.pacePerKm, undefined, false),
					pacePerMile: secondsToTimestamp(pace.pacePerMile, undefined, false),
					isDNF: v.chipTime === 0,
				};
			});

			return {
				name: data.name,
				startDate: data.startDate,
				finalizedDate: data.finalizedDate,
				city: data.race.city,
				state: data.race.state,
				distanceKm: Number.parseFloat(data.distanceKm).toString(),
				distanceMi: (Number.parseFloat(data.distanceKm) / KM_PER_MILE).toFixed(
					1,
				),
				distanceLabel: data.distanceLabel,
				participants,
				results: data.results,
				winningTime: secondsToTimestamp(
					data.results.find((v) => v.overallRank === 1)?.chipTime ?? 0,
				),
				averageTime: secondsToTimestamp(
					data.results
						.map((v) => v.chipTime)
						.reduce((curr, acc) => curr + acc, 0) / data.results.length,
				),
				totalFinishers: data.results.length,
				totalDNF: data.registrations.length - data.results.length,
				totalMen: data.results.filter((v) => v.participant.gender === "Male")
					.length,
				totalWomen: data.results.filter(
					(v) => v.participant.gender === "Female",
				).length,
			};
		}),

	table: publicProcedure.query(
		async ({ ctx }): Promise<EventsTableColumns[]> => {
			const data = (await ctx.db.query.event.findMany({
				columns: {
					name: true,
					finalizedDate: true,
					distanceKm: true,
					slug: true,
				},
				with: {
					race: {
						columns: {
							city: true,
							state: true,
							organizer: true,
						},
					},
				},
				where: and(
					isNotNull(event.finalizedDate),
					isNotNull(event.finalizedTimeUtc),
					isNotNull(event.finalizedTimeLocal),
					isNotNull(event.finalizedTimezone),
				),
			})) as {
				// finalizedDate is not null from above `where` clause
				name: string;
				finalizedDate: string;
				distanceKm: string;
				slug: string;
				race: { slug: string; city: string; state: string; organizer: string };
			}[];

			return data.map((v) => ({
				slug: v.slug,
				name: v.name,
				finalizedDate: v.finalizedDate,
				distanceKm: v.distanceKm,
				location: `${v.race.city}, ${v.race.state}`,
				organizer: v.race.organizer,
			}));
		},
	),
});
