import React from "react";
import { Link, LinkProps } from "react-router-dom";

import { buttonClasses, ButtonSize, ButtonVariant } from "./Button";

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  children?: React.ReactNode;
}

// For internal navigation (wraps react-router Link)
export function ButtonLink({
  to,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  className,
  children,
  ...props
}: BaseProps & Omit<LinkProps, "className">) {
  return (
    <Link to={to} className={buttonClasses(variant, size, className)} {...props}>
      {icon && iconPosition === "left" && icon}
      {children}
      {icon && iconPosition === "right" && icon}
    </Link>
  );
}

// For external / file links (plain <a>, supports download/target)
export function ButtonAnchor({
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  className,
  children,
  ...props
}: BaseProps & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={buttonClasses(variant, size, className)} {...props}>
      {icon && iconPosition === "left" && icon}
      {children}
      {icon && iconPosition === "right" && icon}
    </a>
  );
}
