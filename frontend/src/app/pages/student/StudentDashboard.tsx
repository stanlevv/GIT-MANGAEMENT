import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  Bell, ChevronRight, TrendingUp, CreditCard,
  CheckCircle, Clock, Zap, BookOpen, Heart, History, RefreshCw,
  GraduationCap, MapPin, User, PartyPopper, Flame
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useApi } from "../../hooks/useApi";
import { CampaignSubmissionForm } from "../../components/shared/CampaignSubmissionForm";
import { NotificationPanel } from "./NotificationPanel";
import { formatRupiah, formatK } from "../../lib/format";

// Premium SVG Hero Illustration
const HeroIllustration = () => (
  <svg width="160" height="140" viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -right-2 top-0 pointer-events-none select-none opacity-95">
    {/* Glow */}
    <ellipse cx="80" cy="110" rx="55" ry="18" fill="rgba(255,255,255,0.08)"/>
    {/* Coin stack back */}
    <ellipse cx="110" cy="98" rx="22" ry="8" fill="rgba(255,255,255,0.15)"/>
    <rect x="88" y="72" width="44" height="26" rx="4" fill="rgba(255,255,255,0.12)"/>
    <ellipse cx="110" cy="72" rx="22" ry="8" fill="rgba(255,255,255,0.2)"/>
    {/* Coin stack front */}
    <ellipse cx="110" cy="88" rx="22" ry="8" fill="rgba(255,255,255,0.18)"/>
    <rect x="88" y="62" width="44" height="26" rx="4" fill="rgba(255,255,255,0.15)"/>
    <ellipse cx="110" cy="62" rx="22" ry="8" fill="rgba(255,255,255,0.25)"/>
    {/* Book */}
    <rect x="28" y="55" width="52" height="64" rx="6" fill="rgba(255,255,255,0.18)"/>
    <rect x="28" y="55" width="26" height="64" rx="6" fill="rgba(255,255,255,0.12)"/>
    <line x1="54" y1="55" x2="54" y2="119" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
    {[0,1,2,3].map(i => <line key={i} x1="60" y1={68+i*10} x2="72" y2={68+i*10} stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round"/>)}
    {/* Cap */}
    <polygon points="54,18 80,30 54,42 28,30" fill="rgba(255,255,255,0.9)"/>
    <rect x="50" y="30" width="8" height="16" rx="2" fill="rgba(255,255,255,0.7)"/>
    <circle cx="54" cy="46" r="4" fill="#FDD504"/>
    {/* Stars */}
    <circle cx="20" cy="35" r="2.5" fill="rgba(255,255,255,0.6)"/>
    <circle cx="140" cy="28" r="2" fill="rgba(255,255,255,0.5)"/>
    <circle cx="148" cy="55" r="1.5" fill="rgba(255,255,255,0.4)"/>
    <circle cx="15" cy="70" r="1.5" fill="rgba(255,255,255,0.35)"/>
  </svg>
);

// ─── Types ──────────────────────────────────────────────────────────────────
interface BillItem { name: string; amount: number; }
interface Bill {
  id: number;
  student_id: number;
  month: string;
  status: "Lunas" | "Tertunggak" | "Menunggu Pembayaran";
  due_date: string;
  total_amount: number;
  items: BillItem[];
}
interface Student {
  id: number;
  name: string;
  nisn: string;
  school_name: string;
  class_name: string;
}
interface Campaign {
  id: number;
  title: string;
  target_amount: number;
  current_amount: number;
  image_url?: string;
  status: string;
}
interface Notification { id: number; type: string; title: string; body: string; is_read: boolean; }
interface BillsResponse { bills: Bill[]; students: Student[]; campaigns: Campaign[]; notifications: Notification[]; }

// ─── Custom SVG Bar Chart ────────────────────────────────────────────────────
function SvgBarChart({ months }: { months: { label: string; paid: boolean }[] }) {
  const W = 300, H = 100, paddingLeft = 36, paddingBottom = 20;
  const chartW = W - paddingLeft;
  const chartH = H - paddingBottom;
  const barW = 22;
  const gap  = (chartW - barW * months.length) / (months.length + 1);

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      {[0, 0.5, 1].map((tick) => {
        const y = chartH - tick * chartH;
        return (
          <g key={`ytick-${tick}`}>
            <line x1={paddingLeft} y1={y} x2={W} y2={y} stroke="#F0F0F0" strokeWidth={1} />
            <text x={paddingLeft - 4} y={y + 3.5} textAnchor="end" fontSize={8} fill="#BFBFBF">
              {tick === 0 ? "0" : tick === 0.5 ? "425rb" : "850rb"}
            </text>
          </g>
        );
      })}
      {months.map((d, i) => {
        const x    = paddingLeft + gap + i * (barW + gap);
        const barH = d.paid ? chartH : 8;
        const y    = chartH - barH;
        return (
          <g key={`bar-${d.label}`}>
            <rect x={x} y={y} width={barW} height={barH} fill={d.paid ? "#1677FF" : "#E8EDF5"} rx={5} ry={5} />
            <text x={x + barW / 2} y={chartH + 13} textAnchor="middle" fontSize={9} fill="#BFBFBF" fontWeight={600}>
              {d.label.substring(0, 3)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Donut Chart ─────────────────────────────────────────────────────────────
const COLORS = ["#1677FF", "#FDD504", "#52C41A", "#EA4E0D"];
function DonutChart({ items, total }: { items: BillItem[]; total: number }) {
  const cx = 55, cy = 55, outerR = 50, innerR = 33, gap = 0.03;
  function polarToCartesian(angle: number, r: number) {
    return { x: cx + r * Math.cos(angle - Math.PI / 2), y: cy + r * Math.sin(angle - Math.PI / 2) };
  }
  let startAngle = 0;
  const slices = items.map((d, idx) => {
    const angle = (d.amount / total) * 2 * Math.PI;
    const s = startAngle + gap / 2;
    const e = startAngle + angle - gap / 2;
    startAngle += angle;
    return { ...d, startAngle: s, endAngle: e, color: COLORS[idx % COLORS.length] };
  });
  return (
    <svg width={110} height={110} viewBox="0 0 110 110">
      {slices.map((s) => {
        const p1 = polarToCartesian(s.startAngle, outerR);
        const p2 = polarToCartesian(s.endAngle, outerR);
        const p3 = polarToCartesian(s.endAngle, innerR);
        const p4 = polarToCartesian(s.startAngle, innerR);
        const large = s.endAngle - s.startAngle > Math.PI ? 1 : 0;
        const d = [
          `M ${p1.x} ${p1.y}`,
          `A ${outerR} ${outerR} 0 ${large} 1 ${p2.x} ${p2.y}`,
          `L ${p3.x} ${p3.y}`,
          `A ${innerR} ${innerR} 0 ${large} 0 ${p4.x} ${p4.y}`,
          "Z",
        ].join(" ");
        return <path key={s.name} d={d} fill={s.color} />;
      })}
    </svg>
  );
}

// ─── Skeleton loader ─────────────────────────────────────────────────────────
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl ${className}`}
      style={{ background: "linear-gradient(90deg,#E8EDF5 25%,#F5F7FA 50%,#E8EDF5 75%)", backgroundSize: "200% 100%" }}
    />
  );
}

// ─── Component ───────────────────────────────────────────────────────────────
export function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showNotif, setShowNotif] = useState(false);
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [localUnread, setLocalUnread] = useState<number | null>(null);

  const { data: billsData, loading: billsLoading, error: billsError, refetch } =
    useApi<BillsResponse>("/student/bills");

  // ── Parse & normalize data from API ──────────────────────────────────────
  const rawBills  = billsData?.bills ?? [];
  const students  = billsData?.students ?? [];
  const campaigns = (billsData?.campaigns ?? []).slice(0, 2);
  const notifications = billsData?.notifications ?? [];
  // localUnread: null = pakai dari API, number = setelah user mark-all-read
  const unreadCount = localUnread !== null ? localUnread : notifications.filter(n => !n.is_read).length;

  // Normalize: ensure amounts are numbers, format due_date
  const bills: Bill[] = rawBills.map((b) => ({
    ...b,
    total_amount: Number(b.total_amount) || 0,
    items: (b.items ?? []).map((item) => ({
      ...item,
      amount: Number(item.amount) || 0,
    })),
  }));

  // Tagihan bulan ini (terbaru / belum lunas dulu)
  const activeBill = bills.find((b) => b.status !== "Lunas") ?? bills[0];
  const billBreakdown = activeBill?.items ?? [];
  const totalBill  = activeBill?.total_amount ?? 0;
  const isLunas    = activeBill?.status === "Lunas";

  // Data 6 bulan terakhir untuk chart
  const monthlyData = bills.slice(0, 6).reverse().map((b) => ({
    label: b.month.split(" ")[0], // "April" → "Apr"
    paid:  b.status === "Lunas",
  }));

  const totalBayarTahun = bills
    .filter((b) => b.status === "Lunas")
    .reduce((s, b) => s + Number(b.total_amount), 0);

  const streak = bills.reduce((s, b) => {
    if (b.status === "Lunas") return s + 1;
    return 0; // reset streak saat ada yang belum lunas
  }, 0);

  const student = students[0];

  /** Format due_date to readable string */
  const formatDueDate = (raw: string) => {
    try {
      return new Date(raw).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    } catch { return raw; }
  };

  const SHORTCUTS = [
    { icon: <CreditCard size={20} />, label: "Bayar SPP",  route: "/student/spp",         bg: "#EEF4FF", fg: "#1677FF" },
    { icon: <Zap size={20} />,        label: "Pinjaman",   route: "/student/loan",         bg: "#FFFBE6", fg: "#B07D00" },
    { icon: <Heart size={20} />,      label: "Donasi",     route: "/student/fundraising",  bg: "#FFF2EE", fg: "#EA4E0D" },
    { icon: <History size={20} />,    label: "Riwayat",    route: "/student/history",      bg: "#F0F7FF", fg: "#1677FF" },
  ];

  return (
    <div className="flex flex-col bg-white" style={{ minHeight: "100dvh" }}>

      {/* ── HEADER ─────────────────────────────────────────── */}
      <div
        className="relative px-6 pt-12 pb-6 overflow-hidden"
        style={{ background: "linear-gradient(145deg, #0D4DB5 0%, #0E7DD4 55%, #08A8E8 100%)" }}
      >
        {/* Background mesh */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 1px, transparent 1px), radial-gradient(circle at 20% 80%, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full opacity-10" style={{ background: "white" }} />
        <HeroIllustration />

        {/* Top Bar */}
        <div className="flex items-center justify-between mb-5 relative z-10">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white"
              style={{ background: "rgba(255,255,255,0.25)", fontSize: "1.1rem", fontWeight: 800 }}
            >
              {user?.name?.[0] ?? "U"}
            </div>
            <div>
              <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.75rem" }}>Selamat datang 👋</p>
              <p style={{ color: "white", fontWeight: 800, fontSize: "0.98rem" }}>{user?.name}</p>
            </div>
          </div>
          <div className="relative z-[60]">
            <button
              onClick={() => setShowNotif(true)}
              className="w-10 h-10 rounded-full flex items-center justify-center relative transition-all active:scale-90"
              style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}
            >
              <Bell size={19} color="white" />
              {unreadCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-white px-1"
                  style={{ background: "#EA4E0D", fontSize: "0.6rem", fontWeight: 800, boxShadow: "0 2px 6px rgba(234,78,13,0.5)" }}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Info badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4 relative z-10">
          <span className="px-3 py-1 rounded-full flex items-center gap-1.5"
            style={{ background: "rgba(255,255,255,0.18)", fontSize: "0.72rem", color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>
            <GraduationCap size={11} /> NISN: {student?.nisn ?? user?.nisn ?? "—"}
          </span>
          {(student?.class_name || user?.class) && (
            <span className="px-3 py-1 rounded-full flex items-center gap-1.5"
              style={{ background: "rgba(255,255,255,0.15)", fontSize: "0.72rem", color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>
              Kelas {student?.class_name ?? user?.class}
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full flex items-center gap-1"
            style={{ background: "rgba(82,196,26,0.28)", fontSize: "0.7rem", color: "#B7EB8F", fontWeight: 700 }}>
            ✓ Terverifikasi
          </span>
        </div>
        {(student?.school_name || user?.school) && (
          <div className="flex items-center gap-1.5 mb-3 relative z-10">
            <MapPin size={11} color="rgba(255,255,255,0.6)" />
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.72rem" }}>
              {student?.school_name ?? user?.school}
            </span>
          </div>
        )}

        {/* Tagihan Card */}
        <div
          className="rounded-3xl p-4 relative z-10"
          style={{
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.3)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          }}
        >
          {billsLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          ) : billsError ? (
            <div className="text-center py-2">
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.82rem" }}>Gagal memuat tagihan</p>
              <button onClick={refetch} className="mt-1 flex items-center gap-1 mx-auto"
                style={{ color: "white", fontSize: "0.75rem", opacity: 0.8 }}>
                <RefreshCw size={12} /> Coba lagi
              </button>
            </div>
          ) : activeBill ? (
            <>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <CreditCard size={13} color="rgba(255,255,255,0.8)" />
                  <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.75rem" }}>
                    Tagihan SPP {activeBill.month}
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full"
                  style={{
                    background: isLunas ? "rgba(82,196,26,0.35)" : "rgba(234,78,13,0.4)",
                    color: "white", fontSize: "0.68rem", fontWeight: 700
                  }}>
                  {isLunas ? "✓ Lunas" : "⚠ Tertunggak"}
                </span>
              </div>
              <p style={{ color: "white", fontSize: "1.9rem", fontWeight: 900, letterSpacing: "-1px" }}>
                {formatRupiah(totalBill)}
              </p>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", marginBottom: "12px" }}>
                Jatuh tempo: {formatDueDate(activeBill.due_date)}
              </p>
              {!isLunas && (
                <div className="flex gap-2.5">
                  <button
                    onClick={() => navigate("/student/spp")}
                    className="flex-1 py-2.5 rounded-xl transition-all active:scale-95"
                    style={{ background: "white", color: "#1677FF", fontWeight: 800, fontSize: "0.85rem" }}
                  >
                    Bayar Penuh
                  </button>
                  <button
                    onClick={() => navigate("/student/spp?mode=cicilan")}
                    className="flex-1 py-2.5 rounded-xl transition-all active:scale-95"
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      color: "white", fontWeight: 700, fontSize: "0.85rem",
                      border: "1px solid rgba(255,255,255,0.35)"
                    }}
                  >
                    Cicilan
                  </button>
                </div>
              )}
            </>
          ) : (
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.85rem", textAlign: "center" }} className="flex items-center justify-center gap-1">
              Tidak ada tagihan aktif <PartyPopper size={16} />
            </p>
          )}
        </div>
      </div>

      {/* ── BODY ──────────────────────────────────────────── */}
      <div className="pb-24" style={{ background: "#F3F6FB" }}>

        {/* ── STAT CARDS ─────────────────────────────────── */}
        <div className="px-5 pt-4 pb-2">
          <div className="grid grid-cols-3 gap-2.5">
            {[
              {
                label: "Dibayar\nTahun Ini",
                value: billsLoading ? "—" : formatK(totalBayarTahun),
                sub: `${bills.filter(b => b.status === "Lunas").length} bulan`,
                icon: <CheckCircle size={16} color="#52C41A" />,
                bg: "#F6FFED", accent: "#52C41A",
              },
              {
                label: "Tagihan\nBulan Ini",
                value: billsLoading ? "—" : formatK(totalBill),
                sub: activeBill?.status ?? "—",
                icon: <Clock size={16} color="#EA4E0D" />,
                bg: "#FFF2EE", accent: "#EA4E0D",
              },
              {
                label: "Streak\nTepat Waktu",
                value: billsLoading ? "—" : `${streak}x`,
                sub: "berturut-turut",
                icon: <TrendingUp size={16} color="#1677FF" />,
                bg: "#EEF4FF", accent: "#1677FF",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl p-3 flex flex-col gap-1"
                style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
              >
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                    {s.icon}
                  </div>
                </div>
                <p style={{ fontWeight: 800, color: "#242424", fontSize: "1.05rem", lineHeight: 1.1 }}>{s.value}</p>
                <p style={{ color: s.accent, fontSize: "0.65rem", fontWeight: 600 }}>{s.sub}</p>
                <p style={{ color: "#8C8C8C", fontSize: "0.62rem", whiteSpace: "pre-line", lineHeight: 1.3 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── SHORTCUTS ──────────────────────────────────── */}
        <div className="px-5 py-3">
          <p style={{ fontSize: "0.7rem", color: "#BFBFBF", fontWeight: 700, letterSpacing: "0.5px", marginBottom: "10px" }}>MENU CEPAT</p>
          <div className="grid grid-cols-4 gap-2">
            {SHORTCUTS.map((s) => (
              <button
                key={s.route}
                onClick={() => navigate(s.route)}
                className="flex flex-col items-center gap-1.5 transition-all active:scale-90 group"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-all group-active:shadow-none"
                  style={{
                    background: s.bg,
                    color: s.fg,
                    border: `1.5px solid ${s.fg}22`,
                    boxShadow: `0 4px 12px ${s.fg}22`,
                  }}
                >
                  {s.icon}
                </div>
                <span style={{ fontSize: "0.7rem", color: "#3A3A3A", fontWeight: 700, textAlign: "center", lineHeight: 1.2 }}>
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── TREN PEMBAYARAN BULANAN ───────────────────── */}
        <div className="px-5 mb-3">
          <div className="bg-white rounded-3xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <div>
                <p style={{ fontWeight: 800, color: "#242424", fontSize: "0.92rem" }}>Tren Pembayaran</p>
                <p style={{ color: "#8C8C8C", fontSize: "0.72rem" }}>6 bulan terakhir</p>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl" style={{ background: "#EEF4FF" }}>
                <div className="w-2 h-2 rounded-full" style={{ background: "#1677FF" }} />
                <span style={{ color: "#1677FF", fontSize: "0.68rem", fontWeight: 700 }}>
                  {bills.filter(b => b.status === "Lunas").length}/{bills.length} Lunas
                </span>
              </div>
            </div>
            <div className="mt-3" style={{ height: 110 }}>
              {billsLoading
                ? <Skeleton className="h-24 w-full" />
                : <SvgBarChart months={monthlyData} />
              }
            </div>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: "#1677FF" }} />
                <span style={{ fontSize: "0.68rem", color: "#8C8C8C" }}>Sudah Bayar</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: "#E8EDF5", border: "1px solid #D9D9D9" }} />
                <span style={{ fontSize: "0.68rem", color: "#8C8C8C" }}>Belum Bayar</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── RINCIAN BIAYA SPP ─────────────────────────── */}
        {(billBreakdown.length > 0 || billsLoading) && (
          <div className="px-5 mb-3">
            <div className="bg-white rounded-3xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p style={{ fontWeight: 800, color: "#242424", fontSize: "0.92rem" }}>Rincian Biaya SPP</p>
                  <p style={{ color: "#8C8C8C", fontSize: "0.72rem" }}>Komponen tagihan {activeBill?.month}</p>
                </div>
                <BookOpen size={18} color="#BFBFBF" />
              </div>

              {billsLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-5 w-full" />)}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0" style={{ width: 110, height: 110 }}>
                    <DonutChart items={billBreakdown} total={totalBill} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <p style={{ fontSize: "0.58rem", color: "#8C8C8C", fontWeight: 600 }}>Total</p>
                      <p style={{ fontSize: "0.72rem", color: "#1677FF", fontWeight: 800 }}>{formatK(totalBill)}</p>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2.5">
                    {billBreakdown.map((d, idx) => {
                      const pct = Math.round((d.amount / totalBill) * 100);
                      const color = COLORS[idx % COLORS.length];
                      return (
                        <div key={d.name}>
                          <div className="flex items-center justify-between mb-0.5">
                            <div className="flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                              <span style={{ fontSize: "0.75rem", color: "#595959", fontWeight: 600 }}>{d.name}</span>
                            </div>
                            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#242424" }}>
                              {formatRupiah(d.amount)}
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full" style={{ background: "#F0F0F0" }}>
                            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                          </div>
                        </div>
                      );
                    })}
                    <div className="flex items-center justify-between pt-1.5" style={{ borderTop: "1.5px solid #F0F0F0" }}>
                      <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#242424" }}>Total</span>
                      <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#1677FF" }}>
                        {formatRupiah(totalBill)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STREAK BADGE ─────────────────────────────── */}
        {streak > 0 && (
          <div className="px-5 mb-3">
            <div
              className="rounded-2xl p-4 flex items-center gap-3"
              style={{
                background: "linear-gradient(135deg, #0D5FD6 0%, #108EE9 100%)",
                boxShadow: "0 4px 20px rgba(22,119,255,0.25)",
              }}
            >
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.2)" }}>
                <TrendingUp size={20} color="white" />
              </div>
              <div className="flex-1">
                <p style={{ color: "white", fontWeight: 800, fontSize: "0.88rem" }} className="flex items-center gap-1">
                  Streak {streak} Bulan Berturut! <Flame size={16} color="#FDD504" />
                </p>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.72rem" }}>
                  Pertahankan pembayaran tepat waktu kamu
                </p>
              </div>
              <div className="flex flex-col items-center">
                <span style={{ color: "#FDD504", fontWeight: 900, fontSize: "1.4rem", lineHeight: 1 }}>{streak}</span>
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.6rem" }}>bulan</span>
              </div>
            </div>
          </div>
        )}

        {/* ── KAMPANYE DONASI ───────────────────────────── */}
        <div className="mb-4">
          <div className="px-5 flex items-center justify-between mb-2.5">
            <div>
              <p style={{ fontWeight: 800, color: "#242424", fontSize: "0.92rem" }}>Kampanye Donasi</p>
              <p style={{ color: "#8C8C8C", fontSize: "0.72rem" }}>Bantu sesama pelajar</p>
            </div>
            <button
              onClick={() => navigate("/student/fundraising")}
              className="flex items-center gap-1 px-3 py-1 rounded-xl"
              style={{ background: "#EEF4FF", color: "#1677FF", fontWeight: 700, fontSize: "0.75rem" }}
            >
              Lihat Semua <ChevronRight size={13} />
            </button>
          </div>

          <div className="flex gap-3 px-5 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
            {billsLoading
              ? [1, 2].map(i => <Skeleton key={i} className="flex-shrink-0 w-52 h-44" />)
              : campaigns.map((c) => {
                  const pct = Math.round((c.current_amount / c.target_amount) * 100);
                  return (
                    <div
                      key={c.id}
                      className="flex-shrink-0 w-52 rounded-2xl overflow-hidden bg-white shadow-sm cursor-pointer active:scale-95 transition-all"
                      onClick={() => navigate(`/donor/campaign/${c.id}`)}
                      style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}
                    >
                      <div className="relative h-28 overflow-hidden">
                        <img
                          src={c.image_url ?? "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400"}
                          alt={c.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.45), transparent)" }} />
                        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full"
                          style={{ background: "rgba(82,196,26,0.9)" }}>
                          <span style={{ fontSize: "0.6rem", color: "white", fontWeight: 700 }}>✓ Verified</span>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="line-clamp-2"
                          style={{ fontSize: "0.78rem", fontWeight: 700, color: "#242424", lineHeight: "1.3", marginBottom: "2px" }}>
                          {c.title}
                        </p>
                        <div className="w-full h-1.5 rounded-full mb-1" style={{ background: "#F0F0F0" }}>
                          <div className="h-full rounded-full"
                            style={{ width: `${Math.min(pct, 100)}%`, background: "linear-gradient(90deg,#1677FF,#108EE9)" }} />
                        </div>
                        <div className="flex justify-between">
                          <span style={{ fontSize: "0.68rem", color: "#1677FF", fontWeight: 700 }}>{pct}%</span>
                          <span style={{ fontSize: "0.68rem", color: "#8C8C8C" }}>dari {formatK(c.target_amount)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
            }
          </div>
        </div>

        {/* ── AKSI CEPAT ───────────────────────────────── */}
        <div className="px-5 mb-4">
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            {[
              { icon: <Heart size={20} color="#1677FF" />, label: "Ajukan Kampanye Donasi", sub: "Buat kampanye penggalangan dana", action: () => setShowCampaignForm(true) },
              { icon: <GraduationCap size={20} color="#1677FF" />, label: "Ajukan Bantuan SPP",     sub: "Gratis, tanpa bunga",             route: "/student/loan" },
              { icon: <User size={20} color="#1677FF" />, label: "Profil & Pengaturan",    sub: "Data pribadi & keamanan",          route: "/student/profile" },
            ].map((item, idx) => (
              <button
                key={item.label}
                onClick={() => item.action ? item.action() : navigate(item.route!)}
                className="w-full flex items-center gap-3 px-4 py-3.5 transition-all active:bg-gray-50"
                style={{ borderBottom: idx < 2 ? "1px solid #F5F7FA" : "none" }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "#EEF4FF", fontSize: "1.1rem" }}>
                  {item.icon}
                </div>
                <div className="flex-1 text-left">
                  <p style={{ fontWeight: 700, color: "#242424", fontSize: "0.88rem" }}>{item.label}</p>
                  <p style={{ color: "#8C8C8C", fontSize: "0.72rem" }}>{item.sub}</p>
                </div>
                <ChevronRight size={16} color="#BFBFBF" />
              </button>
            ))}
          </div>
        </div>

      </div>

      <CampaignSubmissionForm
        isOpen={showCampaignForm}
        onClose={() => setShowCampaignForm(false)}
        userRole="student"
      />

      {/* ── NOTIFICATION PANEL ─────────────────────────── */}
      <NotificationPanel
        isOpen={showNotif}
        onClose={() => setShowNotif(false)}
        onAllRead={() => setLocalUnread(0)}
      />
    </div>
  );
}