import { Link } from "@tanstack/react-router";
import { SectionBadge } from "#/components/section-badge";
import { buttonVariants } from "#/components/ui/button";

export function NotFoundComponent() {
	return (
		<main className="flex h-[90vh] place-items-center bg-secondary pb-24">
			<div className="mx-auto flex flex-col gap-3 text-center">
				<div className="text-center">
					<SectionBadge>404</SectionBadge>
					<h1 className="font-bold text-5xl">Off course.</h1>
				</div>
				<p className="text-foreground/80">
					This page doesn't exist. Let's get back on course.
				</p>
				<div className="mt-3 flex gap-3">
					<Link
						to="/"
						className={buttonVariants({
							size: "lg",
							className: "h-12 px-5",
						})}
					>
						RETURN HOME
					</Link>
					<Link
						to="/events/results"
						className={buttonVariants({
							size: "lg",
							variant: "outline",
							className: "h-12 px-5",
						})}
					>
						VIEW RESULTS
					</Link>
					<Link
						to="/contact"
						className={buttonVariants({
							size: "lg",
							variant: "outline",
							className: "h-12 px-5",
						})}
					>
						CONTACT US
					</Link>
				</div>
			</div>
		</main>
	);
}
