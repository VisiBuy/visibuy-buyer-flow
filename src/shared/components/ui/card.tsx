import * as React from "react";
import { cn } from "@/shared/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "visibuy-card p-4 md:p-6", // 16px / 24px padding options
        className
      )}
      {...props}
    />
  );
}
