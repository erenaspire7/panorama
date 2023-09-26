import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const globalStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      setAuthState: (val) => set({ isAuthenticated: val }),
    }),
    {
      name: "panorama-store",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export { globalStore };
