import { betterAuth } from "better-auth";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { env } from "#/lib/env";

export const auth = betterAuth({
	emailAndPassword: {
		enabled: true,
	},
	plugins: [tanstackStartCookies()],
	baseURL: env.BETTER_AUTH_URL,
	secret: env.BETTER_AUTH_SECRET,
});
