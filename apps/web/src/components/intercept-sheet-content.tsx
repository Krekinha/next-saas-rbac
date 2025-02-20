"use client";

import * as SheetPrimitive from "@radix-ui/react-dialog";
import { type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { SheetOverlay, SheetPortal, sheetVariants } from "./ui/sheet";

interface InterceptSheetContentProps
	extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
		VariantProps<typeof sheetVariants> {}

export const InterceptSheetContent = React.forwardRef<
	React.ElementRef<typeof SheetPrimitive.Content>,
	InterceptSheetContentProps
>(({ side = "right", className, children, ...props }, ref) => {
	const router = useRouter();

	function onDismiss() {
		router.back();
	}

	return (
		<SheetPortal>
			<SheetOverlay />
			<SheetPrimitive.Content
				ref={ref}
				onEscapeKeyDown={onDismiss}
				onPointerDownOutside={onDismiss}
				className={cn(sheetVariants({ side }), className)}
				{...props}
			>
				{children}
				<button
					className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
					onClick={onDismiss}
				>
					<X className="h-4 w-4" />
					<span className="sr-only">Close</span>
				</button>
			</SheetPrimitive.Content>
		</SheetPortal>
	);
});
InterceptSheetContent.displayName = SheetPrimitive.Content.displayName;
