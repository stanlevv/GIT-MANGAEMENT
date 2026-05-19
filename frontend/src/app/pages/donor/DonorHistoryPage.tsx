import React from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, CheckCircle, Clock, RefreshCw, Heart } from "lucide-react";
import { formatRupiah } from "../../lib/format";
import { useApi } from "../../hooks/useApi";

interface Payment {
  id: number;
  receipt_no: string;
  amount_paid: number;
  payment_method: string;
  created_at: string;
  payment_status: string;
  // kampanye yang didonasikan (jika ada)
  campaign_title?: string;
}

interface PaymentsResponse {
  payments: Payment[];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export function DonorHistoryPage() {
  const navigate  = useNavigate();
  const { data, loading, error, refetch } = useApi<PaymentsResponse>("/payment/history");
  const payments  = data?.payments ?? [];
  const totalDonasi = payments.reduce((a, b) => a + b.amount_paid, 0);

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#F3F6FB" }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-5" style={{ background: "linear-gradient(145deg,#0D5FD6 0%,#108EE9 100%)" }}>
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => navigate("/donor")}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.2)" }}>
            <ArrowLeft size={18} color="white" />
          </button>
          <button onClick={refetch}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.2)" }}>
            <RefreshCw size={16} color="white" />
          </button>
        </div>
        <h1 style={{ color: "white", fontWeight: 800, fontSize: "1.2rem" }}>Riwayat Donasi</h1>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.75rem", marginBottom: "12px" }}>Kontribusimu untuk pendidikan</p>
        <div className="rounded-2xl p-4"
          style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.3)" }}>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.72rem" }}>Total Donasi</p>
          <p style={{ color: "white", fontWeight: 900, fontSize: "1.8rem", letterSpacing: "-0.5px" }}>
            {loading ? "Memuat..." : formatRupiah(totalDonasi)}
          </p>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.72rem" }}>
            {loading ? "—" : `${payments.length} kali transaksi`}
          </p>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-5 py-4 pb-32 space-y-2.5">
        <p style={{ fontWeight: 700, color: "#242424", fontSize: "0.88rem", marginBottom: "4px" }}>Semua Transaksi</p>

        {loading && (
          <div className="flex flex-col items-center py-16">
            <div className="w-10 h-10 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin mb-4" />
            <p style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>Memuat riwayat donasi...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center py-16">
            <p style={{ color: "#F95654", fontSize: "0.85rem", marginBottom: "12px" }}>Gagal memuat data: {error}</p>
            <button onClick={refetch} className="px-4 py-2 rounded-xl text-white text-sm font-semibold"
              style={{ background: "#1677FF" }}>Coba Lagi</button>
          </div>
        )}

        {!loading && !error && payments.length === 0 && (
          <div className="flex flex-col items-center py-16">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ background: "#EEF4FF" }}>
              <Heart size={32} color="#1677FF" fill="#1677FF" />
            </div>
            <p style={{ color: "#242424", fontWeight: 700, marginBottom: "4px" }}>Belum ada donasi</p>
            <p style={{ color: "#8C8C8C", fontSize: "0.82rem", textAlign: "center" }}>
              Mulai berdonasi untuk mendukung pendidikan anak Indonesia
            </p>
          </div>
        )}

        {!loading && !error && payments.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl p-4 flex items-center gap-3"
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: item.payment_status === "success" ? "#F6FFED" : "#FFF7E6" }}>
              {item.payment_status === "success"
                ? <CheckCircle size={20} color="#52C41A" />
                : <Clock size={20} color="#FD9A16" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate" style={{ fontWeight: 700, color: "#242424", fontSize: "0.85rem" }}>
                {item.campaign_title ?? `Donasi #${item.receipt_no}`}
              </p>
              <p style={{ color: "#8C8C8C", fontSize: "0.7rem" }}>
                {formatDate(item.created_at)} · {item.payment_method}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p style={{ fontWeight: 800, color: "#1677FF", fontSize: "0.88rem" }}>
                {formatRupiah(item.amount_paid)}
              </p>
              <span className="px-2 py-0.5 rounded-full inline-block mt-1"
                style={{
                  background: item.payment_status === "success" ? "#F6FFED" : "#FFF7E6",
                  color: item.payment_status === "success" ? "#52C41A" : "#FD9A16",
                  fontSize: "0.65rem", fontWeight: 600,
                }}>
                {item.payment_status === "success" ? "Berhasil" : "Proses"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
