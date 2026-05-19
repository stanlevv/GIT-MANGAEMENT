import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Bell, CheckCircle, XCircle, Plus, FileText, History, RefreshCw, School } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { formatRupiah } from "../../lib/format";
import { useApi } from "../../hooks/useApi";
import { apiFetch } from "../../config/api";
import { CampaignSubmissionForm } from "../../components/shared/CampaignSubmissionForm";
import { ProjectExpenseForm } from "../../components/modals/school/ProjectExpenseForm";
import { ApproveAidRequestModal } from "../../components/modals/school/ApproveAidRequestModal";

// ── Types ─────────────────────────────────────────────────────────────────────

interface DashboardStats {
  stats: {
    total_students: number;
    paid_bills: number;
    unpaid_bills: number;
    total_collected: number;
  };
}

interface Student {
  id: number;
  name: string;
  nisn: string;
  class_name: string;
  latest_bill?: {
    month: string;
    status: string;
    total: number;
  } | null;
}

interface StudentsResponse {
  students: Student[];
}

interface AidRequest {
  id: number;
  student?: { name: string; class_name: string };
  user?: { name: string };
  reason: string;
  status: string;
  created_at: string;
  bill_ids?: number[];
  fund_pool?: { campaign?: { title?: string } };
}

interface AidRequestsResponse {
  aid_requests: AidRequest[];
}

// ── Component ─────────────────────────────────────────────────────────────────

const statusColor: Record<string, string> = {
  Lunas:      "#52C41A",
  "Belum Bayar": "#FD9A16",
  Tertunggak: "#F95654",
};

export function SchoolDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "students" | "campaigns">("overview");
  const [showCampaignForm, setShowCampaignForm]     = useState(false);
  const [showProjectExpenseForm, setShowProjectExpenseForm] = useState(false);
  const [selectedAidRequest, setSelectedAidRequest] = useState<{id: number; name: string; amount: number} | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);

  // ── Fetch real data ──────────────────────────────────────────────────────
  const { data: dashData, loading: dashLoading, refetch: refetchDash }       = useApi<DashboardStats>("/school/dashboard");
  const { data: studentsData, loading: studentsLoading, refetch: refetchStu } = useApi<StudentsResponse>("/school/students");
  const { data: aidData, loading: aidLoading, refetch: refetchAid }           = useApi<AidRequestsResponse>("/school/aid-requests");

  const stats         = dashData?.stats;
  const students      = studentsData?.students ?? [];
  const aidRequests   = aidData?.aid_requests?.filter(a => a.status === "pending") ?? [];

  const totalStudents = stats?.total_students ?? students.length;
  const lunas         = stats?.paid_bills   ?? 0;
  const belumBayar    = stats?.unpaid_bills ?? 0;

  const refetchAll = () => { refetchDash(); refetchStu(); refetchAid(); };

  // ── Approve / Reject Aid Request ─────────────────────────────────────────
  const handleReject = async (id: number) => {
    setProcessingId(id);
    try {
      await apiFetch(`/school/aid-requests/${id}/reject`, { method: "POST" });
      refetchAid();
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="px-6 pt-12 pb-5" style={{ background: "linear-gradient(160deg, #1677FF 0%, #108EE9 100%)" }}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.25)" }}>
              <School size={20} color="white" />
            </div>
            <div>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.78rem" }}>Panel Admin</p>
              <p style={{ color: "white", fontWeight: 700, fontSize: "0.88rem" }}>{user?.school ?? "Sekolah"}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={refetchAll} className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.2)" }}>
              <RefreshCw size={17} color="white" />
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.2)" }}>
              <Bell size={20} color="white" />
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl p-3 text-center" style={{ background: "rgba(255,255,255,0.15)" }}>
            <p style={{ color: "white", fontSize: "1.4rem", fontWeight: 800 }}>
              {dashLoading ? "—" : totalStudents}
            </p>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.72rem" }}>Total Siswa</p>
          </div>
          <div className="rounded-2xl p-3 text-center" style={{ background: "rgba(82,196,26,0.25)" }}>
            <p style={{ color: "white", fontSize: "1.4rem", fontWeight: 800 }}>
              {dashLoading ? "—" : lunas}
            </p>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.72rem" }}>Lunas</p>
          </div>
          <div className="rounded-2xl p-3 text-center" style={{ background: "rgba(249,86,84,0.25)" }}>
            <p style={{ color: "white", fontSize: "1.4rem", fontWeight: 800 }}>
              {dashLoading ? "—" : belumBayar}
            </p>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.72rem" }}>Belum Bayar</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b" style={{ borderColor: "#F0F0F0", background: "white" }}>
        {[
          { key: "overview",   label: "Ringkasan" },
          { key: "students",   label: "Siswa" },
          { key: "campaigns",  label: "Pengajuan" + (aidRequests.length > 0 ? ` (${aidRequests.length})` : "") },
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

        {/* ── Overview Tab ── */}
        {activeTab === "overview" && (
          <div className="px-6 py-5 space-y-5">
            {/* Financial Summary */}
            <div className="bg-white rounded-3xl p-5 shadow-sm">
              <p style={{ fontWeight: 700, color: "#242424", marginBottom: "12px" }}>Ringkasan Keuangan</p>
              <div className="space-y-3">
                {dashLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="w-6 h-6 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin" />
                  </div>
                ) : [
                  { label: "Total Terkumpul",      value: formatRupiah(stats?.total_collected ?? 0), color: "#52C41A" },
                  { label: "Tagihan Belum Masuk",  value: `${belumBayar} tagihan`, color: "#F95654" },
                  { label: "Total Siswa Aktif",    value: `${totalStudents} siswa`, color: "#1677FF" },
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
                <button onClick={() => navigate("/school/bills")}
                  className="flex items-center gap-2 p-3 rounded-2xl transition-all active:scale-95"
                  style={{ background: "#EEF4FF" }}>
                  <Plus size={18} color="#1677FF" />
                  <span style={{ color: "#1677FF", fontWeight: 600, fontSize: "0.85rem" }}>Buat Tagihan</span>
                </button>
                <button onClick={() => navigate("/school/history")}
                  className="flex items-center gap-2 p-3 rounded-2xl transition-all active:scale-95"
                  style={{ background: "#FFF7E6" }}>
                  <History size={18} color="#FD9A16" />
                  <span style={{ color: "#FD9A16", fontWeight: 600, fontSize: "0.85rem" }}>Riwayat</span>
                </button>
                <button onClick={() => setShowProjectExpenseForm(true)}
                  className="flex items-center gap-2 p-3 rounded-2xl transition-all active:scale-95 col-span-2"
                  style={{ background: "#F6FFED" }}>
                  <FileText size={18} color="#52C41A" />
                  <span style={{ color: "#52C41A", fontWeight: 600, fontSize: "0.85rem" }}>Catat Pengeluaran Proyek</span>
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

        {/* ── Students Tab ── */}
        {activeTab === "students" && (
          <div className="px-6 py-5">
            <div className="flex items-center justify-between mb-4">
              <p style={{ fontWeight: 700, color: "#242424" }}>Daftar Siswa</p>
              <span style={{ color: "#8C8C8C", fontSize: "0.8rem" }}>{students.length} siswa</span>
            </div>

            {studentsLoading && (
              <div className="flex flex-col items-center py-16">
                <div className="w-10 h-10 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin mb-4" />
                <p style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>Memuat data siswa...</p>
              </div>
            )}

            <div className="space-y-3">
              {!studentsLoading && students.map((s) => {
                const billStatus = s.latest_bill?.status ?? "Belum Bayar";
                const sColor     = statusColor[billStatus] ?? "#FD9A16";
                return (
                  <div key={s.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ background: "#1677FF", fontSize: "0.9rem" }}>
                      {s.name[0]}
                    </div>
                    <div className="flex-1">
                      <p style={{ fontWeight: 600, color: "#242424", fontSize: "0.88rem" }}>{s.name}</p>
                      <p style={{ color: "#8C8C8C", fontSize: "0.76rem" }}>
                        {s.class_name} · {s.latest_bill ? formatRupiah(s.latest_bill.total) : "Belum ada tagihan"}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{ background: `${sColor}15`, color: sColor }}>
                      {billStatus}
                    </span>
                  </div>
                );
              })}

              {!studentsLoading && students.length === 0 && (
                <div className="flex flex-col items-center py-12">
                  <p style={{ color: "#8C8C8C" }}>Belum ada data siswa</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Campaigns / Aid Requests Tab ── */}
        {activeTab === "campaigns" && (
          <div className="px-6 py-5 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p style={{ fontWeight: 700, color: "#242424" }}>Manajemen Kampanye</p>
              <button
                onClick={() => setShowCampaignForm(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                style={{ background: "#1677FF" }}>
                <Plus size={14} /> Buat Baru
              </button>
            </div>

            <p style={{ fontWeight: 600, color: "#595959", fontSize: "0.85rem", marginBottom: "4px" }}>
              Pengajuan Bantuan Siswa Menunggu
            </p>

            {aidLoading && (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin" />
              </div>
            )}

            {!aidLoading && aidRequests.length === 0 ? (
              <div className="flex flex-col items-center py-12">
                <CheckCircle size={48} color="#52C41A" />
                <p style={{ color: "#8C8C8C", marginTop: "12px" }}>Semua pengajuan sudah diproses</p>
              </div>
            ) : (
              aidRequests.map((a) => {
                const studentName  = a.student?.name  ?? a.user?.name ?? "Siswa";
                const studentClass = a.student?.class_name ?? "-";
                const isProcessing = processingId === a.id;

                return (
                  <div key={a.id} className="bg-white rounded-3xl p-5 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 pr-2">
                        <p style={{ fontWeight: 700, color: "#242424", fontSize: "0.9rem", lineHeight: "1.3" }}>
                          Pengajuan Bantuan SPP
                        </p>
                        <p style={{ color: "#8C8C8C", fontSize: "0.78rem", marginTop: "2px" }}>
                          {studentName} · {studentClass}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0"
                        style={{ background: "#FFF7E6", color: "#FD9A16" }}>
                        Menunggu
                      </span>
                    </div>
                    <div className="rounded-xl p-3 mb-4" style={{ background: "#F5F7FA" }}>
                      <p style={{ color: "#595959", fontSize: "0.82rem", lineHeight: "1.5" }}>{a.reason}</p>
                    </div>
                    <p style={{ color: "#8C8C8C", fontSize: "0.75rem", marginBottom: "12px" }}>
                      {new Date(a.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    </p>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleReject(a.id)}
                        disabled={isProcessing}
                        className="flex-1 py-3 rounded-2xl disabled:opacity-50"
                        style={{ background: "#FFF2F0", color: "#F95654", fontWeight: 600, fontSize: "0.88rem" }}>
                        {isProcessing ? "..." : "Tolak"}
                      </button>
                      <button
                        onClick={() => setSelectedAidRequest({ id: a.id, name: studentName, amount: 0 })}
                        disabled={isProcessing}
                        className="flex-1 py-3 rounded-2xl text-white disabled:opacity-50"
                        style={{ background: "linear-gradient(135deg, #52C41A, #389E0D)", fontWeight: 600, fontSize: "0.88rem" }}>
                        ✓ Setujui
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      <CampaignSubmissionForm
        isOpen={showCampaignForm}
        onClose={() => setShowCampaignForm(false)}
        userRole="sekolah"
      />
      <ProjectExpenseForm
        isOpen={showProjectExpenseForm}
        onClose={() => setShowProjectExpenseForm(false)}
      />
      <ApproveAidRequestModal
        isOpen={selectedAidRequest !== null}
        onClose={() => { setSelectedAidRequest(null); refetchAid(); }}
        aidRequestId={selectedAidRequest?.id ?? null}
        studentName={selectedAidRequest?.name ?? ""}
        amount={selectedAidRequest?.amount ?? 0}
      />
    </div>
  );
}