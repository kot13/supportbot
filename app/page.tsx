export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-2xl space-y-4">
        <h1 className="text-2xl font-semibold">supportbot</h1>
        <p className="text-sm text-zinc-300">
          Admin panel and Telegram broadcast system. Sign in at{" "}
          <a className="font-mono text-indigo-300 hover:underline" href="/login">
            /login
          </a>
          .
        </p>
      </div>
    </main>
  );
}

