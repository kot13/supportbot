"use client";

import { Input as HeroInput, type InputProps as HeroInputProps } from "@heroui/react";

type Props = HeroInputProps;

export function Input({
  className,
  label,
  description,
  endContent,
  variant,
  ...props
}: Props & {
  label?: string;
  description?: string;
  endContent?: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      {label ? <div className="text-sm opacity-80">{label}</div> : null}
      <div className="flex items-center gap-3">
        <HeroInput
          variant={variant ?? "primary"}
          className={["w-full", className].filter(Boolean).join(" ")}
          {...props}
        />
        {endContent ? <div className="shrink-0">{endContent}</div> : null}
      </div>
      {description ? <div className="text-xs opacity-70">{description}</div> : null}
    </div>
  );
}

