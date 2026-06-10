"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import {
  authErrorMessage,
  registerWithEmail,
  signInWithEmail,
  signInWithGoogle,
} from "@/lib/auth";
import {
  validateRegisterForm,
  validateSignInForm,
  type AuthFieldErrors,
} from "@/lib/validation";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<AuthFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function switchMode(next: "signin" | "register") {
    setMode(next);
    setErrors({});
    setConfirmPassword("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const fieldErrors =
      mode === "register"
        ? validateRegisterForm(name, email, password, confirmPassword)
        : validateSignInForm(email, password);

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    setSubmitting(true);
    try {
      if (mode === "signin") {
        await signInWithEmail(email, password);
        toast.success("Signed in");
      } else {
        await registerWithEmail(name, email, password);
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

  const inputClass = (hasError: boolean) =>
    `rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus:border-orange-600 ${
      hasError ? "border-red-500" : "border-black/15 dark:border-white/20"
    }`;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="text-2xl font-bold">{mode === "signin" ? "Sign in" : "Create an account"}</h1>
      <p className="mt-1 text-sm text-black/60 dark:text-white/60">
        {mode === "signin" ? "Welcome back. Sign in to continue." : "Sign up to track orders and check out faster."}
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
        {mode === "register" && (
          <label className="flex flex-col gap-1 text-sm font-medium">
            Full name
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              className={inputClass(Boolean(errors.name))}
              placeholder="e.g. Ali Khan"
            />
            {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
          </label>
        )}

        <label className="flex flex-col gap-1 text-sm font-medium">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            className={inputClass(Boolean(errors.email))}
            placeholder="you@example.com"
          />
          {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium">
          Password
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              className={`${inputClass(Boolean(errors.password))} w-full pr-10`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-black/40 hover:text-black/70 dark:text-white/40 dark:hover:text-white/70"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password ? (
            <span className="text-xs text-red-500">{errors.password}</span>
          ) : (
            mode === "register" && (
              <span className="text-xs text-black/40">At least 8 characters, with letters and numbers.</span>
            )
          )}
        </label>

        {mode === "register" && (
          <label className="flex flex-col gap-1 text-sm font-medium">
            Confirm password
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
              className={inputClass(Boolean(errors.confirmPassword))}
              placeholder="••••••••"
            />
            {errors.confirmPassword && <span className="text-xs text-red-500">{errors.confirmPassword}</span>}
          </label>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-60"
        >
          {mode === "signin" ? "Sign in" : "Create account"}
        </button>

        {mode === "register" && (
          <p className="text-center text-xs text-black/40">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        )}
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
          onClick={() => switchMode(mode === "signin" ? "register" : "signin")}
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
