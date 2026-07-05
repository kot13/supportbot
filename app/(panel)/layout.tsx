import { requireAuth } from "@/src/auth/requireAuth";
import { PanelShell } from "@/src/ui/PanelShell";

export default async function PanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAuth();

  return <PanelShell>{children}</PanelShell>;
}
