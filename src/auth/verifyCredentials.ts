import bcrypt from "bcryptjs";

import { AppError } from "@/src/observability/errors";
import { findAdminUserByLogin } from "@/src/db/adminUsers";

export async function verifyCredentials(login: string, password: string): Promise<{ adminUserId: number }> {
  const user = await findAdminUserByLogin(login);

  // Generic message to avoid disclosing whether login exists.
  const invalid = () => {
    throw new AppError("Invalid login or password", { code: "INVALID_CREDENTIALS", status: 401 });
  };

  if (!user) invalid();
  const u = user as NonNullable<typeof user>;

  if (u.disabled_at) {
    throw new AppError("Account disabled", { code: "ACCOUNT_DISABLED", status: 403 });
  }

  const ok = await bcrypt.compare(password, u.password_hash);
  if (!ok) invalid();

  return { adminUserId: u.id };
}

