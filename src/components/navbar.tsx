import { Link, useLocation } from "@tanstack/react-router";
import * as React from "react";
import { Button, buttonVariants } from "#/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "#/components/ui/navigation-menu";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "#/components/ui/popover";
import { cn } from "#/lib/utils";

export function Navbar() {
	const [popoverOpen, setPopoverOpen] = React.useState(false);
	const { pathname } = useLocation();

	return (
		<div className="sticky top-0 z-999 bg-background">
			<div className="mx-auto flex max-w-360 items-center justify-between gap-3 py-3 pr-2.5 pl-4 md:px-2">
				<Link to="/" aria-label="Home" className="flex items-center gap-2">
					<img
						src="/assets/images/logos/small.webp"
						alt="HiCo Logo"
						className="size-10 rounded-full"
						fetchPriority="high"
					/>
					<span className="hidden font-medium sm:block">HICO RACE TIMING</span>
				</Link>
				<NavigationMenu className="hidden sm:flex">
					<NavigationMenuList className="gap-5">
						<NavigationMenuItem>
							<NavigationMenuLink
								styling="none"
								className={buttonVariants({
									variant: "link",
									className: cn(
										"text-foreground transition-colors hover:text-primary",
										pathname === "/" && "decoration-primary",
									),
								})}
								render={<Link to="/">HOME</Link>}
							/>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<NavigationMenuLink
								styling="none"
								className={buttonVariants({
									variant: "link",
									className: cn(
										"text-foreground transition-colors hover:text-primary",
										pathname === "/events/results" && "decoration-primary",
									),
								})}
								render={<Link to="/events/results">EVENT RESULTS</Link>}
							/>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<NavigationMenuLink
								styling="none"
								className={buttonVariants({
									variant: "link",
									className: cn(
										"text-foreground transition-colors hover:text-primary",
										pathname === "/contact" && "decoration-primary",
									),
								})}
								render={<Link to="/contact">CONTACT</Link>}
							/>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
				<div className="sm:hidden">
					<Popover modal open={popoverOpen} onOpenChange={setPopoverOpen}>
						<PopoverTrigger
							render={
								<Button variant="ghost" size="icon">
									<span className="sr-only">Open menu</span>
									<div className="relative size-4">
										<div className="absolute top-1/2 left-0 h-0.5 w-4 translate-y-[calc(-50%-3px)] bg-foreground transition-transform duration-100 group-data-popup-open/button:translate-y-[-50%] group-data-popup-open/button:rotate-45" />
										<div className="absolute top-1/2 left-0 h-0.5 w-4 translate-y-[calc(-50%+3px)] bg-foreground transition-transform duration-100 group-data-popup-open/button:translate-y-[-50%] group-data-popup-open/button:-rotate-45" />
									</div>
								</Button>
							}
						/>
						<PopoverContent
							className={{
								positioner: "pt-4",
								popup:
									"data-[side=bottom]:slide-in-from-top-6 data-open:zoom-in-100 data-closed:zoom-out-100 h-[calc(100vh-4.5rem)] w-screen gap-5 rounded-none bg-background/90 p-0 py-5 text-xl ring-0 backdrop-blur-xs",
							}}
							align="center"
							sideOffset={0}
							collisionPadding={0}
						>
							<div className="grid space-y-5 px-5">
								<Link
									to="/"
									className={cn(pathname === "/" && "text-primary")}
									onClick={() => setPopoverOpen(false)}
								>
									Home
								</Link>
								<Link
									to="/events/results"
									className={cn(
										pathname === "/events/results" && "text-primary",
									)}
									onClick={() => setPopoverOpen(false)}
								>
									Results
								</Link>
								<Link
									to="/contact"
									className={cn(pathname === "/contact" && "text-primary")}
									onClick={() => setPopoverOpen(false)}
								>
									Contact
								</Link>
							</div>
							<div className="mt-auto h-px w-full bg-foreground/15" />
							<div className="flex flex-col gap-2 px-5 text-sm">
								<span className="mb-0.5">Contact Us</span>
								<a href="tel+" className={buttonVariants({ variant: "link" })}>
									(863) 555-1234
								</a>
								<a
									href="mailto:"
									className={buttonVariants({ variant: "link" })}
								>
									info@hicoracetiming.com
								</a>
							</div>
						</PopoverContent>
					</Popover>
				</div>
			</div>
		</div>
	);
}
