"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
	const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  function updateField(field: keyof typeof form, value: string) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  }

  function createAccount() {
    if (!form.name || !form.email || !form.password) {
      setMessage("Please fill in all the fields.");
      return;
    }

    localStorage.setItem("eventmade-account", JSON.stringify(form));
    localStorage.setItem("eventmade-logged-in", "true");

    setMessage("Account created successfully!");
  }

  function signIn() {
    const savedAccount = localStorage.getItem("eventmade-account");

    if (!savedAccount) {
      setMessage("No account found. Please create an account first.");
      return;
    }

    const account: typeof form = JSON.parse(savedAccount);

    if (
  form.email === account.email &&
  form.password === account.password
) {
  localStorage.setItem("eventmade-logged-in", "true");
  setMessage("Signed in successfully!");

  setTimeout(() => {
    router.push("/");
  }, 500);
}
     else {
      setMessage("Email or password is incorrect.");
    }
  }

  function submitForm() {
    setMessage("");

    if (isSigningIn) {
      signIn();
    } else {
      createAccount();
    }
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-16">
      <div className="mx-auto max-w-md rounded-2xl border border-[var(--border)] bg-white p-7">
        <h1 className="text-3xl font-bold">
          {isSigningIn ? "Welcome back" : "Create an account"}
        </h1>

        <p className="mt-2 text-sm text-[var(--muted)]">
          {isSigningIn
            ? "Sign in to continue using EventMade."
            : "Join EventMade and keep track of your events."}
        </p>

        <div className="mt-7 space-y-4">
          {!isSigningIn && (
            <div>
              <label className="text-sm font-medium">Name</label>

              <input
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Your name"
                className="mt-2 w-full rounded-lg border border-[var(--border)] px-4 py-3 outline-none"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium">Email</label>

            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="you@example.com"
              className="mt-2 w-full rounded-lg border border-[var(--border)] px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>

            <input
              type="password"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              placeholder="Your password"
              className="mt-2 w-full rounded-lg border border-[var(--border)] px-4 py-3 outline-none"
            />
          </div>

          <button
            onClick={submitForm}
            className="w-full rounded-lg bg-[var(--brand)] px-4 py-3 font-semibold text-white"
          >
            {isSigningIn ? "Sign in" : "Create account"}
          </button>

          {message && (
            <p className="text-sm text-[var(--muted)]">{message}</p>
          )}
        </div>

        <button
          onClick={() => {
            setIsSigningIn(!isSigningIn);
            setMessage("");
          }}
          className="mt-6 w-full text-center text-sm text-[var(--brand)]"
        >
          {isSigningIn
            ? "Don't have an account? Create one"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </main>
  );
}