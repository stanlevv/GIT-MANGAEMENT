import React from "react";
import { Download, TrendingUp, Users, DollarSign, AlertCircle, RefreshCw } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  Cell, PieChart, Pie, Tooltip
} from "recharts";
import { formatRupiah } from "../../lib/format";
import { useApi } from "../../hooks/useApi";
import { useAuth } from "../../context/AuthContext";

interface DashboardStats {
  stats: {
    total_students: number;
    total_bills: number;
    paid_bills: number;
    unpaid_bills: number;
    total_collected: number;
  };
}

export function SchoolReportPage() {
  const { user } = useAuth();
  const { data, loading, error, refetch } = useApi<DashboardStats>("/school/dashboard");
  const stats = data?.stats;

  const totalBills      = stats?.total_bills    ?? 0;
  const paidBills       = stats?.paid_bills     ?? 0;
  const unpaidBills     = stats?.unpaid_bills   ?? 0;
  const totalStudents   = stats?.total_students ?? 0;
  const totalCollected  = stats?.total_collected ?? 0;

  // Total tagihan diperkirakan: rata-rata per siswa × total siswa (estimasi)
  const avgBillAmount   = 850000;
  const estimatedTotal  = totalBills * avgBillAmount;
  const estimatedUnpaid = unpaidBills * avgBillAmount;

  // Persentase bayar
  const payRate = totalBills > 0 ? Math.round((paidBills / totalBills) * 100) : 0;

  const statusData = [
    { name: "Lunas",      value: paidBills,   color: "#52C41A" },
    { name: "Tertunggak", value: unpaidBills,  color: "#EA4E0D" },
  ].filter(d => d.value > 0);

  const summaryCards = [
    {
      label: "Total Terkumpul", value: loading ? "—" : formatRupiah(totalCollected),
      sub: "Semua waktu", icon: <DollarSign size={18} color="#1677FF" />, bg: "#EEF4FF", color: "#1677FF"
    },
    {
      label: "Siswa Bayar", value: loading ? "—" : `${paidBills} / ${totalBills}`,
      sub: loading ? "—" : `${payRate}% tingkat bayar`, icon: <Users size={18} color="#52C41A" />, bg: "#F6FFED", color: "#52C41A"
    },
    {
      label: "Tertunggak", value: loading ? "—" : String(unpaidBills) + " tagihan",
      sub: loading ? "—" : formatRupiah(estimatedUnpaid), icon: <AlertCircle size={18} color="#EA4E0D" />, bg: "#FFF2EE", color: "#EA4E0D"
    },
    {
      label: "Total Siswa", value: loading ? "—" : String(totalStudents) + " siswa",
      sub: "Terdaftar", icon: <TrendingUp size={18} color="#722ED1" />, bg: "#F9F0FF", color: "#722ED1"
    },
  ];

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#F3F6FB" }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-5" style={{ background: "linear-gradient(145deg,#0D5FD6 0%,#108EE9 100%)" }}>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.75rem" }}>{user?.school ?? "Sekolah"}</p>
        <div className="flex items-center justify-between">
          <h1 style={{ color: "white", fontWeight: 800, fontSize: "1.2rem" }}>Laporan Keuangan</h1>
          <div className="flex gap-2">
            <button onClick={refetch}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
              style={{ background: "rgba(255,255,255,0.2)", color: "white", fontWeight: 600, fontSize: "0.75rem" }}>
              <RefreshCw size={13} />
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
              style={{ background: "rgba(255,255,255,0.2)", color: "white", fontWeight: 600, fontSize: "0.75rem" }}>
              <Download size={14} /> Ekspor
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable */}
      <div className="flex-1 overflow-y-auto px-5 py-4 pb-32 space-y-3">

        {loading && (
          <div className="flex flex-col items-center py-16">
            <div className="w-10 h-10 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin mb-4" />
            <p style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>Memuat laporan...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center py-10">
            <p style={{ color: "#F95654", fontSize: "0.85rem", marginBottom: "12px" }}>Gagal memuat data: {error}</p>
            <button onClick={refetch} className="px-4 py-2 rounded-xl text-white text-sm font-semibold"
              style={{ background: "#1677FF" }}>Coba Lagi</button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
              {summaryCards.map((c) => (
                <div key={c.label} className="bg-white rounded-2xl p-4"
                  style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ background: c.bg }}>
                    {c.icon}
                  </div>
                  <p style={{ fontWeight: 800, color: "#242424", fontSize: "0.95rem" }}>{c.value}</p>
                  <p style={{ color: c.color, fontSize: "0.65rem", fontWeight: 600 }}>{c.sub}</p>
                  <p style={{ color: "#8C8C8C", fontSize: "0.68rem", marginTop: "1px" }}>{c.label}</p>
                </div>
              ))}
            </div>

            {/* Pie Chart — Distribusi Status */}
            {statusData.length > 0 && (
              <div className="bg-white rounded-3xl p-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                <p style={{ fontWeight: 800, color: "#242424", fontSize: "0.92rem", marginBottom: "12px" }}>Distribusi Status Bayar</p>
                <div className="flex items-center gap-4">
                  <div className="relative flex-shrink-0" style={{ width: 110, height: 110 }}>
                    <PieChart width={110} height={110}>
                      <Pie data={statusData} cx="50%" cy="50%" innerRadius={32} outerRadius={50}
                        dataKey="value" strokeWidth={2} stroke="white">
                        {statusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: 12, fontSize: "0.75rem", border: "none" }} />
                    </PieChart>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <p style={{ fontWeight: 900, color: "#242424", fontSize: "1rem" }}>{totalBills}</p>
                      <p style={{ color: "#8C8C8C", fontSize: "0.6rem" }}>tagihan</p>
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    {statusData.map((d) => (
                      <div key={d.name}>
                        <div className="flex justify-between mb-1">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                            <span style={{ fontSize: "0.78rem", color: "#595959", fontWeight: 600 }}>{d.name}</span>
                          </div>
                          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#242424" }}>{d.value} tagihan</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full" style={{ background: "#F0F0F0" }}>
                          <div className="h-full rounded-full"
                            style={{ width: `${totalBills > 0 ? (d.value / totalBills) * 100 : 0}%`, background: d.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Ringkasan Detail */}
            <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
              <p style={{ fontWeight: 700, color: "#242424", fontSize: "0.88rem", marginBottom: "8px" }}>Ringkasan Keseluruhan</p>
              {[
                { label: "Total Tagihan Diterbitkan", value: String(totalBills) + " tagihan" },
                { label: "Total Terkumpul",           value: formatRupiah(totalCollected) },
                { label: "Tagihan Lunas",             value: String(paidBills) + " tagihan" },
                { label: "Tagihan Tertunggak",        value: String(unpaidBills) + " tagihan" },
                { label: "Total Siswa Aktif",         value: String(totalStudents) + " siswa" },
              ].map((row, i, arr) => (
                <div key={row.label} className="flex justify-between py-2.5"
                  style={{ borderBottom: i < arr.length - 1 ? "1px solid #F5F7FA" : "none" }}>
                  <span style={{ color: "#595959", fontSize: "0.8rem" }}>{row.label}</span>
                  <span style={{ fontWeight: 700, color: "#242424", fontSize: "0.82rem" }}>{row.value}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
