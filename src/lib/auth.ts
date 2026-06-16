import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type UserCredential,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

const googleProvider = new GoogleAuthProvider();

export function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(getFirebaseAuth(), email, password);
}

export async function registerWithEmail(name: string, email: string, password: string): Promise<UserCredential> {
  const credential = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
  await updateProfile(credential.user, { displayName: name.trim() });
  return credential;
}

export function signInWithGoogle() {
  return signInWithPopup(getFirebaseAuth(), googleProvider);
}

export function logOut() {
  return signOut(getFirebaseAuth());
}

export function sendPasswordReset(email: string) {
  return import("firebase/auth").then(({ sendPasswordResetEmail }) =>
    sendPasswordResetEmail(getFirebaseAuth(), email)
  );
}

export function authErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "code" in error) {
    const code = String((error as { code: unknown }).code);
    switch (code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Invalid email or password.";
      case "auth/email-already-in-use":
        return "An account with this email already exists.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      case "auth/invalid-email":
        return "Enter a valid email address.";
      case "auth/too-many-requests":
        return "Too many attempts. Please wait a moment and try again.";
      case "auth/network-request-failed":
        return "Network error. Check your connection and try again.";
      case "auth/popup-closed-by-user":
        return "Sign-in was cancelled.";
      default:
        return "Something went wrong. Please try again.";
    }
  }
  return "Something went wrong. Please try again.";
}
