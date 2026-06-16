import { create } from "zustand";

interface AuthDrawerState {
  isOpen: boolean;
  mode: "signin" | "register";
  open: (mode?: "signin" | "register") => void;
  close: () => void;
  setMode: (mode: "signin" | "register") => void;
}

export const useAuthDrawerStore = create<AuthDrawerState>()((set) => ({
  isOpen: false,
  mode: "signin",
  open: (mode = "signin") => set({ isOpen: true, mode }),
  close: () => set({ isOpen: false }),
  setMode: (mode) => set({ mode }),
}));
