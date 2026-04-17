import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { API_BASE, apiFetch } from "../../config/api";

export type UserRole = "siswa" | "sekolah" | "donatur" | "parent" | "donor" | "admin_sekolah";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  verified?: boolean;
  nisn?: string;
  school?: string;
  class?: string;
  parentName?: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  role: string;
  name: string;
  nisn?: string;
  school?: string;
  class?: string;
  parentName?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; role?: UserRole }>;
  loginWithGoogle: (credential: string) => Promise<{ success: boolean; message: string; role?: UserRole }>;
  logout: () => void;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; message: string }>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ─── API helper (dari config/api.ts) ─────────────────────────────────────────
function laravelFetch(path: string, body: object): Promise<Response> {
  return apiFetch(path, { method: "POST", body: JSON.stringify(body) });
}

// ─── Demo accounts (fallback, tidak perlu Laravel) ───────────────────────────
const DEMO_ACCOUNTS = [
  {
    email: "siswa@edufin.id",
    password: "demo123",
    user: {
      id: "demo-1",
      name: "Budi Santoso",
      email: "siswa@edufin.id",
      role: "siswa" as UserRole,
      verified: true,
      nisn: "0012345678",
      school: "SDN 3 Malang",
      class: "X IPA 1",
      parentName: "Hendra Santoso",
    },
  },
  {
    email: "sekolah@edufin.id",
    password: "demo123",
    user: {
      id: "demo-2",
      name: "Admin SDN 3 Malang",
      email: "sekolah@edufin.id",
      role: "sekolah" as UserRole,
      verified: true,
      school: "SDN 3 Malang",
    },
  },
  {
    email: "donatur@edufin.id",
    password: "demo123",
    user: {
      id: "demo-3",
      name: "Rina Permata",
      email: "donatur@edufin.id",
      role: "donatur" as UserRole,
      verified: true,
    },
  },
];

const SESSION_KEY = "edufin_session";
const TOKEN_KEY   = "edufin_token";

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  // Persist session
  useEffect(() => {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [user]);

  // ── Register (via Laravel API) ───────────────────────────
  const register = async (payload: RegisterPayload): Promise<{ success: boolean; message: string }> => {
    // Block demo emails
    if (DEMO_ACCOUNTS.some((a) => a.email.toLowerCase() === payload.email.toLowerCase())) {
      return { success: false, message: "Email sudah terdaftar. Silakan masuk." };
    }

    try {
      const res  = await laravelFetch("/auth/register", {
        name:       payload.name,
        email:      payload.email,
        password:   payload.password,
        role:       payload.role === "siswa" ? "parent" : "donor",
        nisn:       payload.nisn,
        school:     payload.school,
        class:      payload.class,
        parentName: payload.parentName,
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data.errors
          ? Object.values(data.errors).flat().join(", ")
          : data.message || "Gagal mendaftar.";
        return { success: false, message: msg };
      }
      // Simpan token dari Laravel
      if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
      }
      return { success: true, message: "Akun berhasil dibuat!" };
    } catch (err) {
      console.error("[REGISTER] Error:", err);
      return { success: false, message: "Tidak bisa terhubung ke server. Pastikan Laravel berjalan." };
    }
  };

  // ── Login (via Laravel API) ──────────────────────────────
  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string; role?: UserRole }> => {
    setIsLoading(true);
    try {
      // 1. Demo accounts (tidak perlu server)
      const demo = DEMO_ACCOUNTS.find(
        (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
      );
      if (demo) {
        setUser(demo.user);
        return { success: true, message: "Login berhasil!", role: demo.user.role };
      }

      // 2. Login via Laravel API
      const res  = await laravelFetch("/auth/login", { email, password });
      const data = await res.json();

      if (res.ok && data.success) {
        // Simpan token
        if (data.token) {
          localStorage.setItem(TOKEN_KEY, data.token);
        }
        const laravelUser: User = {
          id:    String(data.user.id),
          name:  data.user.name,
          email: data.user.email,
          role:  data.user.role === "parent" ? "siswa" : data.user.role,
          verified: true,
        };
        setUser(laravelUser);
        return { success: true, message: "Login berhasil!", role: laravelUser.role };
      }
      return { success: false, message: data.message || "Email atau password salah." };
    } catch (err) {
      console.error("[LOGIN] Error:", err);
      // Fallback: coba demo account
      const demo = DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === email.toLowerCase());
      if (demo) return { success: false, message: "Password salah. Coba lagi." };
      return { success: false, message: "Tidak bisa terhubung ke server. Gunakan akun demo." };
    } finally {
      setIsLoading(false);
    }
  };

  // ── Login with Google ────────────────────────────────────
  const loginWithGoogle = async (
    credential: string
  ): Promise<{ success: boolean; message: string; role?: UserRole }> => {
    setIsLoading(true);
    try {
      // Decode JWT payload dari Google (base64)
      const payload = JSON.parse(atob(credential.split(".")[1]));
      const googleUser: User = {
        id:       `google-${payload.sub}`,
        name:     payload.name || "Pengguna Google",
        email:    payload.email || "",
        role:     "donatur" as UserRole,
        avatar:   payload.picture,
        verified: payload.email_verified ?? true,
      };
      setUser(googleUser);
      return { success: true, message: "Login Google berhasil!", role: "donatur" };
    } catch (err) {
      console.error("[GOOGLE LOGIN] Error:", err);
      return { success: false, message: "Gagal login dengan Google. Coba lagi." };
    } finally {
      setIsLoading(false);
    }
  };

  // ── Logout ──────────────────────────────────────────────
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, logout, register, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
