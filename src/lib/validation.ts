export interface AuthFieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return "Email is required";
  if (!EMAIL_RE.test(email.trim())) return "Enter a valid email address";
  return undefined;
}

export function validateRegisterForm(
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): AuthFieldErrors {
  const errors: AuthFieldErrors = {};

  if (!name.trim()) errors.name = "Full name is required";
  else if (name.trim().length < 2) errors.name = "Name must be at least 2 characters";

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  if (!password) errors.password = "Password is required";
  else if (password.length < 8) errors.password = "Password must be at least 8 characters";
  else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    errors.password = "Password must contain both letters and numbers";
  }

  if (!confirmPassword) errors.confirmPassword = "Please confirm your password";
  else if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match";

  return errors;
}

export function validateSignInForm(email: string, password: string): AuthFieldErrors {
  const errors: AuthFieldErrors = {};

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  if (!password) errors.password = "Password is required";

  return errors;
}
