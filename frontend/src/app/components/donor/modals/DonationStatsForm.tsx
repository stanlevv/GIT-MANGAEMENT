import React from "react";
import { X, Heart, TrendingUp, Award } from "lucide-react";
import { useApi } from "../../../hooks/useApi";
import { formatRupiah } from "../../../lib/format";

interface DonationStatsFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Payment {
  id: number;
  amount_paid: number;
  payment_method: string;
  created_at: string;
  payment_status: string;
  receipt_no: string;
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

export function DonationStatsForm({ isOpen, onClose }: DonationStatsFormProps) {
  const { data, loading } = useApi<PaymentsResponse>("/payment/history");

  if (!isOpen) return null;

  const payments         = data?.payments?.filter(p => p.payment_status === "success") ?? [];
  const totalDonations   = payments.reduce((a, b) => a + b.amount_paid, 0);
  const avgDonation      = payments.length > 0 ? Math.round(totalDonations / payments.length) : 0;
  const firstDonation    = payments.length > 0 ? formatDate(payments[payments.length - 1].created_at) : "—";
  const lastDonation     = payments.length > 0 ? formatDate(payments[0].created_at) : "—";

  // Kalkulasi histogram bulanan dari data nyata (6 bulan terakhir)
  const monthlyMap: Record<string, number> = {};
  payments.forEach((p) => {
    const d     = new Date(p.created_at);
    const key   = d.toLocaleDateString("id-ID", { month: "short" });
    monthlyMap[key] = (monthlyMap[key] ?? 0) + p.amount_paid;
  });
  const monthlyData = Object.entries(monthlyMap)
    .slice(0, 6)
    .map(([month, amount]) => ({ month, amount }));
  const maxAmount = monthlyData.length > 0 ? Math.max(...monthlyData.map(d => d.amount)) : 1;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="w-full max-w-[430px] bg-white rounded-t-3xl p-6 pb-8 animate-slide-up max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 style={{ fontWeight: 800, fontSize: "1.1rem", color: "#242424" }}>Statistik Donasi</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "#F5F7FA" }}>
            <X size={18} color="#8C8C8C" />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-12">
            <div className="w-10 h-10 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin mb-4" />
            <p style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>Memuat statistik...</p>
          </div>
        ) : (
          <>
            {/* Hero Stats */}
            <div className="mb-4 p-5 rounded-2xl" style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)" }}>
              <div className="flex items-center gap-2 mb-2">
                <Heart size={18} color="white" fill="white" />
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.75rem" }}>Total Kontribusi</p>
              </div>
              <p style={{ color: "white", fontWeight: 800, fontSize: "2rem" }}>
                {formatRupiah(totalDonations)}
              </p>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.72rem" }}>
                {payments.length} donasi sejak {firstDonation}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-4 rounded-xl" style={{ background: "#F6FFED" }}>
                <TrendingUp size={18} color="#52C41A" className="mb-2" />
                <p style={{ fontWeight: 700, fontSize: "1rem", color: "#242424" }}>
                  {payments.length > 0 ? formatRupiah(avgDonation) : "—"}
                </p>
                <p style={{ color: "#8C8C8C", fontSize: "0.72rem" }}>Rata-rata Donasi</p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: "#FFF7E6" }}>
                <Award size={18} color="#FD9A16" className="mb-2" />
                <p style={{ fontWeight: 700, fontSize: "1rem", color: "#242424" }}>
                  {lastDonation}
                </p>
                <p style={{ color: "#8C8C8C", fontSize: "0.72rem" }}>Donasi Terakhir</p>
              </div>
            </div>

            {/* Monthly Chart */}
            {monthlyData.length > 0 && (
              <div className="mb-4 p-4 rounded-xl" style={{ background: "#F5F7FA" }}>
                <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "#242424", marginBottom: "12px" }}>
                  Donasi Per Bulan
                </p>
                <div className="flex items-end gap-3 h-32">
                  {monthlyData.map((data) => (
                    <div key={data.month} className="flex-1 flex flex-col items-center">
                      <div className="w-full flex flex-col justify-end flex-1">
                        <div
                          className="w-full rounded-t-lg"
                          style={{
                            background: "linear-gradient(135deg, #1677FF, #108EE9)",
                            height: `${(data.amount / maxAmount) * 100}%`,
                          }}
                        />
                      </div>
                      <p style={{ color: "#8C8C8C", fontSize: "0.7rem", marginTop: "6px" }}>{data.month}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payments List */}
            <div>
              <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "#242424", marginBottom: "12px" }}>
                Riwayat Donasi
              </p>
              {payments.length === 0 ? (
                <div className="text-center py-8">
                  <p style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>Belum ada donasi</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {payments.slice(0, 5).map((p) => (
                    <div key={p.id} className="p-3 rounded-xl flex items-start gap-3" style={{ background: "#F5F7FA" }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: "#EEF4FF" }}>
                        <span style={{ fontSize: "1rem" }}>💙</span>
                      </div>
                      <div className="flex-1">
                        <p style={{ fontWeight: 600, fontSize: "0.82rem", color: "#242424" }}>
                          {p.campaign_title ?? `Donasi #${p.receipt_no}`}
                        </p>
                        <p style={{ color: "#8C8C8C", fontSize: "0.7rem" }}>{formatDate(p.created_at)}</p>
                      </div>
                      <div className="text-right">
                        <p style={{ fontWeight: 700, fontSize: "0.82rem", color: "#1677FF" }}>
                          {formatRupiah(p.amount_paid)}
                        </p>
                        <span className="px-2 py-0.5 rounded-full"
                          style={{ background: "#F6FFED", color: "#52C41A", fontSize: "0.65rem", fontWeight: 600 }}>
                          Berhasil
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Close */}
        <button onClick={onClose} className="w-full mt-4 py-3.5 rounded-xl font-bold"
          style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)", color: "white" }}>
          Tutup
        </button>
      </div>
    </div>
  );
}
