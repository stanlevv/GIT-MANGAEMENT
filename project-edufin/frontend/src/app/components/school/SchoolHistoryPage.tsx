import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, ArrowDownLeft } from "lucide-react";
import { formatRupiah } from "../../utils/format";

const HISTORY = [
  { id: 1, type: "in", title: "Penerimaan SPP", desc: "Andi Pratama · April 2025 · QRIS", amount: 725000, date: "10 Apr 2025", category: "SPP", status: "Berhasil" },
  { id: 2, type: "in", title: "Pencairan Dana Kampanye", desc: "Renovasi Lab Komputer", amount: 5000000, date: "8 Apr 2025", category: "Donasi" },
  { id: 3, type: "in", title: "Penerimaan SPP", desc: "Budi Santoso · April 2025 · VA BCA", amount: 600000, date: "9 Apr 2025", category: "SPP", status: "Berhasil" },
  { id: 4, type: "in", title: "Penerimaan SPP", desc: "Siti Rahayu · Maret 2025 · QRIS", amount: 600000, date: "12 Mar 2025", category: "SPP", status: "Berhasil" },
  { id: 5, type: "in", title: "Pencairan Dana Kampanye", desc: "Beasiswa Siswa Berprestasi", amount: 3000000, date: "5 Mar 2025", category: "Donasi" },
  { id: 6, type: "in", title: "Penerimaan SPP", desc: "Ahmad Fauzi · Maret 2025 · Transfer Bank", amount: 600000, date: "10 Mar 2025", category: "SPP", status: "Berhasil" },
];

const CATS = ["Semua", "SPP", "Donasi"];

export function SchoolHistoryPage() {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState("Semua");

  const filtered = HISTORY.filter((h) => activeCat === "Semua" || h.category === activeCat);

  const totalIn = HISTORY.reduce((s, h) => s + h.amount, 0);

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#F5F7FA" }}>
      {/* Header */}
      <div className="px-6 pt-12 pb-5" style={{ background: "linear-gradient(160deg, #1677FF 0%, #108EE9 100%)" }}>
        <button onClick={() => navigate("/school")} className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
          style={{ background: "rgba(255,255,255,0.2)" }}>
          <ArrowLeft size={20} color="white" />
        </button>
        <h1 style={{ color: "white", fontSize: "1.4rem", fontWeight: 800 }}>Riwayat Transaksi</h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.78rem", marginTop: "4px" }}>Penerimaan SPP dan pencairan dana</p>

        {/* Summary */}
        <div className="rounded-2xl p-4 mt-4" style={{ background: "rgba(255,255,255,0.15)" }}>
          <div className="flex items-center gap-1.5 mb-1">
            <ArrowDownLeft size={14} color="rgba(255,255,255,0.7)" />
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.75rem" }}>Total Penerimaan</span>
          </div>
          <p style={{ color: "white", fontWeight: 800, fontSize: "1.3rem" }}>{formatRupiah(totalIn)}</p>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.7rem" }}>{HISTORY.length} transaksi</p>
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

      {/* List */}
      <div className="flex-1 px-6 py-4 overflow-y-auto pb-32 space-y-3">
        {filtered.map((h) => (
          <div key={h.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: h.category === "SPP" ? "#EEF4FF" : "#F6FFED"
              }}
            >
              {h.category === "SPP"
                ? <span style={{ fontSize: "1rem" }}>🧾</span>
                : <span style={{ fontSize: "1rem" }}>💰</span>
              }
            </div>
            <div className="flex-1">
              <p style={{ fontWeight: 700, color: "#242424", fontSize: "0.88rem" }}>{h.title}</p>
              <p style={{ color: "#8C8C8C", fontSize: "0.75rem" }}>{h.desc}</p>
              <p style={{ color: "#BFBFBF", fontSize: "0.72rem" }}>{h.date}</p>
            </div>
            <div className="text-right">
              <p style={{
                fontWeight: 700,
                fontSize: "0.9rem",
                color: "#52C41A"
              }}>
                +{formatRupiah(h.amount)}
              </p>
              <span
                className="px-2 py-0.5 rounded-full"
                style={{
                  background: h.status === "Berhasil" ? "#F6FFED" : "#FFF7E6",
                  color: h.status === "Berhasil" ? "#52C41A" : "#FD9A16",
                  fontSize: "0.68rem",
                  fontWeight: 600
                }}
              >
                {h.status || "Proses"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
