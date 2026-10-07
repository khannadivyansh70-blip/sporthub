"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const syncLoginState = () => {
      setIsLoggedIn(localStorage.getItem("eventmade-logged-in") === "true");
    };

    syncLoginState();
    window.addEventListener("storage", syncLoginState);

    return () => window.removeEventListener("storage", syncLoginState);
  }, [pathname]);
  if (pathname === "/signin" || pathname === "/signup") {
    return <>{children}</>;
  }
  if (isLoggedIn === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <p className="text-sm text-[var(--muted)]">Loading EventMade...</p>
      </main>
    );
  }

  if (!isLoggedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6">
        <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-white p-8 text-center">
          <h1 className="text-3xl font-bold">Welcome to EventMade</h1>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Sign in to discover events, join games and manage your activity.
          </p>

          <div className="mt-7 space-y-3">
            <Link
              href="/signup"
              className="block w-full rounded-lg bg-[var(--brand)] px-4 py-3 font-semibold text-white"
            >
              Create an account
            </Link>
            <Link
              href="/signin"
              className="block w-full rounded-lg border border-[var(--border)] px-4 py-3 font-semibold"
            >
              Sign in
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}