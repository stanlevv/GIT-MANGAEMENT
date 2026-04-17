import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Bell, CheckCircle, XCircle, Plus, FileText, History } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { useAuth } from "../../context/AuthContext";
import { formatRupiah } from "../../utils/format";

const STUDENTS = [
  { id: 1, name: "Budi Santoso", class: "XII IPA 2", status: "Lunas", amount: 725000 },
  { id: 2, name: "Dewi Rahayu", class: "XII IPA 1", status: "Belum Bayar", amount: 725000 },
  { id: 3, name: "Ahmad Fauzi", class: "XI IPS 3", status: "Lunas", amount: 725000 },
  { id: 4, name: "Siti Nurhaliza", class: "X MIPA 2", status: "Terlambat", amount: 725000 },
  { id: 5, name: "Rizky Pratama", class: "XII IPS 1", status: "Lunas", amount: 725000 },
  { id: 6, name: "Anisa Putri", class: "XI IPA 2", status: "Belum Bayar", amount: 725000 },
  { id: 7, name: "Dian Permana", class: "X IPS 1", status: "Lunas", amount: 725000 },
  { id: 8, name: "Fitri Handayani", class: "XII IPA 3", status: "Terlambat", amount: 725000 },
];

const CAMPAIGNS_PENDING = [
  {
    id: 1,
    title: "Bantuan Buku Pelajaran Kelas XII",
    student: "Ahmad Fauzi",
    class: "XII IPA 1",
    target: 3000000,
    reason: "Pembelian buku pelajaran untuk siswa yang membutuhkan",
    date: "8 Mei 2025",
  },
  {
    id: 2,
    title: "Dana Kegiatan Study Tour",
    student: "Anisa Putri",
    class: "XI IPA 2",
    target: 5000000,
    reason: "Study tour ke museum sains di Surabaya",
    date: "9 Mei 2025",
  },
];

const CHART_DATA = [
  { id: 1, month: "Jan", collected: 85 },
  { id: 2, month: "Feb", collected: 78 },
  { id: 3, month: "Mar", collected: 92 },
  { id: 4, month: "Apr", collected: 88 },
  { id: 5, month: "Mei", collected: 65 },
];

export function SchoolDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "students" | "campaigns">("overview");
  const [campaignStatus, setCampaignStatus] = useState<Record<number, string>>({});

  const totalStudents = STUDENTS.length;
  const lunas = STUDENTS.filter((s) => s.status === "Lunas").length;
  const belumBayar = STUDENTS.filter((s) => s.status === "Belum Bayar").length;
  const terlambat = STUDENTS.filter((s) => s.status === "Terlambat").length;

  const statusColor: Record<string, string> = {
    Lunas: "#52C41A",
    "Belum Bayar": "#FD9A16",
    Terlambat: "#F95654",
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="px-6 pt-12 pb-5" style={{ background: "linear-gradient(160deg, #1677FF 0%, #108EE9 100%)" }}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.25)", fontSize: "1.2rem" }}>
              🏫
            </div>
            <div>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.78rem" }}>Panel Admin</p>
              <p style={{ color: "white", fontWeight: 700, fontSize: "0.88rem" }}>{user?.school}</p>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.2)" }}>
            <Bell size={20} color="white" />
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl p-3 text-center" style={{ background: "rgba(255,255,255,0.15)" }}>
            <p style={{ color: "white", fontSize: "1.4rem", fontWeight: 800 }}>{totalStudents}</p>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.72rem" }}>Total Siswa</p>
          </div>
          <div className="rounded-2xl p-3 text-center" style={{ background: "rgba(82,196,26,0.25)" }}>
            <p style={{ color: "white", fontSize: "1.4rem", fontWeight: 800 }}>{lunas}</p>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.72rem" }}>Lunas</p>
          </div>
          <div className="rounded-2xl p-3 text-center" style={{ background: "rgba(249,86,84,0.25)" }}>
            <p style={{ color: "white", fontSize: "1.4rem", fontWeight: 800 }}>{belumBayar + terlambat}</p>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.72rem" }}>Belum Bayar</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b" style={{ borderColor: "#F0F0F0", background: "white" }}>
        {[
          { key: "overview", label: "Ringkasan" },
          { key: "students", label: "Siswa" },
          { key: "campaigns", label: "Kampanye" + (CAMPAIGNS_PENDING.length > 0 ? ` (${CAMPAIGNS_PENDING.length})` : "") },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className="flex-1 py-3 text-center transition-all"
            style={{
              fontWeight: activeTab === t.key ? 700 : 500,
              color: activeTab === t.key ? "#1677FF" : "#8C8C8C",
              borderBottom: "2.5px solid",
              borderColor: activeTab === t.key ? "#1677FF" : "transparent",
              fontSize: "0.85rem",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pb-24 bg-gray-50">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="px-6 py-5 space-y-5">
            {/* Revenue Chart */}
            <div className="bg-white rounded-3xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p style={{ fontWeight: 700, color: "#242424" }}>Persentase Pembayaran</p>
                <span style={{ color: "#8C8C8C", fontSize: "0.8rem" }}>2025</span>
              </div>
              <div className="h-36">
                <ResponsiveContainer width="100%" height={144}>
                  <BarChart data={CHART_DATA} barSize={20}>
                    <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
                    <XAxis key="xaxis" dataKey="month" tick={{ fontSize: 11, fill: "#8C8C8C" }} axisLine={false} tickLine={false} />
                    <YAxis key="yaxis" tick={{ fontSize: 11, fill: "#8C8C8C" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                    <Tooltip key="tooltip" formatter={(v: number) => [`${v}%`, "Pembayaran"]} />
                    <Bar key="bar-collected" dataKey="collected" fill="#1677FF" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-white rounded-3xl p-5 shadow-sm">
              <p style={{ fontWeight: 700, color: "#242424", marginBottom: "12px" }}>Ringkasan Keuangan Mei 2025</p>
              <div className="space-y-3">
                {[
                  { label: "Total Penerimaan SPP", value: formatRupiah(5075000), color: "#52C41A" },
                  { label: "SPP Belum Masuk", value: formatRupiah(2175000), color: "#F95654" },
                  { label: "Total Siswa Aktif", value: `${totalStudents} siswa`, color: "#1677FF" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center py-2"
                    style={{ borderBottom: "1px solid #F5F7FA" }}>
                    <span style={{ color: "#595959", fontSize: "0.85rem" }}>{item.label}</span>
                    <span style={{ fontWeight: 700, color: item.color, fontSize: "0.9rem" }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl p-5 shadow-sm">
              <p style={{ fontWeight: 700, color: "#242424", marginBottom: "12px" }}>Aksi Cepat</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate("/school/bills")}
                  className="flex items-center gap-2 p-3 rounded-2xl transition-all active:scale-95"
                  style={{ background: "#EEF4FF" }}>
                  <Plus size={18} color="#1677FF" />
                  <span style={{ color: "#1677FF", fontWeight: 600, fontSize: "0.85rem" }}>Buat Tagihan</span>
                </button>
                <button
                  onClick={() => navigate("/school/history")}
                  className="flex items-center gap-2 p-3 rounded-2xl transition-all active:scale-95"
                  style={{ background: "#FFF7E6" }}>
                  <History size={18} color="#FD9A16" />
                  <span style={{ color: "#FD9A16", fontWeight: 600, fontSize: "0.85rem" }}>Riwayat</span>
                </button>
                <button
                  onClick={() => navigate("/school/report")}
                  className="flex items-center gap-2 p-3 rounded-2xl transition-all active:scale-95 col-span-2"
                  style={{ background: "#F6FFED" }}>
                  <FileText size={18} color="#52C41A" />
                  <span style={{ color: "#52C41A", fontWeight: 600, fontSize: "0.85rem" }}>Ekspor Laporan</span>
                </button>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={() => { logout(); navigate("/login"); }}
              className="w-full py-3 rounded-2xl"
              style={{ background: "#FFF2F0", color: "#F95654", fontWeight: 600, fontSize: "0.9rem" }}
            >
              Keluar dari Akun
            </button>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === "students" && (
          <div className="px-6 py-5">
            <div className="flex items-center justify-between mb-4">
              <p style={{ fontWeight: 700, color: "#242424" }}>Daftar Siswa</p>
              <div className="flex gap-2 text-xs">
                <span className="px-2 py-1 rounded-full" style={{ background: "#F6FFED", color: "#52C41A", fontWeight: 600 }}>
                  ✓ {lunas}
                </span>
                <span className="px-2 py-1 rounded-full" style={{ background: "#FFF7E6", color: "#FD9A16", fontWeight: 600 }}>
                  ⏱ {belumBayar}
                </span>
                <span className="px-2 py-1 rounded-full" style={{ background: "#FFF2F0", color: "#F95654", fontWeight: 600 }}>
                  ⚠️ {terlambat}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              {STUDENTS.map((s) => (
                <div key={s.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ background: "#1677FF", fontSize: "0.9rem" }}>
                    {s.name[0]}
                  </div>
                  <div className="flex-1">
                    <p style={{ fontWeight: 600, color: "#242424", fontSize: "0.88rem" }}>{s.name}</p>
                    <p style={{ color: "#8C8C8C", fontSize: "0.76rem" }}>{s.class} · {formatRupiah(s.amount)}</p>
                  </div>
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: `${statusColor[s.status]}15`,
                      color: statusColor[s.status],
                    }}
                  >
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Campaigns Tab */}
        {activeTab === "campaigns" && (
          <div className="px-6 py-5 space-y-4">
            <p style={{ fontWeight: 700, color: "#242424", marginBottom: "4px" }}>
              Kampanye Menunggu Verifikasi
            </p>
            {CAMPAIGNS_PENDING.length === 0 ? (
              <div className="flex flex-col items-center py-12">
                <CheckCircle size={48} color="#52C41A" />
                <p style={{ color: "#8C8C8C", marginTop: "12px" }}>Semua kampanye sudah diverifikasi</p>
              </div>
            ) : (
              CAMPAIGNS_PENDING.map((c) => (
                <div key={c.id} className="bg-white rounded-3xl p-5 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 pr-2">
                      <p style={{ fontWeight: 700, color: "#242424", fontSize: "0.9rem", lineHeight: "1.3" }}>{c.title}</p>
                      <p style={{ color: "#8C8C8C", fontSize: "0.78rem", marginTop: "2px" }}>
                        {c.student} · {c.class}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0"
                      style={{ background: "#FFF7E6", color: "#FD9A16" }}>
                      Menunggu
                    </span>
                  </div>
                  <div className="rounded-xl p-3 mb-4" style={{ background: "#F5F7FA" }}>
                    <p style={{ color: "#595959", fontSize: "0.82rem", lineHeight: "1.5" }}>{c.reason}</p>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span style={{ color: "#8C8C8C", fontSize: "0.82rem" }}>Target Dana</span>
                    <span style={{ fontWeight: 700, color: "#242424", fontSize: "0.82rem" }}>{formatRupiah(c.target)}</span>
                  </div>

                  {campaignStatus[c.id] ? (
                    <div className="flex items-center justify-center gap-2 py-3 rounded-2xl"
                      style={{ background: campaignStatus[c.id] === "approved" ? "#F6FFED" : "#FFF2F0" }}>
                      {campaignStatus[c.id] === "approved"
                        ? <><CheckCircle size={18} color="#52C41A" /><span style={{ color: "#52C41A", fontWeight: 600 }}>Kampanye Disetujui</span></>
                        : <><XCircle size={18} color="#F95654" /><span style={{ color: "#F95654", fontWeight: 600 }}>Kampanye Ditolak</span></>
                      }
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={() => setCampaignStatus({ ...campaignStatus, [c.id]: "rejected" })}
                        className="flex-1 py-3 rounded-2xl"
                        style={{ background: "#FFF2F0", color: "#F95654", fontWeight: 600, fontSize: "0.88rem" }}
                      >
                        Tolak
                      </button>
                      <button
                        onClick={() => setCampaignStatus({ ...campaignStatus, [c.id]: "approved" })}
                        className="flex-1 py-3 rounded-2xl text-white"
                        style={{ background: "linear-gradient(135deg, #52C41A, #389E0D)", fontWeight: 600, fontSize: "0.88rem" }}
                      >
                        ✓ Setujui
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

    </div>
  );
}