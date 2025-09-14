import React from "react";
import { tv } from "tailwind-variants";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  className?: string;
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "muted"
    | "destructive"
    | "inherit";
  size?: "sm" | "md" | "lg" | "xl";
  underline?: "none" | "hover" | "always";
  weight?: "normal" | "medium" | "semibold" | "bold";
  children?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconOnly?: boolean;
  href?: string;
  visit?: boolean;
  remote?: boolean;
  replace?: boolean;
  external?: boolean;
}

const linkVariants = tv({
  base: [
    "inline-flex items-center gap-2 font-medium transition-all duration-200",
    "focus:outline-none",
  ],
  variants: {
    variant: {
      primary: ["text-indigo-600 hover:text-indigo-700"],
      secondary: ["text-gray-600 hover:text-gray-700", "focus:ring-gray-500"],
      accent: [
        "text-emerald-600 hover:text-emerald-700",
        "focus:ring-emerald-500",
      ],
      muted: ["text-gray-500 hover:text-gray-600", "focus:ring-gray-400"],
      destructive: ["text-rose-600 hover:text-rose-700", "focus:ring-rose-500"],
      inherit: ["text-current hover:opacity-80", "focus:ring-current"],
    },
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
    },
    underline: {
      none: "no-underline",
      hover: "no-underline hover:underline",
      always: "underline",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
    underline: "hover",
    weight: "medium",
  },
});

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      className,
      variant,
      size,
      underline,
      weight,
      children,
      leftIcon,
      rightIcon,
      iconOnly,
      href,
      visit = false,
      remote = false,
      replace = false,
      external = false,
      ...props
    },
    ref
  ) => {
    // Determine the navigation data attributes
    const getNavigationProps = (): Record<string, any> => {
      const navProps: Record<string, any> = {};

      if (external) {
        // External links don't need Superglue navigation
        navProps.target = "_blank";
        navProps.rel = "noopener noreferrer";
        return navProps;
      }

      if (visit) {
        navProps["data-sg-visit"] = true;
      }

      if (remote) {
        navProps["data-sg-remote"] = true;
      }

      if (replace) {
        navProps["data-sg-replace"] = true;
      }

      return navProps;
    };

    const linkContent = () => {
      if (iconOnly) {
        return leftIcon || rightIcon || children;
      }

      return (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      );
    };

    const navigationProps = getNavigationProps();

    return (
      <a
        ref={ref}
        href={href}
        className={linkVariants({
          variant,
          size,
          underline,
          weight,
          className,
        })}
        {...navigationProps}
        {...props}
      >
        {linkContent()}
      </a>
    );
  }
);

Link.displayName = "Link";

export default Link;
