"use client";

import { Button as HeroButton, type ButtonProps as HeroButtonProps } from "@heroui/react";

type Props = Omit<HeroButtonProps, "color" | "variant"> & {
  variant?: "primary" | "secondary";
  disabled?: boolean;
};

export function Button({ variant = "primary", disabled, isDisabled, ...props }: Props) {
  const heroVariant = variant === "primary" ? "primary" : "secondary";

  return (
    <HeroButton
      variant={heroVariant}
      isDisabled={disabled ?? isDisabled}
      className={[
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        props.className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

