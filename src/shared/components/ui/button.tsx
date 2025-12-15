import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand.primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 ring-offset-neutral-50",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-primary text-brand-primary-foreground hover:bg-[#0069D9] active:opacity-90",
        secondary:
          "border border-brand-primary bg-neutral-50 text-brand-primary hover:bg-neutral-100 active:opacity-90",
        ghost: "text-neutral-800 hover:bg-neutral-100 active:opacity-90",
        danger:
          "bg-brand-danger text-brand-danger-foreground hover:bg-[#C82333] active:opacity-90",
      },
      size: {
        lg: "h-14 px-6 text-base rounded-[12px]", // 56px, 0 24px, 16px, 12px
        md: "h-12 px-5 text-base rounded-[10px]", // 48px, 0 20px, 16px, 10px
        sm: "h-10 px-4 text-sm rounded-[8px]", // 40px, 0 16px, 14px, 8px
        icon: "h-10 w-10 rounded-[10px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
