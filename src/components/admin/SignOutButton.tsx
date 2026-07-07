"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-brass"
    >
      Выйти
    </button>
  );
}
