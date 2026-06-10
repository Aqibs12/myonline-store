"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { ensureUserProfile } from "@/lib/users";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isOwner: boolean;
}

const AuthContext = createContext<AuthContextValue>({ user: null, loading: true, isOwner: false });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (u) => {
      setUser(u);
      setLoading(false);
      if (u) {
        ensureUserProfile(u)
          .then((profile) => setIsOwner(profile.role === "owner"))
          .catch((error) => {
            console.error("ensureUserProfile failed:", error);
            setIsOwner(false);
          });
      } else {
        setIsOwner(false);
      }
    });
    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={{ user, loading, isOwner }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
