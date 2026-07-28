import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	createTRPCClient,
	httpBatchStreamLink,
	loggerLink,
} from "@trpc/client";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import {
	createTRPCContext,
	createTRPCOptionsProxy,
} from "@trpc/tanstack-react-query";
import SuperJSON from "superjson";
import type { AppRouter } from "#/server/api/root";
import { createQueryClient } from "./query-client";

let clientQueryClientSingleton: QueryClient | undefined;
const getQueryClient = () => {
	if (typeof window === "undefined") {
		// Server: always make a new query client
		return createQueryClient();
	}
	// Browser: use singleton pattern to keep the same query client
	clientQueryClientSingleton ??= createQueryClient();

	return clientQueryClientSingleton;
};

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

export function getContext() {
	const queryClient = getQueryClient();

	const serverHelpers = createTRPCOptionsProxy({
		client: trpcClient,
		queryClient,
	});

	return {
		queryClient,
		trpc: serverHelpers,
	};
}

export const trpcClient = createTRPCClient<AppRouter>({
	links: [
		loggerLink({
			enabled: (op) =>
				process.env.NODE_ENV === "development" ||
				(op.direction === "down" && op.result instanceof Error),
		}),
		httpBatchStreamLink({
			transformer: SuperJSON,
			url: `${getBaseUrl()}/api/trpc`,
			headers: () => {
				const headers = new Headers();
				headers.set("x-trpc-source", "tanstack-start-react");
				return headers;
			},
		}),
	],
});

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export function TRPCReactProvider({
	children,
	context,
}: {
	children: React.ReactNode;
	context: ReturnType<typeof getContext>;
}) {
	const { queryClient } = context;

	return (
		<QueryClientProvider client={queryClient}>
			<TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
				{children}
			</TRPCProvider>
		</QueryClientProvider>
	);
}

function getBaseUrl() {
	if (typeof window !== "undefined") return window.location.origin;
	return `http://localhost:${process.env.PORT ?? 3000}`;
}
