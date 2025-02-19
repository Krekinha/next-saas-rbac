"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState } from "@/hooks/use-form-state";
import { AlertTriangle, CircleCheck, Loader2 } from "lucide-react";
import { createOrganizationAction } from "./actions";

export function OrganizationForm() {
	const [state, isPending, formAction] = useFormState(
		createOrganizationAction,
		onSuccess,
	);

	function onSuccess() {
		// router.push("/auth/sign-in");
	}
	return (
		<form onSubmit={formAction} className="space-y-4">
			{state.success === false && state.message && (
				<Alert variant="destructive">
					<AlertTriangle className="size-4" />
					<AlertTitle>Save organization failed</AlertTitle>
					<AlertDescription>
						<p>{state.message}</p>
					</AlertDescription>
				</Alert>
			)}

			{state.success === true && state.message && (
				<Alert variant="success">
					<CircleCheck className="size-4" />
					<AlertTitle>Success!</AlertTitle>
					<AlertDescription>
						<p>{state.message}</p>
					</AlertDescription>
				</Alert>
			)}
			<div className="space-y-1">
				<Label htmlFor="name">Organization name</Label>
				<Input name="name" id="name" />
				{state?.fieldErrors?.name && (
					<p className="font-medium text-red-500 text-xs dark:text-red-400">
						{state.fieldErrors.name[0]}
					</p>
				)}
			</div>

			<div className="space-y-1">
				<Label htmlFor="domain">Email domain</Label>
				<Input
					name="domain"
					type="text"
					id="domain"
					inputMode="url"
					placeholder="example.com"
				/>
				{state?.fieldErrors?.domain && (
					<p className="font-medium text-red-500 text-xs dark:text-red-400">
						{state.fieldErrors.domain[0]}
					</p>
				)}
			</div>

			<div className="space-y-1">
				<div className="flex items-baseline space-x-2">
					<Checkbox
						name="shouldAttachUsersByDomain"
						id="shouldAttachUsersByDomain"
						className="translate-y-0.5"
					/>
					<label htmlFor="shouldAttachUsersByDomain" className="space-y-1">
						<span className="font-medium text-sm leading-none">
							Auto-join new members
						</span>
						<p className="text-muted-foreground text-sm">
							this will automatically invite all members with same
							email domain to this organization
						</p>
					</label>
				</div>

				{state?.fieldErrors?.shouldAttachUsersByDomain && (
					<p className="font-medium text-red-500 text-xs dark:text-red-400">
						{state.fieldErrors.shouldAttachUsersByDomain[0]}
					</p>
				)}
			</div>

			<Button type="submit" className="w-full" disabled={isPending}>
				{isPending ? (
					<Loader2 className="size-4 animate-spin" />
				) : (
					"Save organization"
				)}
			</Button>
		</form>
	);
}
