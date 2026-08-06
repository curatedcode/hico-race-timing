import { createFileRoute } from "@tanstack/react-router";
import { SectionBadge } from "#/components/section-badge";
import { buttonVariants } from "#/components/ui/button";

export const Route = createFileRoute("/contact")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: "Contact Us | HiCo Race Timing",
			},
			{
				name: "description",
				content:
					"Contact HiCo Race Timing to book chip timing and equipment for your upcoming race. Get pricing and availability for your event date.",
			},
			{ property: "og:title", content: "Contact HiCo Race Timing" },
			{
				property: "og:description",
				content:
					"Book chip timing and equipment for your upcoming race. Get pricing and availability.",
			},
			{
				property: "og:image",
				content:
					"https://hicoracetiming.zackaryf.com/assets/images/social/og-default.png",
			},
			{ property: "og:type", content: "website" },
			{
				property: "og:url",
				content: "https://hicoracetiming.zackaryf.com/contact",
			},

			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:title", content: "Contact HiCo Race Timing" },
			{
				name: "twitter:description",
				content:
					"Book chip timing for your race. Get pricing and availability.",
			},
			{
				property: "twitter:url",
				content: "https://hicoracetiming.zackaryf.com/contact",
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
				href: "https://hicoracetiming.zackaryf.com/contact",
			},
		],
	}),
});

function RouteComponent() {
	return (
		<main className="grid min-h-[90vh] place-items-center bg-secondary pt-16 pb-12 md:pt-0">
			<div className="mx-auto flex max-w-360 flex-col items-center gap-8 px-2 xl:flex-row xl:items-start xl:gap-0 xl:px-3">
				<div className="flex max-w-xl flex-col px-4 md:px-0">
					<div className="mb-6 space-y-3 px-1 text-center md:text-start">
						<div>
							<SectionBadge>GET IN TOUCH</SectionBadge>
							<h1 className="font-bold text-4xl md:text-5xl">
								Let's time your race.
							</h1>
						</div>
						<p className="text-foreground/60 text-sm">
							Reach us by phone, email, or the request form on the home page. We
							reply within one business day.
						</p>
					</div>
					<div className="grid gap-5 md:grid-cols-2">
						<div className="rounded-md border border-foreground/15 bg-background px-6 py-5 text-center md:text-start">
							<h2 className="mb-1 text-foreground/60 text-sm">CALL</h2>
							<a
								href="tel+"
								className={buttonVariants({
									variant: "link",
									className: "mb-2 font-medium text-lg",
								})}
							>
								(863) 555-1234
							</a>
							<p className="font-medium text-foreground/60 text-sm">
								Mon-Fri, 9am-5pm EST
							</p>
						</div>
						<div className="rounded-md border border-foreground/15 bg-background px-6 py-5 text-center md:text-start">
							<h2 className="mb-1 text-foreground/60 text-sm">EMAIL</h2>
							<a
								href="mailto:"
								className={buttonVariants({
									variant: "link",
									className: "mb-2 font-medium text-lg",
								})}
							>
								info@hicoracetiming.com
							</a>
							<p className="font-medium text-foreground/60 text-sm">
								One business day response
							</p>
						</div>
						<div className="w-fit rounded-md border border-foreground/15 bg-background px-6 py-5 text-center md:col-span-2 md:w-full md:text-start">
							<h2 className="mb-2 text-foreground/60 text-sm">SERVICE AREA</h2>
							<ul className="flex flex-wrap gap-1.5 md:flex-nowrap">
								<li className="pl-0.5 md:block md:pl-0">
									<span>Highlands</span>
									<span className="hidden md:ml-1.5 md:inline-block">·</span>
									<span className="md:hidden">,</span>
								</li>
								<li className="pl-0.5 md:block md:pl-0">
									<span>Hardee</span>
									<span className="hidden md:ml-1.5 md:inline-block">·</span>
									<span className="md:hidden">,</span>
								</li>
								<li className="pl-0.5 md:block md:pl-0">
									<span>Polk</span>
									<span className="hidden md:ml-1.5 md:inline-block">·</span>
									<span className="md:hidden">,</span>
								</li>
								<li className="pl-0.5 md:block md:pl-0">
									<span>DeSoto</span>
									<span className="hidden md:ml-1.5 md:inline-block">·</span>
									<span className="md:hidden">,</span>
								</li>
								<li className="pl-0.5 md:block md:pl-0">
									<span>Okeechobee</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
				{/* <MessageForm className="w-full bg-background md:max-w-2xl xl:ml-auto" /> */}
			</div>
		</main>
	);
}
