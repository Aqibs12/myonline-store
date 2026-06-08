"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  authErrorMessage,
  registerWithEmail,
  signInWithEmail,
  signInWithGoogle,
} from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "signin") {
        await signInWithEmail(email, password);
        toast.success("Signed in");
      } else {
        await registerWithEmail(email, password);
        toast.success("Account created");
      }
      router.push("/");
    } catch (error) {
      toast.error(authErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogle() {
    setSubmitting(true);
    try {
      await signInWithGoogle();
      toast.success("Signed in with Google");
      router.push("/");
    } catch (error) {
      toast.error(authErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="text-2xl font-bold">{mode === "signin" ? "Sign in" : "Create an account"}</h1>
      <p className="mt-1 text-sm text-black/60 dark:text-white/60">
        {mode === "signin" ? "Welcome back. Sign in to continue." : "Sign up to track orders and check out faster."}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-orange-600 dark:border-white/20"
            placeholder="you@example.com"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Password
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-orange-600 dark:border-white/20"
            placeholder="••••••••"
          />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-60"
        >
          {mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

      <div className="my-4 flex items-center gap-3 text-xs text-black/40">
        <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
        OR
        <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
      </div>

      <button
        onClick={handleGoogle}
        disabled={submitting}
        className="rounded-lg border border-black/15 px-4 py-2.5 text-sm font-semibold transition hover:bg-black/5 disabled:opacity-60 dark:border-white/20 dark:hover:bg-white/10"
      >
        Continue with Google
      </button>

      <p className="mt-6 text-center text-sm text-black/60 dark:text-white/60">
        {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          onClick={() => setMode(mode === "signin" ? "register" : "signin")}
          className="font-semibold text-orange-600 hover:underline"
        >
          {mode === "signin" ? "Create one" : "Sign in"}
        </button>
      </p>

      <p className="mt-2 text-center text-xs text-black/40">
        <Link href="/" className="hover:underline">
          ← Back to store
        </Link>
      </p>
    </div>
  );
}
