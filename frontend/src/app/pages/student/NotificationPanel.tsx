import React, { useEffect, useState, useCallback, useRef } from "react";
import { X, Bell, CheckCheck, Trash2, CreditCard, Gift, AlertCircle, Info } from "lucide-react";
import { apiFetch } from "../../config/api";

interface Notif {
  id: number;
  type: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAllRead?: () => void;
}

const TYPE_ICON: Record<string, { icon: React.ReactNode; bg: string; color: string }> = {
  pembayaran_spp: { icon: <CreditCard size={15} />, bg: "#EEF4FF", color: "#1677FF" },
  campaign:       { icon: <Gift size={15} />,       bg: "#FFF7E0", color: "#B07D00" },
  bantuan:        { icon: <Gift size={15} />,        bg: "#F6FFED", color: "#389E0D" },
  warning:        { icon: <AlertCircle size={15} />, bg: "#FFF2EE", color: "#EA4E0D" },
};

function getTypeStyle(type: string) {
  for (const key of Object.keys(TYPE_ICON)) {
    if (type.includes(key)) return TYPE_ICON[key];
  }
  return { icon: <Info size={15} />, bg: "#F5F7FA", color: "#595959" };
}

function relativeTime(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60)    return "Baru saja";
  if (diff < 3600)  return `${Math.floor(diff / 60)} mnt lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
}

export function NotificationPanel({ isOpen, onClose, onAllRead }: Props) {
  const [notifs, setNotifs]           = useState<Notif[]>([]);
  const [loading, setLoading]         = useState(false);
  const [deletingId, setDeletingId]   = useState<number | null>(null);
  const bubbleRef                     = useRef<HTMLDivElement>(null);

  /* ── Fetch ─────────────────────────────────────────── */
  const fetchNotifs = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await apiFetch("/notifications");
      const json = await res.json();
      setNotifs(json.data ?? []);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (isOpen) fetchNotifs();
  }, [isOpen, fetchNotifs]);

  /* ── Close on outside click & scroll ────────────────────────── */
  useEffect(() => {
    if (!isOpen) return;
    const clickHandler = (e: MouseEvent) => {
      if (bubbleRef.current && !bubbleRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const scrollHandler = (e: Event) => {
      // Don't close if the scroll event is inside the bubble itself
      if (bubbleRef.current && bubbleRef.current.contains(e.target as Node)) {
        return;
      }
      onClose();
    };
    // small delay so the opening click doesn't immediately close
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", clickHandler);
      // capture: true ensures we catch scroll events on any scrollable container, not just window
      window.addEventListener("scroll", scrollHandler, { capture: true, passive: true });
    }, 150);
    return () => { 
      clearTimeout(timer); 
      document.removeEventListener("mousedown", clickHandler); 
      window.removeEventListener("scroll", scrollHandler, { capture: true });
    };
  }, [isOpen, onClose]);

  /* ── Actions ───────────────────────────────────────── */
  const markRead = async (id: number) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    await apiFetch(`/notifications/${id}/read`, { method: "POST" }).catch(() => {});
  };

  const markAllRead = async () => {
    setNotifs(prev => prev.map(n => ({ ...n, is_read: true })));
    await apiFetch("/notifications/read-all", { method: "POST" }).catch(() => {});
    onAllRead?.();
  };

  const deleteNotif = async (id: number) => {
    setDeletingId(id);
    setNotifs(prev => prev.filter(n => n.id !== id));
    await apiFetch(`/notifications/${id}`, { method: "DELETE" }).catch(() => {});
    setDeletingId(null);
  };

  const unread = notifs.filter(n => !n.is_read).length;

  if (!isOpen) return null;

  return (
    <>
      {/* ── Invisible backdrop (no blur, just catch clicks) */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* ── Bubble container ── */}
      <div
        ref={bubbleRef}
        className="fixed z-50"
        style={{
          /* position: top-right of the 430px frame */
          top: "58px",
          right: "calc(50% - 215px + 16px)",
          width: "340px",
          maxHeight: "72vh",
          display: "flex",
          flexDirection: "column",
          background: "white",
          borderRadius: "20px",
          boxShadow: "0 12px 48px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)",
          animation: "bubblePop 0.22s cubic-bezier(0.34,1.56,0.64,1)",
          transformOrigin: "top right",
        }}
      >
        {/* ── Tail arrow pointing up-right ── */}
        <div
          style={{
            position: "absolute",
            top: -10,
            right: 16,
            width: 0,
            height: 0,
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderBottom: "10px solid white",
            filter: "drop-shadow(0 -2px 3px rgba(0,0,0,0.08))",
          }}
        />

        {/* ── Header ── */}
        <div
          className="flex items-center justify-between px-4 py-3 flex-shrink-0"
          style={{
            borderBottom: "1px solid #F0F0F0",
            borderRadius: "20px 20px 0 0",
            background: "linear-gradient(135deg, #EEF4FF 0%, #F8FBFF 100%)",
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "white", boxShadow: "0 2px 8px rgba(22,119,255,0.15)" }}
            >
              <Bell size={16} color="#1677FF" />
            </div>
            <div>
              <p style={{ fontWeight: 800, color: "#1A1A2E", fontSize: "0.9rem", lineHeight: 1.2 }}>
                Notifikasi
              </p>
              {unread > 0 ? (
                <p style={{ color: "#1677FF", fontSize: "0.65rem", fontWeight: 700 }}>
                  {unread} belum dibaca
                </p>
              ) : (
                <p style={{ color: "#8C8C8C", fontSize: "0.65rem", fontWeight: 600 }}>
                  Semua sudah dibaca
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl transition-all active:scale-95"
                style={{
                  background: "#EEF4FF",
                  color: "#1677FF",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  border: "1px solid #D6E4FF",
                }}
              >
                <CheckCheck size={11} />
                Baca Semua
              </button>
            )}
            {/* ── TOMBOL CLOSE ── */}
            <button
              onClick={onClose}
              className="flex items-center justify-center transition-all active:scale-90 hover:scale-105"
              style={{
                width: 30,
                height: 30,
                borderRadius: "10px",
                background: "#FF4D4F",
                boxShadow: "0 4px 12px rgba(255,77,79,0.35)",
                flexShrink: 0,
              }}
              aria-label="Tutup notifikasi"
            >
              <X size={14} color="white" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* ── Content ── */}
        <div
          className="flex-1 overflow-y-auto px-3 py-2.5"
          style={{ scrollbarWidth: "none" }}
        >
          {loading ? (
            <div className="space-y-2.5 py-1">
              {[1, 2].map(i => (
                <div key={i} className="flex gap-2.5 animate-pulse p-2">
                  <div className="w-9 h-9 rounded-xl flex-shrink-0" style={{ background: "#F0F0F0" }} />
                  <div className="flex-1 space-y-1.5 py-1">
                    <div className="h-2.5 rounded" style={{ background: "#F0F0F0", width: "55%" }} />
                    <div className="h-2.5 rounded" style={{ background: "#F0F0F0" }} />
                    <div className="h-2 rounded" style={{ background: "#F5F5F5", width: "30%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : notifs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: "#F5F7FA" }}
              >
                <Bell size={24} color="#D9D9D9" />
              </div>
              <p style={{ color: "#BFBFBF", fontSize: "0.8rem", fontWeight: 600 }}>
                Belum ada notifikasi
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifs.map((n) => {
                const s = getTypeStyle(n.type);
                const isDeleting = deletingId === n.id;
                return (
                  <div
                    key={n.id}
                    onClick={() => !n.is_read && markRead(n.id)}
                    className="flex gap-2.5 p-2.5 rounded-2xl transition-all cursor-pointer group"
                    style={{
                      background: n.is_read ? "#FAFAFA" : "#F0F5FF",
                      border: `1.5px solid ${n.is_read ? "#F0F0F0" : "#D6E4FF"}`,
                      opacity: isDeleting ? 0.3 : 1,
                      transform: isDeleting ? "scale(0.96)" : "scale(1)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {/* type icon */}
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: s.bg, color: s.color }}
                    >
                      {s.icon}
                    </div>

                    {/* text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <p
                          className="truncate"
                          style={{
                            fontWeight: n.is_read ? 600 : 800,
                            color: "#1A1A2E",
                            fontSize: "0.78rem",
                          }}
                        >
                          {n.title}
                        </p>
                        {!n.is_read && (
                          <div
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: "#1677FF" }}
                          />
                        )}
                      </div>
                      <p style={{ color: "#595959", fontSize: "0.7rem", lineHeight: 1.4 }}>
                        {n.body}
                      </p>
                      <p style={{ color: "#BFBFBF", fontSize: "0.62rem", marginTop: 2 }}>
                        {relativeTime(n.created_at)}
                      </p>
                    </div>

                    {/* delete button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteNotif(n.id); }}
                      className="flex-shrink-0 self-start opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 8,
                        background: "#FFF2EE",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #FFD8BF",
                      }}
                    >
                      <Trash2 size={12} color="#EA4E0D" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div
          className="px-4 py-2.5 flex-shrink-0"
          style={{ borderTop: "1px solid #F5F5F5", borderRadius: "0 0 20px 20px" }}
        >
          <p style={{ color: "#BFBFBF", fontSize: "0.62rem", textAlign: "center" }}>
            Klik notifikasi untuk menandai sudah dibaca
          </p>
        </div>
      </div>

      <style>{`
        @keyframes bubblePop {
          from { opacity: 0; transform: scale(0.85) translateY(-8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
      `}</style>
    </>
  );
}
