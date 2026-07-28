import type {
	HasDefault,
	HasRuntimeDefault,
	IsIdentity,
	IsPrimaryKey,
	NotNull,
} from "drizzle-orm";
import type {
	PgBigInt53BuilderInitial,
	PgTextBuilderInitial,
	PgTimestampBuilderInitial,
	pgTable,
} from "drizzle-orm/pg-core";
import { uuid } from "#/lib/utils";

export type DrizzleColumnDataTypes = Parameters<
	Parameters<typeof pgTable>[1]
>[0];

type ColumnsReturnType = {
	id: IsIdentity<
		IsPrimaryKey<NotNull<PgBigInt53BuilderInitial<"id">>>,
		"byDefault"
	>;
	deletedAt: PgTimestampBuilderInitial<"">;
	createdAt: NotNull<HasDefault<PgTimestampBuilderInitial<"created_at">>>;
	updatedAt: HasDefault<
		NotNull<HasDefault<PgTimestampBuilderInitial<"updated_at">>>
	>;
};

type ColumnsExtendedReturnType = {
	public_id: HasRuntimeDefault<
		HasDefault<
			IsPrimaryKey<NotNull<PgTextBuilderInitial<"", [string, ...string[]]>>>
		>
	>;
} & ColumnsReturnType;

export function defaultTableColumns(
	dataTypes: DrizzleColumnDataTypes,
	publicId?: false,
): ColumnsReturnType;
export function defaultTableColumns(
	dataTypes: DrizzleColumnDataTypes,
	publicId: true,
): ColumnsExtendedReturnType;
/**
 * Set default columns "id", "created_at", "updated_at" and "deleted_at" on a table.
 *
 * publicID - Include a `public_id` column with uuid for private tables.
 */
export function defaultTableColumns(
	dataTypes: DrizzleColumnDataTypes,
	publicId?: boolean,
) {
	const columns = {
		id: dataTypes
			.bigint("id", { mode: "number" })
			.primaryKey()
			.generatedByDefaultAsIdentity(),
		deletedAt: dataTypes.timestamp({
			mode: "date",
			precision: 3,
			withTimezone: true,
		}),
		createdAt: dataTypes
			.timestamp("created_at", {
				mode: "date",
				precision: 3,
				withTimezone: true,
			})
			.defaultNow()
			.notNull(),
		updatedAt: dataTypes
			.timestamp("updated_at", {
				mode: "date",
				precision: 3,
				withTimezone: true,
			})
			.defaultNow()
			.notNull()
			.$onUpdateFn(() => new Date()),
	};

	if (publicId) {
		return {
			...columns,
			public_id: dataTypes.text().primaryKey().$defaultFn(uuid),
		};
	}

	return columns;
}
