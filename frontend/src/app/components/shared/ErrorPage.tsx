import React, { useEffect, useState } from "react";
import { useNavigate, useRouteError, isRouteErrorResponse } from "react-router";
import { Home, ArrowLeft, RefreshCw, WifiOff, ShieldOff, ServerCrash, SearchX } from "lucide-react";

// ─── Error Config Map ─────────────────────────────────────────────────────────
interface ErrorConfig {
  code: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  accentColor: string;
  bgColor: string;
  tip: string;
}

function getErrorConfig(status?: number, isOffline?: boolean): ErrorConfig {
  if (isOffline) {
    return {
      code: "Offline",
      title: "Tidak Ada Koneksi",
      desc: "Perangkat kamu tidak terhubung ke internet. Periksa Wi-Fi atau data seluler kamu, lalu coba lagi.",
      icon: <WifiOff size={52} color="#1677FF" />,
      accentColor: "#1677FF",
      bgColor: "#EEF4FF",
      tip: "Pastikan Wi-Fi atau data aktif, lalu klik 'Coba Lagi'.",
    };
  }

  switch (status) {
    case 401:
      return {
        code: "401",
        title: "Akses Ditolak",
        desc: "Kamu perlu masuk ke akun EDUFIN untuk mengakses halaman ini. Silakan login terlebih dahulu.",
        icon: <ShieldOff size={52} color="#EA4E0D" />,
        accentColor: "#EA4E0D",
        bgColor: "#FFF2EE",
        tip: "Sesi kamu mungkin sudah berakhir. Login ulang untuk melanjutkan.",
      };
    case 403:
      return {
        code: "403",
        title: "Dilarang Masuk",
        desc: "Akun kamu tidak memiliki izin untuk mengakses halaman ini. Hubungi admin jika ini sebuah kesalahan.",
        icon: <ShieldOff size={52} color="#EA4E0D" />,
        accentColor: "#EA4E0D",
        bgColor: "#FFF2EE",
        tip: "Halaman ini hanya bisa diakses oleh peran tertentu (misal: admin sekolah).",
      };
    case 500:
    case 502:
    case 503:
      return {
        code: String(status),
        title: "Server Bermasalah",
        desc: "Terjadi kesalahan di sisi server kami. Tim teknis sudah diberitahu dan sedang memperbaikinya.",
        icon: <ServerCrash size={52} color="#595959" />,
        accentColor: "#595959",
        bgColor: "#F5F7FA",
        tip: "Tunggu beberapa saat lalu coba reload halaman. Masalah biasanya teratasi dalam hitungan menit.",
      };
    default:
      return {
        code: "404",
        title: "Halaman Tidak Ditemukan",
        desc: "Halaman yang kamu cari tidak ada atau mungkin telah dipindahkan. Periksa kembali URL yang kamu masukkan.",
        icon: <SearchX size={52} color="#1677FF" />,
        accentColor: "#1677FF",
        bgColor: "#EEF4FF",
        tip: "Coba kembali ke beranda dan navigasi dari sana.",
      };
  }
}

// ─── Floating Particles ───────────────────────────────────────────────────────
function Particles({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[
        { size: 6,  top: "15%", left: "10%",  delay: "0s",    dur: "3s" },
        { size: 4,  top: "25%", left: "85%",  delay: "0.5s",  dur: "4s" },
        { size: 8,  top: "60%", left: "8%",   delay: "1s",    dur: "3.5s" },
        { size: 5,  top: "70%", left: "80%",  delay: "1.5s",  dur: "4.5s" },
        { size: 3,  top: "45%", left: "92%",  delay: "0.8s",  dur: "2.8s" },
        { size: 7,  top: "80%", left: "20%",  delay: "2s",    dur: "3.2s" },
      ].map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            top: p.top,
            left: p.left,
            background: color,
            opacity: 0.2,
            animation: `float ${p.dur} ${p.delay} ease-in-out infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function ErrorPage({ forceStatus }: { forceStatus?: number }) {
  const navigate = useNavigate();
  const routeError = useRouteError?.();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const onOnline  = () => setIsOffline(false);
    const onOffline = () => setIsOffline(true);
    window.addEventListener("online",  onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online",  onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  // Determine status code
  let status: number | undefined = forceStatus;
  if (!status && routeError) {
    if (isRouteErrorResponse(routeError)) status = routeError.status;
    else if ((routeError as any)?.status) status = (routeError as any).status;
  }

  const config = getErrorConfig(status, isOffline);

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  return (
    <div
      className="min-h-screen flex items-start justify-center"
      style={{ background: "linear-gradient(135deg,#EEF4FF 0%,#E6F7FF 100%)" }}
    >
      <div
        className="relative w-full max-w-[430px] flex flex-col items-center justify-center min-h-screen px-6 overflow-hidden"
        style={{ background: "white" }}
      >
        <Particles color={config.accentColor} />

        {/* ── Decorative Circles ─────────────────────────────── */}
        <div
          className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-5"
          style={{ background: config.accentColor, transform: "translate(30%,-30%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-5"
          style={{ background: config.accentColor, transform: "translate(-30%,30%)" }}
        />

        {/* ── Icon Area ──────────────────────────────────────── */}
        <div className="relative mb-6">
          {/* Glow ring */}
          <div
            className="absolute inset-0 rounded-full scale-110 opacity-20"
            style={{
              background: config.accentColor,
              filter: "blur(16px)",
            }}
          />
          <div
            className="relative w-28 h-28 rounded-3xl flex items-center justify-center"
            style={{
              background: config.bgColor,
              border: `2px solid ${config.accentColor}22`,
              boxShadow: `0 8px 32px ${config.accentColor}22`,
            }}
          >
            {config.icon}
          </div>

          {/* Error code badge */}
          <div
            className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full"
            style={{
              background: config.accentColor,
              boxShadow: `0 4px 12px ${config.accentColor}55`,
            }}
          >
            <span style={{ color: "white", fontSize: "0.72rem", fontWeight: 900, letterSpacing: "0.5px" }}>
              {config.code}
            </span>
          </div>
        </div>

        {/* ── Text ──────────────────────────────────────────── */}
        <h1 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#1A1A2E", textAlign: "center", marginBottom: "10px" }}>
          {config.title}
        </h1>
        <p style={{ color: "#6B7280", fontSize: "0.88rem", textAlign: "center", lineHeight: 1.7, marginBottom: "24px", maxWidth: "320px" }}>
          {config.desc}
        </p>

        {/* ── Tip Card ──────────────────────────────────────── */}
        <div
          className="w-full rounded-2xl px-4 py-3.5 mb-8 flex gap-3 items-start"
          style={{ background: config.bgColor, border: `1.5px solid ${config.accentColor}22` }}
        >
          <span style={{ fontSize: "1rem", flexShrink: 0 }}>💡</span>
          <p style={{ color: "#595959", fontSize: "0.78rem", lineHeight: 1.6 }}>
            <strong style={{ color: config.accentColor }}>Tips: </strong>
            {config.tip}
          </p>
        </div>

        {/* ── Action Buttons ─────────────────────────────────── */}
        <div className="w-full space-y-3">
          <button
            onClick={() => navigate("/")}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-2.5 transition-all active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${config.accentColor} 0%, ${config.accentColor}CC 100%)`,
              boxShadow: `0 6px 24px ${config.accentColor}40`,
              color: "white",
              fontWeight: 800,
              fontSize: "0.95rem",
            }}
          >
            <Home size={18} />
            Kembali ke Beranda
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleBack}
              className="flex-1 py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
              style={{ background: "#F5F7FA", color: "#595959", fontWeight: 700, fontSize: "0.88rem" }}
            >
              <ArrowLeft size={16} />
              Kembali
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
              style={{ background: "#F5F7FA", color: "#595959", fontWeight: 700, fontSize: "0.88rem" }}
            >
              <RefreshCw size={16} />
              Muat Ulang
            </button>
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────── */}
        <div className="mt-10 flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "#EEF4FF", fontSize: "0.85rem" }}
          >
            🎓
          </div>
          <span style={{ fontSize: "0.72rem", color: "#BFBFBF", fontWeight: 600, letterSpacing: "0.5px" }}>
            EDUFIN · Platform Keuangan Sekolah
          </span>
        </div>

        {/* ── Offline Banner ─────────────────────────────────── */}
        {isOffline && status !== undefined && (
          <div
            className="fixed top-0 left-1/2 z-50 w-full max-w-[430px] px-4 py-2.5 flex items-center justify-center gap-2"
            style={{
              transform: "translateX(-50%)",
              background: "#EA4E0D",
            }}
          >
            <WifiOff size={14} color="white" />
            <span style={{ color: "white", fontSize: "0.75rem", fontWeight: 700 }}>
              Tidak ada koneksi internet
            </span>
          </div>
        )}

        {/* ── Animations ─────────────────────────────────────── */}
        <style>{`
          @keyframes float {
            from { transform: translateY(0px) scale(1); }
            to   { transform: translateY(-12px) scale(1.1); }
          }
        `}</style>
      </div>
    </div>
  );
}

// ─── Convenience exports ──────────────────────────────────────────────────────
export function NotFoundPage()      { return <ErrorPage forceStatus={404} />; }
export function ServerErrorPage()   { return <ErrorPage forceStatus={500} />; }
export function UnauthorizedPage()  { return <ErrorPage forceStatus={401} />; }
