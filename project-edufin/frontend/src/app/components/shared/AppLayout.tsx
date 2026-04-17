import React from "react";
import { Outlet, useLocation, Navigate } from "react-router";
import { AuthProvider, useAuth } from "../../context/AuthContext";
import { BottomNav } from "./BottomNav";

const PUBLIC_PATHS = ["/", "/login", "/register"];

const ROLE_DEST: Record<string, string> = {
  siswa:   "/student",
  sekolah: "/school",
  donatur: "/donor",
  donor:   "/donor",
  parent:  "/student",
};

function getRoleDest(role?: string) {
  return ROLE_DEST[role ?? ""] ?? "/login";
}

function AppLayoutInner() {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const path = location.pathname;

  // ── Global loading spinner (Google OAuth / login in progress) ───────────
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg,#EEF4FF 0%,#E6F7FF 100%)" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#1677FF,#108EE9)", boxShadow: "0 8px 24px rgba(22,119,255,0.35)", fontSize: "1.6rem" }}>
            🎓
          </div>
          <div className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: "#C5D8FF", borderTopColor: "#1677FF" }} />
          <p style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>Memuat sesi...</p>
        </div>
      </div>
    );
  }

  // ── Auth guard — redirect unauthenticated users from protected pages ─────
  if (!user && !PUBLIC_PATHS.includes(path)) {
    return <Navigate to="/login" replace state={{ from: path }} />;
  }

  // ── Role guard — redirect logged-in users away from wrong role pages ─────
  if (user) {
    // Redirect logged-in users away from auth pages → their dashboard
    if (PUBLIC_PATHS.slice(1).includes(path)) {
      return <Navigate to={getRoleDest(user.role)} replace />;
    }

    // Cross-role protection
    if (path.startsWith("/student") && !["siswa", "parent"].includes(user.role)) {
      return <Navigate to={getRoleDest(user.role)} replace />;
    }
    if (path.startsWith("/school") && user.role !== "sekolah") {
      return <Navigate to={getRoleDest(user.role)} replace />;
    }
    if (path.startsWith("/donor") && !["donatur", "donor"].includes(user.role)) {
      return <Navigate to={getRoleDest(user.role)} replace />;
    }
  }

  // ── Show BottomNav only for authenticated, non-public, role pages ────────
  const showNav =
    !!user &&
    !PUBLIC_PATHS.includes(path) &&
    (path.startsWith("/student") || path.startsWith("/school") || path.startsWith("/donor"));

  const role =
    user?.role === "sekolah" ? "sekolah"
    : user?.role === "donatur" || user?.role === "donor" ? "donatur"
    : "siswa";

  return (
    <div
      className="min-h-screen flex items-start justify-center"
      style={{ background: "linear-gradient(135deg, #EEF4FF 0%, #E6F7FF 100%)" }}
    >
      <div
        className="relative w-full max-w-[430px] shadow-2xl"
        style={{ minHeight: "100dvh", background: "white" }}
      >
        <Outlet />
        {showNav && <BottomNav role={role} />}
      </div>
    </div>
  );
}

export function AppLayout() {
  return (
    <AuthProvider>
      <AppLayoutInner />
    </AuthProvider>
  );
}