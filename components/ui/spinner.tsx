import React from "react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
    size?: "sm" | "md" | "lg";
    className?: string;
    color?: "primary" | "secondary" | "white";
}

export function Spinner({
    size = "md",
    className,
    color = "primary",
}: SpinnerProps) {
    const sizeClasses = {
        sm: "h-4 w-4 border-2",
        md: "h-8 w-8 border-3",
        lg: "h-12 w-12 border-4",
    };

    const colorClasses = {
        primary: "border-blue-500 border-t-transparent",
        secondary: "border-gray-300 border-t-transparent",
        white: "border-white border-t-transparent",
    };

    return (
        <div
            className={cn(
                "animate-spin rounded-full",
                sizeClasses[size],
                colorClasses[color],
                className
            )}
        />
    );
} 