import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, ArrowUpRight, RefreshCw } from "lucide-react";
import { useApi } from "../../hooks/useApi";
import { formatRupiah } from "../../lib/format";

interface Payment {
  id: number;
  receipt_no: string;
  amount_paid: number;
  payment_method: string;
  payment_status: string;
  payment_type: string;
  bill_ids: number[];
  created_at: string;
}

interface PaymentHistoryResponse {
  payments: Payment[];
}

const CATS = ["Semua", "SPP", "Cicilan"];

function categoryFromType(type: string): string {
  if (type === "penuh") return "SPP";
  return "Cicilan";
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatMethodLabel(method: string): string {
  const map: Record<string, string> = {
    bca:        "Transfer Bank BCA",
    bni:        "Virtual Account BNI",
    qris:       "QRIS",
    indomaret:  "Indomaret/Alfamart",
  };
  return map[method] ?? method;
}

export function HistoryPage() {
  const navigate   = useNavigate();
  const [activeCat, setActiveCat] = useState("Semua");

  const { data, loading, error, refetch } =
    useApi<PaymentHistoryResponse>("/payment/history");

  const payments = data?.payments ?? [];

  const filtered = payments.filter((p) => {
    const cat = categoryFromType(p.payment_type);
    return activeCat === "Semua" || cat === activeCat;
  });

  const totalOut = payments.reduce((s, p) => s + p.amount_paid, 0);

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#F5F7FA" }}>
      {/* Header */}
      <div className="px-6 pt-12 pb-5" style={{ background: "linear-gradient(160deg, #1677FF 0%, #108EE9 100%)" }}>
        <button
          onClick={() => navigate("/student")}
          className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
          style={{ background: "rgba(255,255,255,0.2)" }}
        >
          <ArrowLeft size={20} color="white" />
        </button>
        <h1 style={{ color: "white", fontSize: "1.4rem", fontWeight: 800 }}>Riwayat Transaksi</h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.78rem", marginTop: "4px" }}>
          SPP & cicilan Anda
        </p>

        {/* Summary */}
        <div className="rounded-2xl p-4 mt-4" style={{ background: "rgba(255,255,255,0.15)" }}>
          <div className="flex items-center gap-1.5 mb-1">
            <ArrowUpRight size={14} color="rgba(255,255,255,0.7)" />
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.75rem" }}>Total Pembayaran</span>
          </div>
          {loading ? (
            <div className="h-8 w-36 rounded-lg animate-pulse" style={{ background: "rgba(255,255,255,0.2)" }} />
          ) : (
            <>
              <p style={{ color: "white", fontWeight: 800, fontSize: "1.3rem" }}>{formatRupiah(totalOut)}</p>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.7rem" }}>{payments.length} transaksi</p>
            </>
          )}
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
              color:      activeCat === c ? "white"   : "#595959",
              fontWeight: 600, fontSize: "0.78rem",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 px-6 py-4 overflow-y-auto pb-32 space-y-3">
        {loading && (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-4 flex items-center gap-3 animate-pulse">
              <div className="w-11 h-11 rounded-xl" style={{ background: "#F0F0F0" }} />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 rounded" style={{ background: "#F0F0F0" }} />
                <div className="h-3 w-24 rounded" style={{ background: "#F0F0F0" }} />
              </div>
              <div className="h-5 w-20 rounded" style={{ background: "#F0F0F0" }} />
            </div>
          ))
        )}

        {error && (
          <div className="flex flex-col items-center py-12">
            <span style={{ fontSize: "3rem" }}>⚠️</span>
            <p style={{ color: "#8C8C8C", marginTop: "12px", textAlign: "center" }}>
              Gagal memuat riwayat
            </p>
            <button
              onClick={refetch}
              className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{ background: "#EEF4FF", color: "#1677FF", fontWeight: 600, fontSize: "0.85rem" }}
            >
              <RefreshCw size={14} /> Coba Lagi
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center py-12">
            <span style={{ fontSize: "3rem" }}>📭</span>
            <p style={{ color: "#8C8C8C", marginTop: "12px" }}>Belum ada riwayat pembayaran</p>
          </div>
        )}

        {!loading && !error && filtered.map((p) => {
          const cat    = categoryFromType(p.payment_type);
          const isOk   = p.payment_status === "success";
          return (
            <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: cat === "SPP" ? "#EEF4FF" : "#FFF7E6" }}
              >
                <span style={{ fontSize: "1rem" }}>{cat === "SPP" ? "🧾" : "💳"}</span>
              </div>
              <div className="flex-1">
                <p style={{ fontWeight: 700, color: "#242424", fontSize: "0.88rem" }}>
                  Pembayaran {cat}
                  {p.payment_type !== "penuh" ? ` (Cicilan ${p.payment_type})` : ""}
                </p>
                <p style={{ color: "#8C8C8C", fontSize: "0.75rem" }}>
                  {formatMethodLabel(p.payment_method)} · No. {p.receipt_no}
                </p>
                <p style={{ color: "#BFBFBF", fontSize: "0.72rem" }}>{formatDate(p.created_at)}</p>
              </div>
              <div className="text-right">
                <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "#F95654" }}>
                  -{formatRupiah(p.amount_paid)}
                </p>
                <span
                  className="px-2 py-0.5 rounded-full"
                  style={{
                    background: isOk ? "#F6FFED"  : "#FFF2F0",
                    color:      isOk ? "#52C41A"  : "#8C8C8C",
                    fontSize: "0.68rem", fontWeight: 600,
                  }}
                >
                  {isOk ? "Berhasil" : "Pending"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}