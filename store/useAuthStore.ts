import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthStore {
  isAdminAuthenticated: boolean;
  adminEmail: string | null;
  isHydrated: boolean;

  // Actions
  loginAdmin: (email: string, password: string) => Promise<boolean>;
  logoutAdmin: () => Promise<void>;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAdminAuthenticated: false,
      adminEmail: null,
      isHydrated: false,

      loginAdmin: async (email: string, password: string) => {
        try {
          // Firebase Authentication
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
          set({
            isAdminAuthenticated: true,
            adminEmail: userCredential.user.email,
          });
          return true;
        } catch (error) {
          console.error("Login error:", error);
          return false;
        }
      },

      logoutAdmin: async () => {
        try {
          await signOut(auth);
          set({ isAdminAuthenticated: false, adminEmail: null });
        } catch (error) {
          console.error("Logout error:", error);
        }
      },

      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "admin-auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
