import type { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from "lucide-react";
import { Button } from "#/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { cn } from "#/lib/utils";

interface ColumnHeaderProps<TData, TValue>
	extends React.HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>;
	title: string;
}
export function ColumnHeader<TData, TValue>({
	column,
	title,
	className,
}: ColumnHeaderProps<TData, TValue>) {
	if (!column.getCanSort()) {
		return (
			<div className={cn("ml-1 px-2.5 text-base", className)}>{title}</div>
		);
	}
	return (
		<div className={cn("ml-1 flex items-center gap-2", className)}>
			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button
							variant="ghost"
							className="text-base data-[state=open]:bg-accent"
						>
							<span>{title}</span>
							{column.getIsSorted() === "desc" ? (
								<ArrowDown className="opacity-70" />
							) : column.getIsSorted() === "asc" ? (
								<ArrowUp className="opacity-70" />
							) : (
								<ChevronsUpDown className="opacity-70" />
							)}
						</Button>
					}
				/>
				<DropdownMenuContent
					align="start"
					className="bg-background ring-foreground/15"
				>
					<DropdownMenuItem
						onClick={() => column.toggleSorting(false)}
						className="h-8 focus:bg-primary"
					>
						<ArrowUp />
						Asc
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => column.toggleSorting(true)}
						className="h-8 focus:bg-primary"
					>
						<ArrowDown />
						Desc
					</DropdownMenuItem>
					<DropdownMenuSeparator className="bg-foreground/15" />
					<DropdownMenuItem
						onClick={() => column.toggleVisibility(false)}
						className="h-8 focus:bg-primary"
					>
						<EyeOff />
						Hide
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
