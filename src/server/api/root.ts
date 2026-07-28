import { awardRouter } from "#/server/api/routers/award";
import { eventRouter } from "#/server/api/routers/event";
import { raceRouter } from "#/server/api/routers/race";
import { createCallerFactory, createTRPCRouter } from "#/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	award: awardRouter,
	event: eventRouter,
	race: raceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *    // ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
