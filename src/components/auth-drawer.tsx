"use client";

import { useEffect, useState } from "react";
import { X, Eye, EyeOff, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthDrawerStore } from "@/lib/auth-drawer-store";
import {
  authErrorMessage,
  registerWithEmail,
  sendPasswordReset,
  signInWithEmail,
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

  // Forgot password state
  const [forgotMode, setForgotMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  // Reset everything when switching mode or closing
  useEffect(() => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setErrors({});
    setSubmitting(false);
    setForgotMode(false);
    setResetEmail("");
    setResetSent(false);
  }, [mode, isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  async function handleSubmit(e: React.FormEvent) {
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

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = resetEmail.trim();
    if (!trimmed) return;
    setSubmitting(true);
    try {
      await sendPasswordReset(trimmed);
      setResetSent(true);
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
          <div className="flex items-center gap-2">
            {forgotMode && (
              <button
                onClick={() => { setForgotMode(false); setResetSent(false); setResetEmail(""); }}
                className="rounded-full p-1 transition hover:bg-black/5 dark:hover:bg-white/10"
                aria-label="Back"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <h2 className="text-sm font-bold uppercase tracking-widest">
              {forgotMode ? "Reset Password" : mode === "signin" ? "Login" : "Register"}
            </h2>
          </div>
          <button
            onClick={close}
            aria-label="Close"
            className="rounded-full p-1.5 transition hover:bg-black/5 dark:hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">

          {/* ── Forgot password view ── */}
          {forgotMode ? (
            resetSent ? (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-2xl dark:bg-teal-950/40">
                  ✉️
                </div>
                <p className="text-sm font-medium">Check your email</p>
                <p className="text-sm text-black/55 dark:text-white/55">
                  We sent a password reset link to{" "}
                  <span className="font-medium text-black dark:text-white">{resetEmail}</span>.
                </p>
                <button
                  onClick={() => { setForgotMode(false); setResetSent(false); setResetEmail(""); }}
                  className="mt-2 text-sm text-teal-700 underline underline-offset-2 hover:text-teal-800"
                >
                  Back to login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} noValidate className="flex flex-col gap-4">
                <p className="text-sm text-black/55 dark:text-white/55">
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </p>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-black/60 dark:text-white/60">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={fieldCls}
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting || !resetEmail.trim()}
                  className="w-full rounded-full bg-teal-700 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:opacity-60"
                >
                  {submitting ? "Sending…" : "Send Reset Link"}
                </button>
              </form>
            )
          ) : (

          /* ── Login / Register view ── */
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
              <label className="text-xs font-medium text-black/60 dark:text-white/60">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                }}
                placeholder="you@example.com"
                className={`${fieldCls} ${errors.email ? "border-red-400" : ""}`}
              />
              {errors.email && (
                <span className="text-xs text-red-500">{errors.email}</span>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-black/60 dark:text-white/60">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                  }}
                  placeholder="••••••••"
                  className={`${fieldCls} pr-10 ${errors.password ? "border-red-400" : ""}`}
                />
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

            {/* Forgot password */}
            {mode === "signin" && (
              <button
                type="button"
                onClick={() => { setResetEmail(email); setForgotMode(true); }}
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
              {submitting ? "Please wait…" : mode === "signin" ? "Sign In" : "Register"}
            </button>

            {/* Switch mode */}
            <p className="mt-2 text-center text-sm text-black/60 dark:text-white/60">
              {mode === "signin" ? (
                <>
                  New customer?{" "}
                  <button
                    type="button"
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
                    type="button"
                    onClick={() => setMode("signin")}
                    className="font-medium text-black underline underline-offset-2 hover:text-teal-700 dark:text-white"
                  >
                    Login here
                  </button>
                </>
              )}
            </p>
          </form>
          )}
        </div>
      </div>
    </div>
  );
}
