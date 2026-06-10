import { doc, getDoc, setDoc } from "firebase/firestore";
import type { User } from "firebase/auth";
import { getFirebaseDb } from "@/lib/firebase";
import type { UserProfile } from "@/types";

const USERS = "users";

function toUserProfile(uid: string, data: Record<string, unknown>): UserProfile {
  return {
    uid,
    email: (data.email as string | null) ?? null,
    role: data.role as "owner" | "customer",
    createdAt: (data.createdAt as number) ?? Date.now(),
  };
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(getFirebaseDb(), USERS, uid));
  if (!snap.exists()) return null;
  return toUserProfile(snap.id, snap.data());
}

export async function ensureUserProfile(user: User): Promise<UserProfile> {
  const ref = doc(getFirebaseDb(), USERS, user.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return toUserProfile(snap.id, snap.data());

  const ownerUid = process.env.NEXT_PUBLIC_OWNER_UID;
  const profile: UserProfile = {
    uid: user.uid,
    email: user.email,
    role: ownerUid && user.uid === ownerUid ? "owner" : "customer",
    createdAt: Date.now(),
  };
  await setDoc(ref, {
    email: profile.email,
    role: profile.role,
    createdAt: profile.createdAt,
  });
  return profile;
}
