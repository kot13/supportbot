import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: Props) {
  const base =
    "w-full rounded-md bg-zinc-950/40 px-3 py-2 text-sm text-zinc-100 ring-1 ring-zinc-800 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-400";
  return <input className={[base, className].filter(Boolean).join(" ")} {...props} />;
}

