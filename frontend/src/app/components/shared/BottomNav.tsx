import React from "react";
import { useNavigate, useLocation } from "react-router";
import { Home, ClipboardList, Heart, User, BarChart2 } from "lucide-react";

type Role = "siswa" | "sekolah" | "donatur";

const NAV_ITEMS: Record<Role, { icon: React.ReactNode; iconActive: React.ReactNode; label: string; key: string; route: string }[]> = {
  siswa: [
    {
      icon: <Home size={22} strokeWidth={1.7} />,
      iconActive: <Home size={22} strokeWidth={2.4} fill="rgba(22,119,255,0.12)" />,
      label: "Beranda",
      key: "home",
      route: "/student",
    },
    {
      icon: <ClipboardList size={22} strokeWidth={1.7} />,
      iconActive: <ClipboardList size={22} strokeWidth={2.4} />,
      label: "SPP",
      key: "spp",
      route: "/student/spp",
    },
    {
      icon: <Heart size={22} strokeWidth={1.7} />,
      iconActive: <Heart size={22} strokeWidth={2.4} fill="rgba(22,119,255,0.12)" />,
      label: "Donasi",
      key: "fundraising",
      route: "/student/fundraising",
    },
    {
      icon: <User size={22} strokeWidth={1.7} />,
      iconActive: <User size={22} strokeWidth={2.4} fill="rgba(22,119,255,0.12)" />,
      label: "Profil",
      key: "profile",
      route: "/student/profile",
    },
  ],
  sekolah: [
    {
      icon: <Home size={22} strokeWidth={1.7} />,
      iconActive: <Home size={22} strokeWidth={2.4} fill="rgba(22,119,255,0.12)" />,
      label: "Beranda",
      key: "home",
      route: "/school",
    },
    {
      icon: <ClipboardList size={22} strokeWidth={1.7} />,
      iconActive: <ClipboardList size={22} strokeWidth={2.4} />,
      label: "Tagihan",
      key: "bills",
      route: "/school/bills",
    },
    {
      icon: <BarChart2 size={22} strokeWidth={1.7} />,
      iconActive: <BarChart2 size={22} strokeWidth={2.4} />,
      label: "Laporan",
      key: "report",
      route: "/school/report",
    },
    {
      icon: <User size={22} strokeWidth={1.7} />,
      iconActive: <User size={22} strokeWidth={2.4} fill="rgba(22,119,255,0.12)" />,
      label: "Profil",
      key: "profile",
      route: "/school/profile",
    },
  ],
  donatur: [
    {
      icon: <Home size={22} strokeWidth={1.7} />,
      iconActive: <Home size={22} strokeWidth={2.4} fill="rgba(22,119,255,0.12)" />,
      label: "Beranda",
      key: "home",
      route: "/donor",
    },
    {
      icon: <Heart size={22} strokeWidth={1.7} />,
      iconActive: <Heart size={22} strokeWidth={2.4} fill="rgba(22,119,255,0.12)" />,
      label: "Kampanye",
      key: "campaigns",
      route: "/donor/campaigns",
    },
    {
      icon: <ClipboardList size={22} strokeWidth={1.7} />,
      iconActive: <ClipboardList size={22} strokeWidth={2.4} />,
      label: "Riwayat",
      key: "history",
      route: "/donor/history",
    },
    {
      icon: <User size={22} strokeWidth={1.7} />,
      iconActive: <User size={22} strokeWidth={2.4} fill="rgba(22,119,255,0.12)" />,
      label: "Profil",
      key: "profile",
      route: "/donor/profile",
    },
  ],
};

interface BottomNavProps {
  role: Role;
}

export function BottomNav({ role }: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const items = NAV_ITEMS[role];

  // Auto-detect active tab from current path
  const getActiveKey = () => {
    const path = location.pathname;
    // Exact match first
    const exact = items.find((i) => i.route === path);
    if (exact) return exact.key;
    // Prefix match (for nested routes like /student/spp, /student/fundraising)
    const prefix = items
      .filter((i) => i.route !== "/student" && i.route !== "/school" && i.route !== "/donor")
      .find((i) => path.startsWith(i.route));
    if (prefix) return prefix.key;
    // Default to home
    return items[0].key;
  };

  const active = getActiveKey();

  return (
    <div
      className="fixed bottom-0 left-1/2 w-full max-w-[430px] z-50"
      style={{ transform: "translateX(-50%)" }}
    >
      {/* iOS Liquid Glass container */}
      <div
        style={{
          background: "rgba(248, 248, 252, 0.78)",
          backdropFilter: "blur(28px) saturate(1.9) brightness(1.05)",
          WebkitBackdropFilter: "blur(28px) saturate(1.9) brightness(1.05)",
          borderTop: "0.5px solid rgba(255, 255, 255, 0.85)",
          boxShadow:
            "0 -0.5px 0 rgba(0,0,0,0.10), 0 -6px 24px rgba(0,0,0,0.055), inset 0 1px 0 rgba(255,255,255,0.6)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <div className="flex items-center justify-around px-1 pt-2 pb-2">
          {items.map((item) => {
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => navigate(item.route)}
                className="flex flex-col items-center gap-0.5 px-4 py-1 rounded-2xl transition-all active:scale-90"
                style={{
                  color: isActive ? "#1677FF" : "#9CA3AF",
                  minWidth: "64px",
                  position: "relative",
                }}
              >
                {/* Active glow dot */}
                {isActive && (
                  <span
                    className="absolute -top-1 left-1/2"
                    style={{
                      transform: "translateX(-50%)",
                      width: "20px",
                      height: "3px",
                      borderRadius: "0 0 3px 3px",
                      background: "#1677FF",
                      opacity: 0.9,
                    }}
                  />
                )}

                {/* Icon */}
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "36px",
                    height: "28px",
                    borderRadius: "12px",
                    background: isActive ? "rgba(22,119,255,0.10)" : "transparent",
                    transition: "all 0.2s ease",
                  }}
                >
                  {isActive ? item.iconActive : item.icon}
                </span>

                {/* Label */}
                <span
                  style={{
                    fontSize: "0.67rem",
                    fontWeight: isActive ? 700 : 500,
                    letterSpacing: isActive ? "-0.01em" : "0",
                    lineHeight: 1,
                    transition: "all 0.2s ease",
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
