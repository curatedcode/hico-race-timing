import { TRPCError } from "@trpc/server";
import dayjs from "dayjs";
import { and, asc, gte, isNotNull } from "drizzle-orm";
import z from "zod";
import { createTRPCRouter, publicProcedure } from "#/server/api/trpc";
import { race } from "#/server/db/schema";

export const raceRouter = createTRPCRouter({
	getOne: publicProcedure
		.input(z.object({ slug: z.string() }))
		.query(async ({ input, ctx }) => {
			const data = await ctx.db.query.race.findFirst({
				where: (race, { eq }) => eq(race.slug, input.slug),
				with: {
					events: true,
				},
			});

			if (!data) {
				throw new TRPCError({
					message: `Race "${input.slug}" not found.`,
					code: "NOT_FOUND",
				});
			}

			return data;
		}),
	upcoming: publicProcedure
		.input(z.object({ limit: z.number().min(1) }).default({ limit: 4 }))
		.query(async ({ input, ctx }) => {
			const today = dayjs().format("YYYY-MM-DD");

			const data = await ctx.db
				.select({
					slug: race.slug,
					name: race.name,
					startDate: race.startDate,
					city: race.city,
					state: race.state,
					website: race.website,
					organizer: race.organizer,
				})
				.from(race)
				.where(and(isNotNull(race.startDate), gte(race.startDate, today)))
				.orderBy(asc(race.startDate))
				.limit(input.limit);

			return data;
		}),
});
