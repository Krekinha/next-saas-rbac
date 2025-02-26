"use client";

import githubIcon from "@/assets/github-icon.svg";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useFormState } from "@/hooks/use-form-state";
import { AlertTriangle, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithGithub } from "../actions";
import { signUpAction } from "./actions";

export function SignUpForm() {
	const [state, isPending, formAction] = useFormState(signUpAction, onSuccess);

	const router = useRouter();

	function onSuccess() {
		router.push("/auth/sign-in");
	}
	return (
		<div className="space-y-4">
			<form onSubmit={formAction} className="space-y-4">
				{state.success === false && state.message && (
					<Alert variant="destructive">
						<AlertTriangle className="size-4" />
						<AlertTitle>Sign up failed</AlertTitle>
						<AlertDescription>
							<p>{state.message}</p>
						</AlertDescription>
					</Alert>
				)}
				<div className="space-y-1">
					<Label htmlFor="name">Name</Label>
					<Input name="name" id="name" />
					{state?.errors?.name && (
						<p className="font-medium text-red-500 text-xs dark:text-red-400">
							{state.errors.name[0]}
						</p>
					)}
				</div>

				<div className="space-y-1">
					<Label htmlFor="email">Email</Label>
					<Input name="email" type="email" id="email" />
					{state?.errors?.email && (
						<p className="font-medium text-red-500 text-xs dark:text-red-400">
							{state.errors.email[0]}
						</p>
					)}
				</div>

				<div className="space-y-1">
					<Label htmlFor="password">Password</Label>
					<Input name="password" type="password" id="password" />
					{state?.errors?.password && (
						<p className="font-medium text-red-500 text-xs dark:text-red-400">
							{state.errors.password[0]}
						</p>
					)}
				</div>

				<div className="space-y-1">
					<Label htmlFor="password_confirmation">Confirm password</Label>
					<Input
						name="password_confirmation"
						type="password"
						id="password_confirmation"
					/>
					{state?.errors?.password_confirmation && (
						<p className="font-medium text-red-500 text-xs dark:text-red-400">
							{state.errors.password_confirmation[0]}
						</p>
					)}
				</div>

				<Button type="submit" className="w-full" disabled={isPending}>
					{isPending ? (
						<Loader2 className="size-4 animate-spin" />
					) : (
						"Create account"
					)}
				</Button>

				<Button className="w-full" variant="link" size="sm" asChild>
					<Link href="/auth/sign-in">Already registered? Sign in</Link>
				</Button>
			</form>
			<Separator />
			<form action={signInWithGithub}>
				<Button
					type="submit"
					className="w-full"
					variant="outline"
					disabled={isPending}
				>
					<Image
						src={githubIcon}
						alt=""
						className="mr-2 size-4 dark:invert"
					/>
					Sign up with GitHub
				</Button>
			</form>
		</div>
	);
}
