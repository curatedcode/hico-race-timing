import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import z from "zod";
import { Button, buttonVariants } from "#/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";

const formSchema = z.object({
	email: z.email(),
});

export function Footer() {
	const [submitted, setSubmitted] = React.useState(false);

	const form = useForm({
		validators: {
			onSubmit: formSchema,
		},
		defaultValues: {
			email: "",
		},
		onSubmit: () => {
			setSubmitted(true);
		},
	});

	return (
		<footer className="border-t bg-background">
			<div className="mx-auto flex max-w-md flex-col-reverse items-center gap-8 px-2 pt-11.5 pb-12 text-center text-foreground/60 text-sm md:max-w-360 md:flex-row md:items-start md:px-3 md:text-start">
				<div className="mr-auto flex flex-col gap-3">
					<Link
						to="/"
						aria-label="Home"
						className="flex items-center gap-2 self-center md:self-start"
					>
						<img
							src="/assets/images/logos/small.webp"
							alt="HiCo Logo"
							className="size-10 rounded-full"
						/>
						<span className="font-medium text-foreground">
							HICO RACE TIMING
						</span>
					</Link>
					<p className="max-w-md">
						Proudly serving Central Florida, including Highlands, Hardee, Polk,
						DeSoto, Okeechobee, and surrounding counties.
					</p>
					<span>&copy; HiCo Race Timing 2026</span>
				</div>
				<div className="flex flex-col items-center gap-1 md:items-start">
					<span className="mb-2 font-medium">CONTACT</span>
					<a href="tel+" className={buttonVariants({ variant: "link" })}>
						(863) 555-1234
					</a>
					<a href="mailto:" className={buttonVariants({ variant: "link" })}>
						info@hicoracetiming.com
					</a>
				</div>
				<div className="flex max-w-sm flex-col gap-1 md:max-w-xs">
					<span className="mb-2 font-medium">GET NOTIFIED</span>
					<p>Get updates on upcoming events, race news, and more.</p>
					<motion.div>
						<AnimatePresence mode="wait">
							{!submitted ? (
								<motion.form
									id="subscription-form"
									onSubmit={(e) => {
										e.preventDefault();
										form.handleSubmit();
									}}
									className="mt-2"
								>
									<FieldGroup className="flex-row gap-1.5">
										<form.Field name="email">
											{(field) => {
												const isInvalid =
													field.state.meta.isTouched &&
													!field.state.meta.isValid;
												return (
													<Field data-invalid={isInvalid}>
														<FieldLabel htmlFor={field.name} className="hidden">
															Email
														</FieldLabel>
														<Input
															id={field.name}
															name={field.name}
															value={field.state.value}
															onBlur={field.handleBlur}
															onChange={(e) =>
																field.handleChange(e.target.value)
															}
															placeholder="you@example.com"
															autoComplete="email"
															type="email"
															className="h-10 bg-foreground text-background placeholder:text-background/40"
														/>
														{isInvalid && (
															<FieldError
																errors={field.state.meta.errors}
																className="text-start"
															/>
														)}
													</Field>
												);
											}}
										</form.Field>
										<Field className="w-32">
											<Button type="submit" className="h-10">
												JOIN
											</Button>
										</Field>
									</FieldGroup>
								</motion.form>
							) : (
								<motion.div
									key="success"
									initial={{ opacity: 0, y: 8 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.25, delay: 0.1 }}
									className="flex h-11 flex-col items-center justify-center gap-3"
								>
									<div className="flex items-center gap-1.5 px-2.5 py-1 text-center">
										<CheckmarkIcon />
										<p className="font-medium">Subscription submitted</p>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>
				</div>
			</div>
		</footer>
	);
}

function CheckmarkIcon() {
	return (
		<motion.svg width="24" height="24" viewBox="0 0 24 24">
			<motion.circle
				cx="12"
				cy="12"
				r="10"
				fill="none"
				stroke="currentColor"
				strokeWidth="1"
				initial={{ pathLength: 0 }}
				animate={{ pathLength: 1 }}
				transition={{ duration: 0.4, ease: "easeOut" }}
				className="stroke-green-600"
			/>
			<motion.path
				d="M7 12l3.5 3.5 6.5-6.5"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.25"
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
