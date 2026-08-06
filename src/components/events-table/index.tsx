import { Link } from "@tanstack/react-router";
import {
	type ColumnDef,
	type ColumnFiltersState,
	type FilterFn,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import * as React from "react";
import { ColumnHeader } from "#/components/events-table/column-header";
import { Pagination } from "#/components/events-table/pagination";
import { Button } from "#/components/ui/button";
import { DebounceInput } from "#/components/ui/debounce-input";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";
import { cn } from "#/lib/utils";

export type EventsTableColumns = {
	slug: string;
	name: string;
	finalizedDate: string;
	distanceKm: string;
	location: `${string}, ${string}`;
	organizer: string;
};

const columns: ColumnDef<EventsTableColumns>[] = [
	{
		accessorKey: "name",
		header: ({ column }) => <ColumnHeader column={column} title="Name" />,
		cell: ({ row }) => (
			<>
				<Link
					to={"/events/$slug"}
					params={{ slug: row.original.slug }}
					className="peer absolute inset-0 z-0"
					aria-label={row.original.name}
				/>
				<span className="underline decoration-transparent underline-offset-4 transition-colors peer-hover:text-primary peer-hover:decoration-primary">
					{row.original.name}
				</span>
			</>
		),
	},
	{
		accessorKey: "date",
		header: ({ column }) => <ColumnHeader column={column} title="Date" />,
		cell: ({ row }) => (
			<span>{dayjs(row.original.finalizedDate).format("MMM D YYYY")}</span>
		),
		enableGlobalFilter: false,
		sortingFn: (rowA, rowB) => {
			const dateA = dayjs(rowA.original.finalizedDate);
			const isBefore = dateA.isBefore(rowB.original.finalizedDate, "date");

			if (isBefore) return -1;

			const isSame = dateA.isSame(rowB.original.finalizedDate, "date");

			if (isSame) return 0;

			return 1;
		},
	},
	{
		accessorKey: "location",
		header: ({ column }) => <ColumnHeader column={column} title="Location" />,
		cell: ({ row }) => <span>{row.original.location}</span>,
		enableSorting: false,
	},
	{
		accessorKey: "distance (km)",
		header: ({ column }) => (
			<ColumnHeader column={column} title="Distance (km)" />
		),
		cell: ({ row }) => (
			<span>{Number.parseFloat(row.original.distanceKm).toString()}</span>
		),
		enableGlobalFilter: false,
	},
	{
		accessorKey: "organizer",
		header: ({ column }) => <ColumnHeader column={column} title="Organizer" />,
		cell: ({ row }) => <span>{row.original.organizer}</span>,
		enableSorting: false,
		enableGlobalFilter: false,
	},
];

const fuzzyGrepFilter: FilterFn<EventsTableColumns> = (
	row,
	_columnId,
	filterValue,
) => {
	const terms = String(filterValue).toLowerCase().split(/\s+/).filter(Boolean);

	const searchableColumns = row
		.getAllCells()
		.filter((cell) => cell.column.getCanGlobalFilter());

	const rowText = searchableColumns
		.map((cell) => String(cell.getValue() ?? "").toLowerCase())
		.join(" ");

	return terms.every((term) => rowText.includes(term));
};

function formatColumnTitle(str: string) {
	const parts = str.split(/(?=[A-Z])/);
	const uppercase = parts.map((v) => `${v[0]?.toUpperCase()}${v.slice(1)}`);

	return uppercase.join(" ");
}

export type EventsTableProps = {
	data?: EventsTableColumns[];
};

export function EventsTable({ data = [] }: EventsTableProps) {
	const [sorting, setSorting] = React.useState<SortingState>([
		{ id: "date", desc: true },
	]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [globalFilter, setGlobalFilter] = React.useState<
		string | number | undefined
	>();

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onGlobalFilterChange: setGlobalFilter,
		initialState: {
			pagination: {
				pageSize: 15,
			},
		},
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			globalFilter,
		},
		globalFilterFn: fuzzyGrepFilter,
	});

	function resetTable() {
		table.reset();
		table.setGlobalFilter("");

		for (const col of table.getAllColumns()) {
			col.toggleVisibility(true);
			col.clearSorting();

			if (col.id === "date") {
				col.toggleSorting(true);
			}
		}
	}

	return (
		<div className="pb-6">
			<div className="sticky top-16 z-50 border-foreground/15 border-b bg-secondary pt-4 pb-3">
				<div className="mx-auto max-w-360 space-y-3">
					<div className="flex items-center gap-1.5 px-1.5">
						<DebounceInput
							placeholder="Search events..."
							value={globalFilter ?? ""}
							onChange={(value) => setGlobalFilter(value)}
							className="h-10 bg-foreground text-background placeholder:text-background/40"
						/>
						<Button variant="outline" className="h-10" onClick={resetTable}>
							Reset Filters
						</Button>
						<DropdownMenu>
							<DropdownMenuTrigger
								render={
									<Button variant="outline" className="h-10">
										<span>Columns</span>
									</Button>
								}
							/>
							<DropdownMenuContent
								align="end"
								className="w-50 bg-background ring-foreground/15"
							>
								{table
									.getAllColumns()
									.filter((column) => column.getCanHide())
									.map((column) => {
										return (
											<DropdownMenuCheckboxItem
												key={column.id}
												checked={column.getIsVisible()}
												onCheckedChange={(value) =>
													column.toggleVisibility(!!value)
												}
												className="h-9 focus:bg-primary"
											>
												{formatColumnTitle(column.id)}
											</DropdownMenuCheckboxItem>
										);
									})}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<div className="flex justify-between pr-3 pl-2.5 text-foreground/60 text-xs">
						<div>
							Showing {table.getRowModel().rows.length} of{" "}
							{table.getFilteredRowModel().rows.length} events
						</div>
						<div>
							Page {table.getState().pagination.pageIndex + 1} of{" "}
							{table.getPageCount()}
						</div>
					</div>
				</div>
			</div>
			<div className="mx-auto mb-6 max-w-360 overflow-hidden rounded-t-none border border-foreground/15 border-t-0 md:rounded-md">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow
								key={headerGroup.id}
								className="border-foreground/15 bg-background hover:bg-background has-aria-expanded:bg-background"
							>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id} className="h-14 px-0">
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row, i) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									className={cn(
										i % 2 === 0
											? "bg-secondary hover:bg-background/40 has-aria-expanded:bg-background/40"
											: "bg-background/60 hover:bg-background/80 has-aria-expanded:bg-background/80",
										"relative h-12 border-foreground/15",
									)}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<Pagination table={table} />
		</div>
	);
}
