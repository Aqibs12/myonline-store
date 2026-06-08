"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isOwner: boolean;
}

const AuthContext = createContext<AuthContextValue>({ user: null, loading: true, isOwner: false });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const isOwner = useMemo(() => {
    const ownerUid = process.env.NEXT_PUBLIC_OWNER_UID;
    return Boolean(user && ownerUid && user.uid === ownerUid);
  }, [user]);

  return <AuthContext.Provider value={{ user, loading, isOwner }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
