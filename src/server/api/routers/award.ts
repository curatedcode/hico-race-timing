import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import z from "zod";
import { createTRPCRouter, publicProcedure } from "#/server/api/trpc";
import { award, awardSelectSchema } from "#/server/db/schema/award";

export const awardRouter = createTRPCRouter({
	getOne: publicProcedure
		.input(z.object({ id: awardSelectSchema.shape.id }))
		.query(async ({ input, ctx }) => {
			const data = await ctx.db
				.select()
				.from(award)
				.where(eq(award.id, input.id));

			if (data.length > 1) {
				console.warn(
					`Duplicate award records detected for ID "${input.id}" (${data.length} found). Returning the first result.`,
				);
			}

			const dataToReturn = data[0];

			if (!dataToReturn) {
				throw new TRPCError({
					message: `Award "${input.id}" not found.`,
					code: "NOT_FOUND",
				});
			}

			return dataToReturn;
		}),
});
