import {} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {} from "lucide-react";

export default function CreateOrganization() {
	return (
		<div className="space-y-4">
			<h1 className="font-bold text-2xl">Create organization</h1>

			<form className="space-y-4">
				{/* {state.success === false && state.message && (
					<Alert variant="destructive">
						<AlertTriangle className="size-4" />
						<AlertTitle>Sign up failed</AlertTitle>
						<AlertDescription>
							<p>{state.message}</p>
						</AlertDescription>
					</Alert>
				)} */}
				<div className="space-y-1">
					<Label htmlFor="name">Organization name</Label>
					<Input name="name" id="name" />
					{/* {state?.fieldErrors?.name && (
						<p className="font-medium text-red-500 text-xs dark:text-red-400">
							{state.fieldErrors.name[0]}
						</p>
					)} */}
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
					{/* {state?.fieldErrors?.email && (
						<p className="font-medium text-red-500 text-xs dark:text-red-400">
							{state.fieldErrors.email[0]}
						</p>
					)} */}
				</div>

				<div className="space-y-1">
					<div className="flex items-baseline space-x-2">
						<Checkbox
							name="shouldAttachUsersByDomain"
							id="shouldAttachUsersByDomain"
							className="translate-y-0.5"
						/>
						<label
							htmlFor="shouldAttachUsersByDomain"
							className="space-y-1"
						>
							<span className="font-medium text-sm leading-none">
								Auto-join new members
							</span>
							<p className="text-muted-foreground text-sm">
								this will automatically invite all members with same
								email domain to this organization
							</p>
						</label>
					</div>
				</div>

				<Button type="submit" className="w-full">
					Save organization
				</Button>
			</form>
		</div>
	);
}
