import { Link } from "@tanstack/react-router";
import dayjs from "dayjs";
import relativeTimePlugin from "dayjs/plugin/relativeTime";
import { ArrowRight, MapPin, Users } from "lucide-react";
import { buttonVariants } from "#/components/ui/button";
import { cn, INTERNAL_HOSTS } from "#/lib/utils";
import type { RouterOutputs } from "#/trpc/react";

dayjs.extend(relativeTimePlugin);

export type UpcomingRaceCardProps = {
	className?: string;
} & (
	| {
			race: RouterOutputs["race"]["upcoming"][number];
			isPlaceholder?: false;
	  }
	| {
			isPlaceholder: true;
	  }
);

export function UpcomingRaceCard(props: UpcomingRaceCardProps) {
	if (props.isPlaceholder) {
		return <div>Placeholder card</div>;
	}

	const { race } = props;

	const websiteURL = new URL(race.website);
	const linkIsInternal = INTERNAL_HOSTS.has(websiteURL.hostname);
	const link = linkIsInternal ? `/${race.slug}/register` : race.website;

	const startDateJS = dayjs(race.startDate);
	const isPast = startDateJS.isSame(undefined, "date");

	return (
		<div
			className={cn(
				"flex min-w-0 gap-4 rounded-md border border-foreground/15 bg-secondary p-1",
				props.className,
			)}
		>
			<div className="flex flex-col items-center justify-center rounded-l-[6px] bg-background px-8">
				<span className="font-medium text-primary">
					{startDateJS.format("MMM")}
				</span>
				<span className="font-bold text-2xl">{startDateJS.format("D")}</span>
				<span className="mt-1.5 text-foreground/60 text-xs">
					{startDateJS.format("YYYY")}
				</span>
			</div>
			<div className="flex w-full min-w-0 flex-col pr-6">
				<div className="mb-3 flex gap-3">
					<div className="flex min-w-0 flex-col gap-1.5 overflow-hidden pt-2">
						<span className="line-clamp-2">{race.name}</span>
						<div className="flex min-w-0 items-center gap-1 text-foreground/60 text-sm">
							<MapPin className="size-4 shrink-0 text-primary" />
							<span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
								{race.city}, {race.state}
							</span>
						</div>
						<div className="flex min-w-0 items-center gap-1 text-foreground/60 text-sm">
							<Users className="size-4 shrink-0 text-primary" />
							<span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
								{race.organizer}
							</span>
						</div>
					</div>
				</div>
				<div className="mt-auto flex items-center border-t border-t-background py-2">
					<span className="text-foreground/60 text-sm lg:max-[86rem]:hidden">
						{isPast ? "Today" : startDateJS.fromNow()}
					</span>
					{linkIsInternal ? (
						<Link
							to={link}
							className={buttonVariants({
								variant: "link",
								className:
									"mt-0.5 ml-auto rounded-none border-transparent border-b pb-px no-underline hover:border-b-primary",
							})}
						>
							Register
							<ArrowRight className="transition-transform group-hover/button:-rotate-45" />
						</Link>
					) : (
						<a
							href={link}
							className={buttonVariants({
								variant: "link",
								className:
									"mt-0.5 ml-auto rounded-none border-transparent border-b pb-px no-underline hover:border-b-primary",
							})}
						>
							Register
							<ArrowRight className="transition-transform group-hover/button:-rotate-45" />
						</a>
					)}
				</div>
			</div>
		</div>
	);
}
