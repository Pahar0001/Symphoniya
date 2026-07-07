"use client";

import { SessionProvider, signOut } from "next-auth/react";

// Кнопка выхода для публичного личного кабинета (клиент).
export function AccountSignOut() {
  return (
    <SessionProvider>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-brass"
      >
        Выйти из аккаунта
      </button>
    </SessionProvider>
  );
}
