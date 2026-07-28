import { useQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import dayjs from "dayjs";
import { ParticipantsTable } from "#/components/participants-table";
import { SectionBadge } from "#/components/section-badge";
import { useTRPC } from "#/trpc/react";

export const Route = createFileRoute("/events/$slug")({
	component: RouteComponent,
	loader: async ({ params, context: { trpc, queryClient } }) => {
		return await queryClient.ensureQueryData(
			trpc.event.result.queryOptions({ slug: params.slug }),
		);
	},
	head: ({ loaderData, params }) => {
		const year = dayjs(loaderData?.finalizedDate).year();

		return {
			meta: [
				{
					title: `${loaderData?.name} Results (${year}) | HiCo Race Timing`,
				},
				{
					name: "description",
					content: `Official results for the ${year} ${loaderData?.name} in ${loaderData?.city}, ${loaderData?.state}, timed by HiCo Race Timing. View finish times and placements.`,
				},
				{
					property: "og:title",
					content: `${loaderData?.name} Results (${year})`,
				},
				{
					property: "og:description",
					content: `Official results for the ${year} ${loaderData?.name}, timed by HiCo Race Timing.`,
				},
				{
					property: "og:image",
					content:
						"https://hicoracetiming.zackaryf.com/assets/images/social/og-results.png",
				},
				{ property: "og:type", content: "website" },
				{
					property: "og:url",
					content: `https://hicoracetiming.zackaryf.com/events/results/${params.slug}`,
				},
				{ name: "twitter:card", content: "summary_large_image" },
				{
					name: "twitter:title",
					content: `${loaderData?.name} Results (${year})`,
				},
				{
					name: "twitter:description",
					content: `Official results for the ${year} ${loaderData?.name}, timed by HiCo Race Timing.`,
				},
				{
					property: "twitter:url",
					content: `https://hicoracetiming.zackaryf.com/events/results/${params.slug}`,
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
					href: `https://hicoracetiming.zackaryf.com/events/results/${params.slug}`,
				},
			],
		};
	},
});

function RouteComponent() {
	const api = useTRPC();
	const { slug } = Route.useParams();
	const { data } = useQuery(api.event.result.queryOptions({ slug }));

	if (!data) {
		return notFound();
	}

	const sectionBadgeTitle = `${dayjs(data.startDate).format("MMM D, YYYY")} - ${data.city}, ${data.state}`;
	const percentageOfMen = (data.totalMen / data.totalFinishers) * 100;
	const percentageOfWomen = (data.totalWomen / data.totalFinishers) * 100;

	return (
		<main className="pt-12">
			<div className="mx-auto mb-16 max-w-360 px-3 md:flex md:space-x-8">
				<div className="mb-8 space-y-4 md:mb-0 md:border-foreground/15 md:border-r md:pr-8">
					<div className="text-center md:text-start">
						<SectionBadge>{sectionBadgeTitle}</SectionBadge>
						<h1 className="font-bold text-5xl">{data.name}</h1>
					</div>
					<div className="flex justify-center gap-4 text-xs md:justify-start">
						<span className="rounded-md border border-foreground/15 px-2 py-1 uppercase">
							{data.distanceLabel}
						</span>
						<span className="rounded-md border border-foreground/15 px-2 py-1 uppercase">
							{data.distanceMi} MI
						</span>
					</div>
				</div>
				<div className="mx-auto grid max-w-xl auto-cols-57.5 justify-center gap-4 md:mx-0 md:flex md:flex-col md:items-start md:justify-start">
					<div className="grid grid-cols-2 gap-4 md:auto-cols-min md:grid-cols-4">
						<div className="flex h-fit flex-col gap-2 rounded-md border border-foreground/15 bg-secondary px-3 pt-2.5 pb-2 text-center md:text-start">
							<h2 className="text-foreground/60 text-xs tracking-wider">
								TOTAL
								<br />
								FINISHERS
							</h2>
							<span>{data.totalFinishers}</span>
						</div>
						<div className="flex h-fit flex-col gap-2 rounded-md border border-foreground/15 bg-secondary px-3 pt-2.5 pb-2 text-center md:text-start">
							<h2 className="text-foreground/60 text-xs tracking-wider">
								WINNING
								<br />
								TIME
							</h2>
							<span>{data.winningTime}</span>
						</div>
						<div className="flex h-fit flex-col gap-2 rounded-md border border-foreground/15 bg-secondary px-3 pt-2.5 pb-2 text-center md:text-start">
							<h2 className="text-foreground/60 text-xs tracking-wider">
								AVERAGE
								<br />
								TIME
							</h2>
							<span>{data.averageTime}</span>
						</div>
						<div className="flex h-fit flex-col gap-2 rounded-md border border-foreground/15 bg-secondary px-3 pt-2.5 pb-2 text-center md:text-start">
							<h2 className="text-foreground/60 text-xs tracking-wider">
								TOTAL
								<br />
								DNF
							</h2>
							<span>{data.totalDNF}</span>
						</div>
					</div>
					<div className="flex w-full flex-col rounded-md border border-foreground/15 bg-secondary px-3 pt-2.5 pb-2">
						<h2 className="mb-2 text-center text-foreground/60 text-xs tracking-wider md:text-start">
							GENDER SPLIT
						</h2>
						<div className="flex items-center gap-4">
							<div className="flex min-w-24 justify-between">
								<span>Men</span>
								<span>{data.totalMen}</span>
							</div>
							<div className="w-full rounded-xs border border-foreground/15">
								<div
									className="h-2 rounded-xs"
									style={{
										background: `linear-gradient(to right, var(--primary) ${percentageOfMen}%, var(--background) ${percentageOfMen}%)`,
									}}
								/>
							</div>
						</div>
						<div className="flex items-center gap-4">
							<div className="flex min-w-24 justify-between">
								<span>Women</span>
								<span>{data.totalWomen}</span>
							</div>
							<div className="w-full rounded-xs border border-foreground/15">
								<div
									className="h-2 rounded-xs"
									style={{
										background: `linear-gradient(to right, var(--primary) ${percentageOfWomen}%, var(--background) ${percentageOfWomen}%)`,
									}}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="bg-secondary pb-24">
				<ParticipantsTable data={data.participants} />
			</div>
		</main>
	);
}
