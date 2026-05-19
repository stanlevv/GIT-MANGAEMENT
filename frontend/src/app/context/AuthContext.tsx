// src/app/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiFetch } from "../config/api";

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

function laravelFetch(path: string, body: object): Promise<Response> {
  return apiFetch(path, { method: "POST", body: JSON.stringify(body) });
}

/** Normalisasi role dari Laravel ke role internal frontend */
function normalizeRole(rawRole: string): UserRole {
  const map: Record<string, UserRole> = {
    student:       "siswa",
    parent:        "siswa",
    donor:         "donatur",
    admin_sekolah: "sekolah",
  };
  return (map[rawRole] as UserRole) ?? (rawRole as UserRole);
}

const SESSION_KEY = "edufin_session";
const TOKEN_KEY   = "edufin_token";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]           = useState<User | null>(null);
  // isLoading hanya untuk validasi token saat pertama kali app dimuat
  const [isLoading, setIsLoading] = useState(true);

  // ── Validasi token saat app load ──────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }

    // Timeout 5 detik — jika backend mati, jangan stuck loading selamanya
    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), 5000);

    apiFetch("/auth/me", { method: "GET", signal: controller.signal })
      .then(async (res) => {
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error("Token invalid");
        const data = await res.json();
        // Support both UserResource format (data.data) and legacy format (data.user)
        const u = data.data ?? data.user;
        const s = u.students?.[0] || {};
        const normalized: User = {
          id:       String(u.id),
          name:     u.name,
          email:    u.email,
          role:     normalizeRole(u.role),
          avatar:   u.avatar,
          verified: true,
          nisn:       s.nisn,
          school:     s.school_name,
          class:      s.class_name,
          parentName: s.parent_name,
        };
        setUser(normalized);
        localStorage.setItem(SESSION_KEY, JSON.stringify(normalized));
      })
      .catch(() => {
        // Token expired, invalid, atau backend mati → bersihkan sesi
        clearTimeout(timeoutId);
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // ── Register ──────────────────────────────────────────────────────────────
  const register = async (payload: RegisterPayload): Promise<{ success: boolean; message: string }> => {
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
      if (data.token) localStorage.setItem(TOKEN_KEY, data.token);
      return { success: true, message: "Akun berhasil dibuat!" };
    } catch (err) {
      console.error("[REGISTER] Error:", err);
      return { success: false, message: "Tidak bisa terhubung ke server. Pastikan Laravel berjalan." };
    }
  };

  // ── Login ─────────────────────────────────────────────────────────────────
  // PENTING: isLoading TIDAK diubah di sini.
  // isLoading hanya untuk validasi token saat app pertama dimuat (useEffect di atas).
  // LoginPage sudah punya state `loading` sendiri untuk disable tombol submit.
  // Kalau setIsLoading(true) dipanggil di sini, AppLayout akan menyembunyikan
  // <Outlet> dan menampilkan spinner — navigate() yang dipanggil setelahnya tidak berefek.
  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string; role?: UserRole }> => {
    try {
      const res  = await laravelFetch("/auth/login", { email, password });
      const data = await res.json();

      if (res.ok && data.success) {
        if (data.token) localStorage.setItem(TOKEN_KEY, data.token);
        // Support both UserResource format (data.data) and legacy format (data.user)
        const u = data.data ?? data.user;
        const s = u.students?.[0] || {};
        const normalized: User = {
          id:       String(u.id),
          name:     u.name,
          email:    u.email,
          role:     normalizeRole(u.role),
          avatar:   u.avatar,
          verified: true,
          nisn:       s.nisn,
          school:     s.school_name,
          class:      s.class_name,
          parentName: s.parent_name,
        };
        setUser(normalized);
        localStorage.setItem(SESSION_KEY, JSON.stringify(normalized));
        return { success: true, message: "Login berhasil!", role: normalized.role };
      }
      return { success: false, message: data.message || "Email atau password salah." };
    } catch (err) {
      console.error("[LOGIN] Error:", err);
      return { success: false, message: "Tidak bisa terhubung ke server. Pastikan Laravel berjalan di http://127.0.0.1:8000" };
    }
  };

  // ── Login with Google ─────────────────────────────────────────────────────
  const loginWithGoogle = async (
    accessToken: string
  ): Promise<{ success: boolean; message: string; role?: UserRole }> => {
    try {
      const res  = await laravelFetch("/auth/google", { credential: accessToken });
      const data = await res.json();

      if (res.ok && data.success) {
        if (data.token) localStorage.setItem(TOKEN_KEY, data.token);
        const u = data.data ?? data.user;
        const normalized: User = {
          id:       String(u.id),
          name:     u.name,
          email:    u.email,
          role:     normalizeRole(u.role),
          avatar:   u.avatar,
          verified: true,
        };
        setUser(normalized);
        localStorage.setItem(SESSION_KEY, JSON.stringify(normalized));
        return { success: true, message: "Login Google berhasil!", role: normalized.role };
      }
      return { success: false, message: data.message || "Gagal login dengan Google." };
    } catch (err) {
      console.error("[GOOGLE LOGIN] Error:", err);
      return { success: false, message: "Tidak bisa terhubung ke server." };
    }
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      apiFetch("/auth/logout", { method: "POST" }).catch(() => {});
    }
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

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
