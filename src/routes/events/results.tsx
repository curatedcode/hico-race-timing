import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { EventsTable } from "#/components/events-table";
import { SectionBadge } from "#/components/section-badge";
import { useTRPC } from "#/trpc/react";

export const Route = createFileRoute("/events/results")({
	component: RouteComponent,
	loader: async ({ context: { trpc, queryClient } }) => {
		await queryClient.ensureQueryData(trpc.event.table.queryOptions());
	},
	head: () => ({
		meta: [
			{
				title: "Results | HiCo Race Timing",
			},
			{
				name: "description",
				content:
					"Browse results from every race timed by HiCo. Find your finish time and placement from past events - search by race name or date.",
			},
			{ property: "og:title", content: "Race Results | HiCo Race Timing" },
			{
				property: "og:description",
				content:
					"Browse results from every race timed by HiCo. Find your finish time and placement.",
			},
			{
				property: "og:image",
				content:
					"https://hicoracetiming.zackaryf.com/assets/images/social/og-results.png",
			},
			{ property: "og:type", content: "website" },
			{
				property: "og:url",
				content: "https://hicoracetiming.zackaryf.com/events/results",
			},
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:title", content: "Race Results | HiCo Race Timing" },
			{
				name: "twitter:description",
				content: "Browse results from every race timed by HiCo.",
			},
			{
				property: "twitter:url",
				content: "https://hicoracetiming.zackaryf.com/events/results",
			},
			{
				name: "twitter:image",
				content:
					"https://hicoracetiming.zackaryf.com/assets/images/social/og-results.png",
			},
		],
		links: [
			{
				rel: "canonical",
				href: "https://hicoracetiming.zackaryf.com/events/results",
			},
		],
	}),
});

function RouteComponent() {
	const api = useTRPC();
	const tableQuery = useQuery(api.event.table.queryOptions());

	return (
		<main className="pt-12">
			<div className="mx-auto mb-16 max-w-360 px-3 text-center md:text-start">
				<SectionBadge>OFFICIAL ARCHIVE</SectionBadge>
				<h1 className="mb-4 font-bold text-4xl md:text-5xl">Race results</h1>
				<p className="mx-auto max-w-sm text-foreground/60 md:mx-0 md:max-w-md">
					Looking for your results? Browse every race we've timed, with official
					results available for each event.
				</p>
			</div>
			<div className="bg-secondary pb-24">
				<EventsTable data={tableQuery.data} />
			</div>
		</main>
	);
}
