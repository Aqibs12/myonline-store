"use client";

import { useEffect, useState, type FormEvent } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthDrawerStore } from "@/lib/auth-drawer-store";
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

const fieldCls =
  "w-full rounded-lg border border-black/20 px-4 py-3 text-sm outline-none transition focus:border-teal-700 dark:border-white/20 dark:bg-neutral-800 dark:text-white";

export function AuthDrawer() {
  const { isOpen, mode, close, setMode } = useAuthDrawerStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<AuthFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  // Reset form when switching mode or closing
  useEffect(() => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setErrors({});
    setSubmitting(false);
  }, [mode, isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    const fieldErrors =
      mode === "register"
        ? validateRegisterForm(fullName || firstName, email, password, password)
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
        toast.success("Signed in successfully");
      } else {
        await registerWithEmail(fullName || firstName, email, password);
        toast.success("Account created");
      }
      close();
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
      close();
    } catch (error) {
      toast.error(authErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={close}
      />

      {/* Panel */}
      <div
        className={`absolute bottom-0 right-0 top-0 flex w-[420px] max-w-[95vw] flex-col bg-white shadow-2xl transition-transform duration-300 dark:bg-neutral-900 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-5 dark:border-white/10">
          <h2 className="text-sm font-bold uppercase tracking-widest">
            {mode === "signin" ? "Login" : "Register"}
          </h2>
          <button
            onClick={close}
            aria-label="Close"
            className="rounded-full p-1.5 transition hover:bg-black/5 dark:hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

            {/* Register-only: First + Last name */}
            {mode === "register" && (
              <>
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    className={fieldCls}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    className={fieldCls}
                  />
                  {errors.name && (
                    <span className="text-xs text-red-500">{errors.name}</span>
                  )}
                </div>
              </>
            )}

            {/* Email */}
            <div className="flex flex-col gap-1">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                  }}
                  placeholder={`Email ${""}`}
                  className={`${fieldCls} ${errors.email ? "border-red-400" : ""}`}
                />
                <span className="pointer-events-none absolute left-[53px] top-3 text-sm text-red-500">
                  *
                </span>
                <span className="pointer-events-none absolute left-[10px] top-3 text-sm text-black/50 dark:text-white/50">
                  Email
                </span>
              </div>
              {errors.email && (
                <span className="text-xs text-red-500">{errors.email}</span>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                  }}
                  className={`${fieldCls} pr-10 ${errors.password ? "border-red-400" : ""}`}
                  placeholder=" "
                />
                <span className="pointer-events-none absolute left-[10px] top-3 text-sm text-black/50 dark:text-white/50">
                  Password
                </span>
                <span className="pointer-events-none absolute left-[77px] top-3 text-sm text-red-500">
                  *
                </span>
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black/70 dark:text-white/40"
                  tabIndex={-1}
                  aria-label="Toggle password"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <span className="text-xs text-red-500">{errors.password}</span>
              )}
            </div>

            {/* Forgot password — sign in only */}
            {mode === "signin" && (
              <button
                type="button"
                className="w-fit text-left text-sm text-black/60 underline underline-offset-2 hover:text-black dark:text-white/60 dark:hover:text-white"
              >
                Forgot your password?
              </button>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="mt-1 w-full rounded-full bg-teal-700 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:opacity-60"
            >
              {submitting
                ? "Please wait…"
                : mode === "signin"
                ? "Sign In"
                : "Register"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3 text-xs text-black/35 dark:text-white/35">
            <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
            OR
            <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
          </div>

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={submitting}
            className="flex w-full items-center justify-center gap-3 rounded-full border border-black/15 py-3 text-sm font-medium transition hover:bg-black/5 disabled:opacity-60 dark:border-white/20 dark:hover:bg-white/10"
          >
            {/* Google icon */}
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          {/* Switch mode link */}
          <p className="mt-6 text-center text-sm text-black/60 dark:text-white/60">
            {mode === "signin" ? (
              <>
                New customer?{" "}
                <button
                  onClick={() => setMode("register")}
                  className="font-medium text-black underline underline-offset-2 hover:text-teal-700 dark:text-white"
                >
                  Create your account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setMode("signin")}
                  className="font-medium text-black underline underline-offset-2 hover:text-teal-700 dark:text-white"
                >
                  Login here
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
