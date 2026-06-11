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

export interface CheckoutFieldErrors {
  fullName?: string;
  phone?: string;
  address?: string;
  city?: string;
}

// Pakistani mobile numbers: 03XXXXXXXXX, +923XXXXXXXXX, or 00923XXXXXXXXX
const PK_MOBILE_RE = /^(?:\+92|0092|0)3\d{9}$/;

export function validatePakistaniPhone(phone: string): string | undefined {
  const cleaned = phone.replace(/[\s-]/g, "");
  if (!cleaned) return "Phone number is required";
  if (!PK_MOBILE_RE.test(cleaned)) {
    return "Enter a valid Pakistani mobile number, e.g. 03XX-XXXXXXX";
  }
  return undefined;
}

export function validateCheckoutForm(
  fullName: string,
  phone: string,
  address: string,
  city: string
): CheckoutFieldErrors {
  const errors: CheckoutFieldErrors = {};

  if (!fullName.trim()) errors.fullName = "Full name is required";

  const phoneError = validatePakistaniPhone(phone);
  if (phoneError) errors.phone = phoneError;

  if (!address.trim()) errors.address = "Address is required";
  else if (address.trim().length < 10) errors.address = "Enter your full address (house/street, area)";

  if (!city.trim()) errors.city = "City is required";

  return errors;
}
