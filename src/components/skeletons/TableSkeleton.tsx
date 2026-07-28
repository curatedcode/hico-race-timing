import { cn } from "#/lib/utils";

export function TableSkeleton() {
	const rows = Array.from({ length: 15 }, (_, i) => i);

	return (
		<div>
			<div className="border-foreground/15 border-b pt-4 pb-3">
				<div className="max-w-360 space-y-3">
					<div className="flex gap-1.5">
						<div className="h-10" />
						<div className="h-10 w-26" />
						<div className="h-10 w-20" />
					</div>
					<div className="flex justify-between px-1">
						<div className="h-4 w-39.5" />
						<div className="h-4 w-18" />
					</div>
				</div>
			</div>
			<div className="max-w-360">
				<div className="h-14" />
				{rows.map((v) => (
					<div key={v} className={cn("h-12")} />
				))}
			</div>
		</div>
	);
}
