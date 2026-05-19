import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, ArrowDownLeft, RefreshCw } from "lucide-react";
import { formatRupiah } from "../../lib/format";
import { useApi } from "../../hooks/useApi";

interface PaymentItem {
  id: number;
  user?: { name: string };
  amount_paid: number;
  payment_method: string;
  created_at: string;
  payment_status: string;
  receipt_no?: string;
}

interface PaymentsResponse {
  data: PaymentItem[];
  total?: number;
}

const CATS = ["Semua", "SPP", "Donasi"];

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function SchoolHistoryPage() {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState("Semua");
  const { data, loading, error, refetch } = useApi<PaymentsResponse>("/school/payments");

  const payments = data?.data ?? [];
  const totalIn = payments.reduce((s, p) => s + p.amount_paid, 0);

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#F5F7FA" }}>
      {/* Header */}
      <div className="px-6 pt-12 pb-5" style={{ background: "linear-gradient(160deg, #1677FF 0%, #108EE9 100%)" }}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate("/school")} className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.2)" }}>
            <ArrowLeft size={20} color="white" />
          </button>
          <button onClick={refetch} className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.2)" }}>
            <RefreshCw size={18} color="white" />
          </button>
        </div>
        <h1 style={{ color: "white", fontSize: "1.4rem", fontWeight: 800 }}>Riwayat Transaksi</h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.78rem", marginTop: "4px" }}>Penerimaan SPP dan pencairan dana</p>

        {/* Summary */}
        <div className="rounded-2xl p-4 mt-4" style={{ background: "rgba(255,255,255,0.15)" }}>
          <div className="flex items-center gap-1.5 mb-1">
            <ArrowDownLeft size={14} color="rgba(255,255,255,0.7)" />
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.75rem" }}>Total Penerimaan</span>
          </div>
          <p style={{ color: "white", fontWeight: 800, fontSize: "1.3rem" }}>
            {loading ? "Memuat..." : formatRupiah(totalIn)}
          </p>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.7rem" }}>
            {loading ? "—" : `${payments.length} transaksi`}
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-4 py-3 overflow-x-auto flex gap-2 bg-white" style={{ scrollbarWidth: "none" }}>
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCat(c)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full"
            style={{
              background: activeCat === c ? "#1677FF" : "#F5F7FA",
              color: activeCat === c ? "white" : "#595959",
              fontWeight: 600,
              fontSize: "0.78rem",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-4 overflow-y-auto pb-32 space-y-3">
        {loading && (
          <div className="flex flex-col items-center py-16">
            <div className="w-10 h-10 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin mb-4" />
            <p style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>Memuat riwayat transaksi...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center py-16">
            <p style={{ color: "#F95654", fontSize: "0.85rem", marginBottom: "12px" }}>Gagal memuat data: {error}</p>
            <button onClick={refetch} className="px-4 py-2 rounded-xl text-white text-sm font-semibold"
              style={{ background: "#1677FF" }}>
              Coba Lagi
            </button>
          </div>
        )}

        {!loading && !error && payments.length === 0 && (
          <div className="flex flex-col items-center py-16">
            <p style={{ color: "#8C8C8C", fontSize: "0.9rem" }}>Belum ada riwayat transaksi</p>
          </div>
        )}

        {!loading && !error && payments.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "#EEF4FF" }}>
              <span style={{ fontSize: "1rem" }}>🧾</span>
            </div>
            <div className="flex-1">
              <p style={{ fontWeight: 700, color: "#242424", fontSize: "0.88rem" }}>
                Penerimaan SPP
              </p>
              <p style={{ color: "#8C8C8C", fontSize: "0.75rem" }}>
                {p.user?.name ?? "Siswa"} · {p.payment_method}
              </p>
              <p style={{ color: "#BFBFBF", fontSize: "0.72rem" }}>{formatDate(p.created_at)}</p>
            </div>
            <div className="text-right">
              <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "#52C41A" }}>
                +{formatRupiah(p.amount_paid)}
              </p>
              <span className="px-2 py-0.5 rounded-full"
                style={{
                  background: p.payment_status === "success" ? "#F6FFED" : "#FFF7E6",
                  color: p.payment_status === "success" ? "#52C41A" : "#FD9A16",
                  fontSize: "0.68rem",
                  fontWeight: 600,
                }}>
                {p.payment_status === "success" ? "Berhasil" : "Proses"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
