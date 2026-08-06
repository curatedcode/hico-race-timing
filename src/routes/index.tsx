import { createFileRoute, Link } from "@tanstack/react-router";
import dayjs from "dayjs";
import { MessageForm } from "#/components/message-form";
import { SectionBadge } from "#/components/section-badge";
import { buttonVariants } from "#/components/ui/button";
import { UpcomingRaceCard } from "#/components/upcoming-race-card";

export const Route = createFileRoute("/")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{ title: "HiCo Race Timing" },
			{
				name: "description",
				content:
					"HiCo Race Timing provides professional chip timing, equipment setup, and fast, accurate results for races of any size. Get a quote for your next event.",
			},
			{ property: "og:title", content: "HiCo Race Timing" },
			{
				property: "og:description",
				content:
					"Professional chip timing and fast, accurate results for races of any size. Get a quote for your next event.",
			},
			{
				property: "og:image",
				content:
					"https://hicoracetiming.zackaryf.com/assets/images/social/og-default.png",
			},
			{ property: "og:type", content: "website" },
			{ property: "og:url", content: "https://hicoracetiming.zackaryf.com/" },
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:title", content: "HiCo Race Timing" },
			{
				name: "twitter:description",
				content:
					"Professional chip timing and fast, accurate results for races of any size.",
			},
			{
				property: "twitter:url",
				content: "https://hicoracetiming.zackaryf.com/",
			},
			{
				name: "twitter:image",
				content:
					"https://hicoracetiming.zackaryf.com/assets/images/social/og-default.png",
			},
		],
		links: [
			{
				rel: "canonical",
				href: "https://hicoracetiming.zackaryf.com/",
			},
			{
				rel: "preload",
				as: "image",
				href: "/assets/images/hero.webp",
				fetchPriority: "high",
			},
			{
				rel: "preload",
				as: "image",
				href: "/assets/images/logos/small.webp",
				fetchPriority: "high",
			},
		],
	}),
});

type UpcomingRace = {
	slug: string;
	name: string;
	startDate: string | null;
	city: string;
	state: string;
	website: string;
	organizer: string;
};

const upcomingRaces: UpcomingRace[] = [
	{
		slug: "1",
		name: "Roaring Champions Chase",
		startDate: dayjs().add(2, "weeks").toString(),
		city: "North Marie",
		state: "IA",
		website: "https://example.com",
		organizer: "Yost, Collier & Upton",
	},
	{
		slug: "2",
		name: "Fourth Freedom March",
		startDate: dayjs().add(22, "days").toString(),
		city: "Davenport",
		state: "IL",
		website: "https://example.com",
		organizer: "Weber - Kelshein",
	},
	{
		slug: "3",
		name: "3rd Annual Unity",
		startDate: dayjs().add(3, "months").toString(),
		city: "Gingerland",
		state: "CT",
		website: "https://example.com",
		organizer: "North Baptist Church",
	},
];

function RouteComponent() {
	return (
		<main className="mb-24">
			<p className="mb-3.5 hidden w-full flex-wrap justify-center gap-4 px-4 text-xs tracking-wide md:flex">
				<span className="">SERVING</span>
				<span className="relative pl-5 before:absolute before:top-1/2 before:left-0 before:size-1.25 before:-translate-y-1/2 before:rounded-full before:bg-primary">
					HIGHLANDS COUNTY
				</span>
				<span className="relative pl-5 before:absolute before:top-1/2 before:left-0 before:size-1.25 before:-translate-y-1/2 before:rounded-full before:bg-primary">
					HARDEE COUNTY
				</span>
				<span className="relative pl-5 before:absolute before:top-1/2 before:left-0 before:size-1.25 before:-translate-y-1/2 before:rounded-full before:bg-primary">
					POLK COUNTY
				</span>
				<span className="relative pl-5 before:absolute before:top-1/2 before:left-0 before:size-1.25 before:-translate-y-1/2 before:rounded-full before:bg-primary">
					DESOTO COUNTY
				</span>
				<span className="relative pl-5 before:absolute before:top-1/2 before:left-0 before:size-1.25 before:-translate-y-1/2 before:rounded-full before:bg-primary">
					OKEECHOBEE COUNTY
				</span>
			</p>
			<section
				id="hero"
				className="relative flex min-h-[calc(100vh-88px)] justify-center pt-20 md:pt-0 md:pb-12"
			>
				<img
					src="/assets/images/hero.webp"
					className="absolute top-0 left-0 -z-1 size-full object-cover"
					alt="A group of people running"
					fetchPriority="high"
				/>
				<div className="absolute top-0 left-0 -z-1 size-full bg-linear-to-b from-background/75 via-background/90 to-background" />
				<div className="container my-auto max-w-3xl px-4 md:px-3">
					<SectionBadge className="ml-1">
						EST. 2024 - SEBRING, FLORIDA
					</SectionBadge>
					<h1 className="font-bold text-5xl leading-14 md:text-7xl md:leading-18">
						Official race timing for the{" "}
						<span className="text-primary">Heartland.</span>
					</h1>
					<p className="my-8 ml-1 max-w-2xl text-foreground/80 md:text-lg">
						Chip-timed, results published same day. Timing road races and trail
						runs, all across Central Florida counties.
					</p>
					<div className="flex flex-col gap-6 md:flex-row">
						<Link
							to="/"
							hash="contact"
							className={buttonVariants({
								size: "lg",
								className: "h-12 px-5",
							})}
						>
							GET AN EVENT QUOTE
						</Link>
						<Link
							to="/events/results"
							className={buttonVariants({
								size: "lg",
								variant: "outline",
								className: "h-12 px-5",
							})}
						>
							FIND MY RESULTS
						</Link>
					</div>
					<div className="mt-10 mb-8 h-px bg-foreground/15 md:max-w-md" />
					<div className="mx-auto grid max-w-md grid-cols-2 justify-between gap-3 gap-y-6 sm:grid-cols-3 md:mx-0 md:flex">
						<div className="flex flex-col gap-4 text-center">
							<span className="font-medium text-2xl md:text-3xl">15+</span>
							<span className="font-normal text-foreground/60 text-xs tracking-wide">
								RACES TIMED
							</span>
						</div>
						<div className="flex flex-col gap-4 text-center">
							<span className="font-medium text-2xl md:text-3xl">3000+</span>
							<span className="font-normal text-foreground/60 text-xs tracking-wide">
								FINISHERS TIMED
							</span>
						</div>
						<div className="col-span-full flex flex-col gap-4 text-center sm:col-span-1 md:col-span-full">
							<span className="font-medium text-2xl md:text-3xl">5</span>
							<span className="font-normal text-foreground/60 text-xs tracking-wide">
								COUNTIES SERVED
							</span>
						</div>
					</div>
				</div>
			</section>
			<div className="mx-auto mt-40 max-w-360 space-y-40 md:space-y-48">
				<section id="upcoming-events" className="px-4 md:px-3">
					<div className="mb-10 flex flex-col items-center md:items-start">
						<SectionBadge>ON THE CALENDAR</SectionBadge>
						<h1 className="font-bold text-4xl md:text-5xl">Upcoming races</h1>
					</div>
					<div className="grid auto-rows-fr gap-6 md:grid-cols-2 lg:grid-cols-4">
						{upcomingRaces.map((d) => (
							<UpcomingRaceCard key={d.slug} race={d} />
						))}
						{upcomingRaces.length < 4 && (
							<div className="flex min-w-0 flex-col items-center justify-center rounded-md border border-foreground/15 bg-secondary/30 px-1 pt-1 pb-2">
								<span>That's all the upcoming races</span>
								<Link
									to="/events/results"
									className={buttonVariants({
										variant: "link",
										className:
											"mt-0.5 rounded-none border-transparent border-b pb-px no-underline hover:border-b-primary",
									})}
								>
									Past Results
								</Link>
							</div>
						)}
					</div>
				</section>
				<section
					id="contact"
					className="flex flex-col items-center gap-8 px-4 md:flex-row md:items-start md:gap-0 md:px-3"
				>
					<div className="flex max-w-xl flex-col gap-6 text-foreground/60">
						<div className="flex flex-col items-center md:items-start">
							<SectionBadge>FOR ORGANIZERS</SectionBadge>
							<h1 className="font-bold text-4xl text-foreground md:mb-1 md:text-5xl">
								Planning an event?
							</h1>
							<span className="font-semibold text-4xl text-primary md:text-5xl">
								Tell us about it.
							</span>
						</div>
						<p className="text-center md:text-start">
							From local charity 5Ks to large community races, we provide
							reliable chip timing, bib printing, race clocks, and same-day
							online results for events with 50 to 5,000 participants.
						</p>
						<ul className="mx-auto list-disc space-y-1 pr-3 pl-7 marker:text-primary md:mx-0 md:pr-0 md:pl-4">
							<li>
								<span className="text-foreground">Clear</span>, accurate results
								participants can trust
							</li>
							<li>
								<span className="text-foreground">Streamlined</span> race-day
								setup and operation
							</li>
							<li>
								<span className="text-foreground">Local service </span>
								throughout Central Florida
							</li>
						</ul>
					</div>
					<MessageForm className="w-full md:ml-auto md:max-w-2xl" />
				</section>
			</div>
		</main>
	);
}
