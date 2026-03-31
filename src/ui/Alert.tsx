export function Alert({
  title,
  message,
}: {
  title: string;
  message?: string;
}) {
  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-950/40 p-3">
      <div className="text-sm font-medium">{title}</div>
      {message ? <div className="mt-1 text-sm text-zinc-300">{message}</div> : null}
    </div>
  );
}

