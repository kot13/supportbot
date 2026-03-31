import { requireAuth } from "@/src/auth/requireAuth";
import { Sidebar } from "@/src/ui/Sidebar";

export default async function PanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAuth();

  return (
    <div className="min-h-screen">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 md:grid-cols-[260px_1fr]">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

