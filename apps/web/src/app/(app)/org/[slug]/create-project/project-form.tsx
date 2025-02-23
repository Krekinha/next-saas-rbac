"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormState } from "@/hooks/use-form-state";
import { AlertTriangle, CircleCheck, Loader2 } from "lucide-react";
import { createProjectAction } from "./actions";

export function ProjectForm() {
	const [state, isPending, formAction] = useFormState(
		createProjectAction,
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
					<AlertTitle>Save project failed!</AlertTitle>
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
				<Label htmlFor="name">Project name</Label>
				<Input name="name" id="name" />
				{state?.fieldErrors?.name && (
					<p className="font-medium text-red-500 text-xs dark:text-red-400">
						{state.fieldErrors.name[0]}
					</p>
				)}
			</div>

			<div className="space-y-1">
				<Label htmlFor="description">Description</Label>
				<Textarea name="description" id="description" />
				{state?.fieldErrors?.description && (
					<p className="font-medium text-red-500 text-xs dark:text-red-400">
						{state.fieldErrors.description[0]}
					</p>
				)}
			</div>

			<Button type="submit" className="w-full" disabled={isPending}>
				{isPending ? (
					<Loader2 className="size-4 animate-spin" />
				) : (
					"Save project"
				)}
			</Button>
		</form>
	);
}
