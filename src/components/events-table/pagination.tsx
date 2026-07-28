import type { Table } from "@tanstack/react-table";
import { Button } from "#/components/ui/button";
import { useWindowSize } from "#/lib/hooks/useWindowSize";
import { cn } from "#/lib/utils";

function PageButton<TData>({
	pageIndex,
	table,
	selectedPageIndex,
}: {
	pageIndex: number;
	table: Table<TData>;
	selectedPageIndex: number;
}) {
	return (
		<Button
			variant="outline"
			size="icon"
			className={cn(
				pageIndex === selectedPageIndex &&
					"border-transparent/60 bg-primary text-foreground hover:bg-primary/80 hover:text-primary-primary/8ria-expanded:bg-primary-background aria-expanded:text-foreground",
				"size-10",
			)}
			onClick={() => table.setPageIndex(pageIndex)}
		>
			{pageIndex + 1}
		</Button>
	);
}

function PaginationButtons<TData>({ table }: PaginationProps<TData>) {
	const { width: windowWidth } = useWindowSize();

	const selectedPageIndex = table.getState().pagination.pageIndex;
	const isFirstPageSelected = selectedPageIndex === 0;
	const isSecondPageSelected = selectedPageIndex === 1;
	const isLastPageSelected = selectedPageIndex === table.getPageCount() - 1;

	const pages = Array(table.getPageCount())
		.fill(0)
		.map((_, i) => i);

	if ((windowWidth ?? 768) < 768) {
		if (isFirstPageSelected) {
			return (
				<>
					<PageButton
						pageIndex={0}
						table={table}
						selectedPageIndex={selectedPageIndex}
					/>
					{pages.slice(1, 3).map((v) => (
						<PageButton
							key={v}
							pageIndex={v}
							table={table}
							selectedPageIndex={selectedPageIndex}
						/>
					))}
				</>
			);
		}

		if (isLastPageSelected) {
			return (
				<>
					{pages.slice(-3).map((v) => (
						<PageButton
							key={v}
							pageIndex={v}
							table={table}
							selectedPageIndex={selectedPageIndex}
						/>
					))}
				</>
			);
		}

		return (
			<>
				<PageButton
					pageIndex={selectedPageIndex - 1}
					table={table}
					selectedPageIndex={selectedPageIndex}
				/>
				<PageButton
					pageIndex={selectedPageIndex}
					table={table}
					selectedPageIndex={selectedPageIndex}
				/>
				<PageButton
					pageIndex={selectedPageIndex + 1}
					table={table}
					selectedPageIndex={selectedPageIndex}
				/>
			</>
		);
	}

	if (table.getPageCount() <= 7) {
		return pages.map((v) => (
			<PageButton
				key={v}
				pageIndex={v}
				table={table}
				selectedPageIndex={selectedPageIndex}
			/>
		));
	}

	if (isFirstPageSelected || isSecondPageSelected) {
		return (
			<>
				<PageButton
					pageIndex={0}
					table={table}
					selectedPageIndex={selectedPageIndex}
				/>
				<PageButton
					pageIndex={1}
					table={table}
					selectedPageIndex={selectedPageIndex}
				/>
				<PageButton
					pageIndex={2}
					table={table}
					selectedPageIndex={selectedPageIndex}
				/>
				<PageButton
					pageIndex={3}
					table={table}
					selectedPageIndex={selectedPageIndex}
				/>
				<div className="flex h-10 w-8 items-end justify-center py-1 tracking-wide">
					...
				</div>
				<PageButton
					pageIndex={table.getPageCount() - 1}
					table={table}
					selectedPageIndex={selectedPageIndex}
				/>
			</>
		);
	}

	if (isLastPageSelected) {
		return (
			<>
				<PageButton
					pageIndex={0}
					table={table}
					selectedPageIndex={selectedPageIndex}
				/>
				<div className="flex h-10 w-8 items-end justify-center py-1 tracking-wide">
					...
				</div>
				<PageButton
					pageIndex={table.getPageCount() - 4}
					table={table}
					selectedPageIndex={selectedPageIndex}
				/>
				<PageButton
					pageIndex={table.getPageCount() - 3}
					table={table}
					selectedPageIndex={selectedPageIndex}
				/>
				<PageButton
					pageIndex={table.getPageCount() - 2}
					table={table}
					selectedPageIndex={selectedPageIndex}
				/>
				<PageButton
					pageIndex={table.getPageCount() - 1}
					table={table}
					selectedPageIndex={selectedPageIndex}
				/>
			</>
		);
	}

	// Since we handle first/last above, these will always be defined
	const previousPageIndex = pages[selectedPageIndex - 1] as number;
	const nextPageIndex = pages[selectedPageIndex + 1] as number;

	return (
		<>
			<PageButton
				pageIndex={0}
				table={table}
				selectedPageIndex={selectedPageIndex}
			/>
			<div className="flex h-10 w-8 items-end justify-center py-1 tracking-wide">
				...
			</div>
			<PageButton
				pageIndex={previousPageIndex}
				table={table}
				selectedPageIndex={selectedPageIndex}
			/>
			<PageButton
				pageIndex={selectedPageIndex}
				table={table}
				selectedPageIndex={selectedPageIndex}
			/>
			<PageButton
				pageIndex={nextPageIndex}
				table={table}
				selectedPageIndex={selectedPageIndex}
			/>
			<div className="flex h-10 w-8 items-end justify-center py-1 tracking-wide">
				...
			</div>
			<PageButton
				pageIndex={table.getPageCount() - 1}
				table={table}
				selectedPageIndex={selectedPageIndex}
			/>
		</>
	);
}

type PaginationProps<TData> = {
	table: Table<TData>;
};

export function Pagination<TData>({ table }: PaginationProps<TData>) {
	return (
		<div className="flex h-12 items-center justify-center gap-2">
			<Button
				variant="outline"
				size="lg"
				className=""
				onClick={() => table.previousPage()}
				disabled={!table.getCanPreviousPage()}
			>
				<span className="sr-only">Go to previous page</span>
				<span aria-hidden>Prev</span>
			</Button>
			{<PaginationButtons table={table} />}
			<Button
				variant="outline"
				size="lg"
				className=""
				onClick={() => table.nextPage()}
				disabled={!table.getCanNextPage()}
			>
				<span className="sr-only">Go to next page</span>
				<span aria-hidden>Next</span>
			</Button>
		</div>
	);
}
