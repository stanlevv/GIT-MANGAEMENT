import React, { useState } from "react";
import { Download, TrendingUp, Users, DollarSign, AlertCircle } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  Cell, PieChart, Pie, Tooltip
} from "recharts";
import { formatRupiah } from "../../utils/format";

const MONTHLY = [
  { month: "Jan", masuk: 42, total: 50 },
  { month: "Feb", masuk: 45, total: 50 },
  { month: "Mar", masuk: 48, total: 50 },
  { month: "Apr", masuk: 44, total: 50 },
  { month: "Mei", masuk: 35, total: 50 },
];

const STATUS_DATA = [
  { name: "Lunas", value: 35, color: "#52C41A" },
  { name: "Tertunggak", value: 10, color: "#EA4E0D" },
  { name: "Cicilan", value: 5, color: "#FDD504" },
];



export function SchoolReportPage() {
  const [period, setPeriod] = useState<"bulan" | "tahun">("bulan");

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#F3F6FB" }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-5" style={{ background: "linear-gradient(145deg,#0D5FD6 0%,#108EE9 100%)" }}>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.75rem" }}>SDN 3 Malang</p>
        <div className="flex items-center justify-between">
          <h1 style={{ color: "white", fontWeight: 800, fontSize: "1.2rem" }}>Laporan Keuangan</h1>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.2)", color: "white", fontWeight: 600, fontSize: "0.75rem" }}>
            <Download size={14} /> Ekspor
          </button>
        </div>
      </div>

      {/* Scrollable */}
      <div className="flex-1 overflow-y-auto px-5 py-4 pb-32 space-y-3">

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Total Terkumpul", value: formatRupiah(29750000), sub: "Mei 2025", icon: <DollarSign size={18} color="#1677FF" />, bg: "#EEF4FF", color: "#1677FF" },
            { label: "Siswa Bayar", value: "35 / 50", sub: "70% tingkat bayar", icon: <Users size={18} color="#52C41A" />, bg: "#F6FFED", color: "#52C41A" },
            { label: "Tertunggak", value: formatRupiah(8500000), sub: "10 siswa", icon: <AlertCircle size={18} color="#EA4E0D" />, bg: "#FFF2EE", color: "#EA4E0D" },
            { label: "Pertumbuhan", value: "+12%", sub: "vs bulan lalu", icon: <TrendingUp size={18} color="#722ED1" />, bg: "#F9F0FF", color: "#722ED1" },
          ].map((c) => (
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

        {/* Bar Chart */}
        <div className="bg-white rounded-3xl p-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p style={{ fontWeight: 800, color: "#242424", fontSize: "0.92rem" }}>Tren Pembayaran Bulanan</p>
              <p style={{ color: "#8C8C8C", fontSize: "0.72rem" }}>Jumlah siswa per bulan</p>
            </div>
          </div>
          <div style={{ height: 140 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY} barSize={20} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#F0F0F0" strokeDasharray="0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false}
                  tick={{ fontSize: 10, fill: "#BFBFBF", fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false}
                  tick={{ fontSize: 9, fill: "#BFBFBF" }} />
                <Bar dataKey="masuk" radius={[6, 6, 4, 4]}>
                  {MONTHLY.map((_, i) => (
                    <Cell key={i} fill={i === MONTHLY.length - 1 ? "#FDD504" : "#1677FF"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie + Legend */}
        <div className="bg-white rounded-3xl p-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <p style={{ fontWeight: 800, color: "#242424", fontSize: "0.92rem", marginBottom: "12px" }}>Distribusi Status Bayar</p>
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0" style={{ width: 110, height: 110 }}>
              <PieChart width={110} height={110}>
                <Pie data={STATUS_DATA} cx="50%" cy="50%" innerRadius={32} outerRadius={50}
                  dataKey="value" strokeWidth={2} stroke="white">
                  {STATUS_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: "0.75rem", border: "none" }} />
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p style={{ fontWeight: 900, color: "#242424", fontSize: "1rem" }}>50</p>
                <p style={{ color: "#8C8C8C", fontSize: "0.6rem" }}>siswa</p>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              {STATUS_DATA.map((d) => (
                <div key={d.name}>
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                      <span style={{ fontSize: "0.78rem", color: "#595959", fontWeight: 600 }}>{d.name}</span>
                    </div>
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#242424" }}>{d.value} siswa</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full" style={{ background: "#F0F0F0" }}>
                    <div className="h-full rounded-full" style={{ width: `${(d.value / 50) * 100}%`, background: d.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Month Selector */}
        <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <p style={{ fontWeight: 700, color: "#242424", fontSize: "0.88rem", marginBottom: "8px" }}>Rincian Bulan Ini</p>
          {[
            { label: "Total Tagihan Diterbitkan", value: formatRupiah(42500000) },
            { label: "Total Terkumpul", value: formatRupiah(29750000) },
            { label: "Total Tertunggak", value: formatRupiah(8500000) },
            { label: "Dana Cicilan Aktif", value: formatRupiah(4250000) },
          ].map((row, i, arr) => (
            <div key={row.label} className="flex justify-between py-2.5"
              style={{ borderBottom: i < arr.length - 1 ? "1px solid #F5F7FA" : "none" }}>
              <span style={{ color: "#595959", fontSize: "0.8rem" }}>{row.label}</span>
              <span style={{ fontWeight: 700, color: "#242424", fontSize: "0.82rem" }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
