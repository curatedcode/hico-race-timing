import * as React from "react";
import { Input } from "#/components/ui/input";

type DebounceInputProps = {
	value: string | number;
	onChange: (value: string | number) => void;
	debounce?: number;
} & Omit<React.ComponentProps<typeof Input>, "onChange" | "value">;

export function DebounceInput({
	value: initialValue,
	onChange,
	debounce = 200,
	...props
}: DebounceInputProps) {
	const [value, setValue] = React.useState(initialValue);

	React.useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Only want to react to `value` change
	React.useEffect(() => {
		const timeout = setTimeout(() => {
			onChange(value);
		}, debounce);

		return () => clearTimeout(timeout);
	}, [value]);

	return (
		<Input
			{...props}
			value={value ?? ""}
			onChange={(e) => {
				if (e.target.value === "") return setValue("");
				if (props.type === "number") {
					setValue(e.target.valueAsNumber);
				} else {
					setValue(e.target.value);
				}
			}}
		/>
	);
}
