import { TableSkeleton } from "#/components/skeletons/TableSkeleton";

export function EventSlugSkeleton() {
	return (
		<main className="pt-12">
			<div className="mx-auto mb-16 flex max-w-360 space-x-8">
				<div className="space-y-4 border-foreground/15 border-r pr-8">
					<div className="w-102">
						<div className="mb-2 h-4" />
						<div className="h-12" />
					</div>
					<div className="flex gap-4">
						<div className="h-6.5 w-25" />
						<div className="h-6.5 w-16" />
					</div>
				</div>
				<div className="flex max-w-xl flex-col gap-4">
					<div className="flex gap-4">
						<div className="h-21 w-25" />
						<div className="h-21 w-23" />
						<div className="h-21 w-21.5" />
						<div className="h-21 w-16.5" />
					</div>
					<div className="h-23 w-98" />
					{/* <div className="flex w-full flex-col rounded-md border border-foreground/15 bg-secondary px-3 pt-2.5 pb-2">
								<h2 className="mb-2 text-foreground/60 text-xs tracking-wider">
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
							</div> */}
				</div>
			</div>
			<div className="bg-secondary pb-24">
				<TableSkeleton />
			</div>
		</main>
	);
}
