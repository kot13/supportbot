import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-sm space-y-6 pt-20">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Sign in</h1>
          <p className="text-sm text-zinc-400">Use your admin credentials.</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}

