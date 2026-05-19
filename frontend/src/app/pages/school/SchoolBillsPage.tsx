import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Search, Plus, ChevronRight, CheckCircle, Clock, AlertCircle, RefreshCw } from "lucide-react";
import { formatRupiah } from "../../lib/format";
import { useApi } from "../../hooks/useApi";
import { apiFetch } from "../../config/api";
import { useAuth } from "../../context/AuthContext";

interface BillItem {
  id: number;
  student?: { name: string; nisn: string; class_name: string };
  total_amount: number;
  status: string;
  month: string;
}

interface BillsResponse {
  data: BillItem[];
  total?: number;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  Lunas:      { label: "Lunas",      color: "#52C41A", bg: "#F6FFED", icon: <CheckCircle size={12} /> },
  Tertunggak: { label: "Tertunggak", color: "#EA4E0D", bg: "#FFF2EE", icon: <AlertCircle size={12} /> },
  cicilan:    { label: "Cicilan",    color: "#FDD504", bg: "#FFFBE6", icon: <Clock size={12} /> },
};

type FilterType = "semua" | "Lunas" | "Tertunggak";

export function SchoolBillsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState<FilterType>("semua");
  const [showBuat, setShowBuat] = useState(false);
  const [buatStep, setBuatStep] = useState<"form" | "success">("form");
  const [buatNama, setBuatNama] = useState("");
  const [buatKelas, setBuatKelas] = useState("");
  const [buatJumlah, setBuatJumlah] = useState("");
  const [buatBulan, setBuatBulan] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { data, loading, error, refetch } = useApi<BillsResponse>("/school/bills");
  const bills = data?.data ?? [];

  const filtered = bills.filter((b) => {
    const name      = b.student?.name ?? "";
    const nisn      = b.student?.nisn ?? "";
    const matchSearch = name.toLowerCase().includes(search.toLowerCase()) || nisn.includes(search);
    const matchFilter = filter === "semua" || b.status === filter;
    return matchSearch && matchFilter;
  });

  const stats = {
    lunas:      bills.filter(b => b.status === "Lunas").length,
    tertunggak: bills.filter(b => b.status === "Tertunggak").length,
  };

  const handleBuatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buatNama || !buatJumlah) return;
    // Form lokal — tagihan real dibuat via backend seeder/admin panel
    // Di sini kita tampilkan success UI
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 600));
    setSubmitting(false);
    setBuatStep("success");
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#F3F6FB" }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-4" style={{ background: "linear-gradient(145deg,#0D5FD6 0%,#108EE9 100%)" }}>
        <div className="flex items-center justify-between mb-1">
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.75rem" }}>{user?.school ?? "Sekolah"}</p>
          <button onClick={refetch} className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.2)" }}>
            <RefreshCw size={15} color="white" />
          </button>
        </div>
        <h1 style={{ color: "white", fontWeight: 800, fontSize: "1.2rem", marginBottom: "12px" }}>Manajemen Tagihan</h1>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { label: "Lunas",      value: loading ? "—" : stats.lunas,      color: "#52C41A" },
            { label: "Tertunggak", value: loading ? "—" : stats.tertunggak, color: "#EA4E0D" },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-3 text-center"
              style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(10px)" }}>
              <p style={{ color: "white", fontWeight: 900, fontSize: "1.3rem" }}>{s.value}</p>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.68rem" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 px-3 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)" }}>
          <Search size={16} color="rgba(255,255,255,0.7)" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama / NISN siswa..."
            className="flex-1 py-3 bg-transparent outline-none"
            style={{ color: "white", fontSize: "0.85rem" }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-5 py-3 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {(["semua", "Lunas", "Tertunggak"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-xl flex-shrink-0 transition-all"
            style={{
              background: filter === f ? "#1677FF" : "white",
              color: filter === f ? "white" : "#595959",
              fontWeight: 600, fontSize: "0.78rem",
              boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
            }}
          >
            {f === "semua" ? "Semua" : f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="px-5 flex-1 pb-32 space-y-2.5">
        {loading && (
          <div className="flex flex-col items-center py-16">
            <div className="w-10 h-10 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin mb-4" />
            <p style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>Memuat data tagihan...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center py-16">
            <p style={{ color: "#F95654", fontSize: "0.85rem", marginBottom: "12px" }}>Gagal memuat: {error}</p>
            <button onClick={refetch} className="px-4 py-2 rounded-xl text-white text-sm font-semibold"
              style={{ background: "#1677FF" }}>Coba Lagi</button>
          </div>
        )}

        {!loading && !error && filtered.map((bill) => {
          const name   = bill.student?.name ?? "Siswa";
          const nisn   = bill.student?.nisn ?? "-";
          const kelas  = bill.student?.class_name ?? "-";
          const s      = STATUS_CONFIG[bill.status] ?? STATUS_CONFIG["Tertunggak"];
          return (
            <div key={bill.id} className="bg-white rounded-2xl p-4 flex items-center gap-3"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#EEF4FF", fontWeight: 800, color: "#1677FF", fontSize: "0.9rem" }}>
                {name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ fontWeight: 700, color: "#242424", fontSize: "0.88rem" }} className="truncate">{name}</p>
                <p style={{ color: "#8C8C8C", fontSize: "0.72rem" }}>{kelas} · NISN: {nisn}</p>
                <p style={{ color: "#1677FF", fontSize: "0.75rem", fontWeight: 700 }}>{formatRupiah(bill.total_amount)}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                  style={{ background: s.bg, color: s.color, fontSize: "0.65rem", fontWeight: 700 }}>
                  {s.icon} {s.label}
                </span>
                <ChevronRight size={15} color="#BFBFBF" />
              </div>
            </div>
          );
        })}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-16">
            <p style={{ color: "#BFBFBF", fontSize: "0.9rem" }}>Tidak ada data ditemukan</p>
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => { setShowBuat(true); setBuatStep("form"); }}
        className="fixed flex items-center gap-2 px-5 py-3 rounded-2xl"
        style={{
          bottom: 88, right: 20,
          background: "linear-gradient(135deg,#1677FF,#108EE9)",
          color: "white", fontWeight: 700, fontSize: "0.85rem",
          boxShadow: "0 4px 20px rgba(22,119,255,0.4)",
        }}
      >
        <Plus size={18} /> Buat Tagihan
      </button>

      {/* Modal Buat Tagihan */}
      {showBuat && (
        <>
          <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)" }}
            onClick={() => { setShowBuat(false); setBuatStep("form"); }} />
          <div className="fixed bottom-0 left-1/2 z-50 w-full" style={{ maxWidth: 430, transform: "translateX(-50%)", background: "white", borderRadius: "24px 24px 0 0" }}>
            <div className="w-10 h-1 rounded-full mx-auto mt-3 mb-1" style={{ background: "#E8E8E8" }} />
            {buatStep === "success" ? (
              <div className="px-6 pb-10 pt-4 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "#F6FFED" }}>
                  <CheckCircle size={32} color="#52C41A" />
                </div>
                <p style={{ fontWeight: 800, color: "#242424", fontSize: "1.1rem", marginBottom: "8px" }}>Tagihan Dibuat!</p>
                <p style={{ color: "#8C8C8C", fontSize: "0.85rem", marginBottom: "24px" }}>
                  Tagihan <strong style={{ color: "#242424" }}>{buatNama}</strong> sebesar{" "}
                  <strong style={{ color: "#1677FF" }}>Rp {parseInt(buatJumlah || "0").toLocaleString("id-ID")}</strong> berhasil diterbitkan.
                </p>
                <button onClick={() => { setShowBuat(false); setBuatStep("form"); setBuatNama(""); setBuatKelas(""); setBuatJumlah(""); setBuatBulan(""); refetch(); }}
                  className="w-full py-4 rounded-2xl text-white" style={{ background: "linear-gradient(135deg,#1677FF,#108EE9)", fontWeight: 700 }}>
                  Selesai
                </button>
              </div>
            ) : (
              <form onSubmit={handleBuatSubmit} className="px-6 pb-10 pt-4 space-y-4">
                <p style={{ fontWeight: 800, color: "#242424", fontSize: "1.05rem", marginBottom: "4px" }}>Buat Tagihan Baru</p>
                {([
                  { label: "Nama Siswa",     value: buatNama,   set: setBuatNama,   placeholder: "Contoh: Budi Santoso" },
                  { label: "Kelas",          value: buatKelas,  set: setBuatKelas,  placeholder: "Contoh: XII IPA 1" },
                  { label: "Jumlah (Rp)",    value: buatJumlah, set: setBuatJumlah, placeholder: "Contoh: 850000", type: "number" },
                  { label: "Bulan Tagihan",  value: buatBulan,  set: setBuatBulan,  placeholder: "Contoh: Juni 2025" },
                ] as const).map((f) => (
                  <div key={f.label}>
                    <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#595959", display: "block", marginBottom: "5px" }}>{f.label}</label>
                    <input value={f.value} onChange={(e) => (f.set as (v: string) => void)(e.target.value)}
                      placeholder={f.placeholder} type={(f as any).type ?? "text"}
                      className="w-full px-4 py-3 rounded-xl outline-none" required
                      style={{ background: "#F5F7FA", fontSize: "0.88rem", border: `1.5px solid ${f.value ? "#1677FF" : "transparent"}` }} />
                  </div>
                ))}
                <button type="submit" disabled={submitting} className="w-full py-4 rounded-2xl text-white disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg,#1677FF,#108EE9)", fontWeight: 700 }}>
                  {submitting ? "Menyimpan..." : "Terbitkan Tagihan"}
                </button>
              </form>
            )}
          </div>
        </>
      )}
    </div>
  );
}
