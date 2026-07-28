import type * as React from "react";
import { cn } from "#/lib/utils";

export type SectionBadgeProps = {
	className?: string;
	children: React.ReactNode;
};

export function SectionBadge({ className, children }: SectionBadgeProps) {
	return (
		<p
			className={cn([
				"mb-2 text-primary text-xs uppercase tracking-widest",
				className,
			])}
		>
			{children}
		</p>
	);
}
