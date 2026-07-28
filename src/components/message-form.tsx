import { useForm } from "@tanstack/react-form";
import { AnimatePresence, motion } from "framer-motion";
import { isPossiblePhoneNumber } from "libphonenumber-js";
import * as React from "react";
import z from "zod";
import { Button } from "#/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { cn } from "#/lib/utils";

const formSchema = z.object({
	name: z
		.string({ error: "Please enter your name" })
		.min(1, { error: "Please enter your name" }),
	email: z
		.email({ error: "Please enter a valid email" })
		.min(1, { error: "Please enter your email" }),
	phone: z.string({ error: "Please enter a valid phone number" }).refine(
		(value) => {
			if (!value) return true;
			return isPossiblePhoneNumber(value, "US");
		},
		{ error: "Please enter a valid phone number" },
	),
	organization: z.string({ error: "Please enter your organization" }),
	message: z
		.string({ error: "Please enter a message" })
		.min(1, { error: "Please enter a message" }),
});

export function MessageForm({ className }: { className?: string }) {
	const [submitted, setSubmitted] = React.useState(false);

	const form = useForm({
		validators: {
			onSubmit: formSchema,
		},
		defaultValues: {
			name: "",
			email: "",
			phone: "",
			organization: "",
			message: "",
		},
		onSubmit: () => {
			setSubmitted(true);
			form.reset();
		},
	});

	const formId = React.useId();

	return (
		<motion.div
			className={cn(
				"rounded-md border border-foreground/15 bg-secondary px-3 py-4 md:p-5",
				className,
			)}
		>
			<AnimatePresence mode="wait">
				{!submitted ? (
					<motion.form
						key={formId}
						id={formId}
						initial={{ opacity: 1 }}
						exit={{ opacity: 0, y: -8 }}
						transition={{ duration: 0.2 }}
						onSubmit={(e) => {
							e.preventDefault();
							form.handleSubmit();
						}}
					>
						<FieldGroup className="grid sm:grid-cols-2">
							<form.Field name="name">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel
												htmlFor={field.name}
												className="ml-1 text-foreground/60 text-xs"
											>
												NAME <span className="text-destructive">*</span>
											</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) =>
													field.handleChange(e.currentTarget.value)
												}
												autoComplete="name"
												className="h-10 bg-foreground text-black"
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							</form.Field>
							<form.Field name="email">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel
												htmlFor={field.name}
												className="ml-1 text-foreground/60 text-xs"
											>
												EMAIL <span className="text-destructive">*</span>
											</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) =>
													field.handleChange(e.currentTarget.value)
												}
												type="email"
												autoComplete="email"
												className="h-10 bg-foreground text-black"
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							</form.Field>
							<form.Field name="phone">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel
												htmlFor={field.name}
												className="ml-1 text-foreground/60 text-xs"
											>
												PHONE
											</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) =>
													field.handleChange(e.currentTarget.value)
												}
												className="h-10 bg-foreground text-black"
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							</form.Field>
							<form.Field name="organization">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel
												htmlFor={field.name}
												className="ml-1 text-foreground/60 text-xs"
											>
												ORGANIZATION
											</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) =>
													field.handleChange(e.currentTarget.value)
												}
												className="h-10 bg-foreground text-black"
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							</form.Field>
							<form.Field name="message">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field
											data-invalid={isInvalid}
											className="sm:col-span-full"
										>
											<FieldLabel
												htmlFor={field.name}
												className="ml-1 text-foreground/60 text-xs"
											>
												TELL US ABOUT YOUR EVENT{" "}
												<span className="text-destructive">*</span>
											</FieldLabel>
											<Textarea
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) =>
													field.handleChange(e.currentTarget.value)
												}
												className="h-32 bg-foreground text-black placeholder:text-background/40"
												placeholder="Race type, expected size, date, and location..."
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							</form.Field>
							<div className="flex items-center justify-between sm:col-span-2">
								<p className="max-w-40 pl-0.5 text-foreground/50 text-xs md:max-w-none">
									We reply within one business day.
								</p>
								<Field className="w-32">
									<Button type="submit" className="h-10 px-6">
										SEND MESSAGE
									</Button>
								</Field>
							</div>
						</FieldGroup>
					</motion.form>
				) : (
					<motion.div
						key="success"
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.25, delay: 0.1 }}
						className="flex h-68 flex-col items-center justify-center gap-3"
					>
						<div className="flex flex-col items-center gap-1.5 pt-4 pb-8 text-center">
							<CheckmarkIcon />
							<p className="mt-1 font-medium">Message sent</p>
							<p className="text-foreground/60 text-sm">
								We'll get back to you within 1-2 business days.
							</p>
						</div>
						<Button
							variant="ghost"
							className="hover:bg-background hover:text-foreground aria-expanded:bg-background aria-expanded:text-foreground"
							onClick={() => setSubmitted(false)}
						>
							Send another message
						</Button>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
}

function CheckmarkIcon() {
	return (
		<motion.svg width="48" height="48" viewBox="0 0 48 48">
			<motion.circle
				cx="24"
				cy="24"
				r="20"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				initial={{ pathLength: 0 }}
				animate={{ pathLength: 1 }}
				transition={{ duration: 0.4, ease: "easeOut" }}
				className="stroke-green-600"
			/>
			<motion.path
				d="M14 24l7 7 13-13"
				fill="none"
				stroke="currentColor"
				strokeWidth="2.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				initial={{ pathLength: 0 }}
				animate={{ pathLength: 1 }}
				transition={{ duration: 0.3, delay: 0.35, ease: "easeOut" }}
				className="stroke-green-600"
			/>
		</motion.svg>
	);
}
