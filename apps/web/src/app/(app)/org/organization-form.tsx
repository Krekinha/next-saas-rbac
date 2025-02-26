"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState } from "@/hooks/use-form-state";
import type { OrganizationSchema } from "@/lib/utils";
import { AlertTriangle, CircleCheck, Loader2 } from "lucide-react";
import { createOrganizationAction, updateOrganizationAction } from "./actions";

interface organizationFormProps {
	isUpdating?: boolean;
	initialData?: OrganizationSchema;
}

export function OrganizationForm({
	isUpdating = false,
	initialData,
}: organizationFormProps) {
	const formAction = isUpdating
		? updateOrganizationAction
		: createOrganizationAction;

	const [{ success, message, errors }, handleSubmit, isPending] =
		useFormState(formAction);

	return (
		// <>testeform</>
		<form onSubmit={handleSubmit} className="space-y-4">
			{success === false && message && (
				<Alert variant="destructive">
					<AlertTriangle className="size-4" />
					<AlertTitle>Save organization failed</AlertTitle>
					<AlertDescription>
						<p>{message}</p>
					</AlertDescription>
				</Alert>
			)}

			{success === true && message && (
				<Alert variant="success">
					<CircleCheck className="size-4" />
					<AlertTitle>Success!</AlertTitle>
					<AlertDescription>
						<p>{message}</p>
					</AlertDescription>
				</Alert>
			)}
			<div className="space-y-1">
				<Label htmlFor="name">Organization name</Label>
				<Input name="name" id="name" defaultValue={initialData?.name} />
				{errors?.name && (
					<p className="font-medium text-red-500 text-xs dark:text-red-400">
						{errors.name[0]}
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
					defaultValue={initialData?.domain ?? undefined}
				/>
				{errors?.domain && (
					<p className="font-medium text-red-500 text-xs dark:text-red-400">
						{errors.domain[0]}
					</p>
				)}
			</div>

			<div className="space-y-1">
				<div className="flex items-baseline space-x-2">
					<Checkbox
						name="shouldAttachUsersByDomain"
						id="shouldAttachUsersByDomain"
						className="translate-y-0.5"
						defaultChecked={initialData?.shouldAttachUsersByDomain}
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

				{errors?.shouldAttachUsersByDomain && (
					<p className="font-medium text-red-500 text-xs dark:text-red-400">
						{errors.shouldAttachUsersByDomain[0]}
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
