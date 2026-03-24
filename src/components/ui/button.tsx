import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import * as React from "react";
import { cn } from "../../utils/utils";

const buttonVariants = cva(
  "noflow nopan nodelete nodrag inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-70 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground  hover:bg-primary-hover",
        blue: "bg-blue-500 text-white hover:bg-blue-600",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-8 px-3 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  unstyled?: boolean;
  ignoreTitleCase?: boolean;
  shouldScale?: boolean;
}

function toTitleCase(text: string) {
  return text
    .split(" ")
    .map((word) =>
      word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : "",
    )
    .join(" ");
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      unstyled,
      size,
      loading,
      type,
      disabled,
      asChild = false,
      children,
      ignoreTitleCase = false,
      shouldScale = true,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    let newChildren = children;
    if (typeof children === "string") {
      newChildren = ignoreTitleCase ? children : toTitleCase(children);
    }
    // 使用显式开关控制点击缩放，避免隐式条件导致 shouldScale=false 失效。
    const shouldScaleButton = shouldScale;
    return (
      <>
        <Comp
          className={
            !unstyled
              ? cn(
                buttonVariants({ variant, size, className }),
                shouldScaleButton && "active:scale-[0.97]",
              )
              : cn(className)
          }
          disabled={loading || disabled}
          {...(asChild ? {} : { type: type || "button" })}
          ref={ref}
          {...props}
        >
          {loading ? (
            <span className="relative flex items-center justify-center">
              <span
                className={cn(
                  className,
                  "invisible flex items-center justify-center gap-2 p-0!",
                )}
              >
                {newChildren}
              </span>
              <span className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </span>
            </span>
          ) : (
            newChildren
          )}
        </Comp>
      </>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
