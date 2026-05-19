import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Upload, Clock, ChevronRight, AlertCircle, CreditCard, Lightbulb } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { formatRupiah, formatK } from "../../lib/format";
import { apiFetch } from "../../config/api";
import { useApi } from "../../hooks/useApi";

const LOAN_PURPOSES = [
  "Pembayaran SPP",
  "Pembelian buku & alat tulis",
  "Biaya ujian / les tambahan",
  "Seragam sekolah",
  "Transportasi",
  "Lainnya",
];

export function LoanPage() {
  const navigate = useNavigate();
  const { user }  = useAuth();
  const [tab, setTab]     = useState<"active" | "apply">("active");
  const [amount, setAmount]   = useState("");
  const [purpose, setPurpose] = useState("");
  const [period, setPeriod]   = useState("3");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [step, setStep]   = useState<"form" | "submitting" | "submitted">("form");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: loansData, loading: loansLoading } = useApi<{aid_requests: any[]}>("/aid-requests/me");
  const activeLoans = loansData?.aid_requests ?? [];

  const handleSubmit = async () => {
    if (!amount || !purpose) return;
    setStep("submitting");
    setSubmitError(null);
    try {
      const res = await apiFetch("/aid-requests", {
        method: "POST",
        body: JSON.stringify({
          student_id: user?.student_id ?? null,
          bill_ids:   [],
          reason:     `Pengajuan Pinjaman Mikro — ${purpose} — Rp ${amount} — ${period} bulan`,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? "Gagal mengirim pengajuan");
      }
      setStep("submitted");
    } catch (err: any) {
      setSubmitError(err.message);
      setStep("form");
    }
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#F5F7FA" }}>
      {/* Header */}
      <div className="px-6 pt-12 pb-5" style={{ background: "linear-gradient(160deg, #1677FF 0%, #108EE9 100%)" }}>
        <button onClick={() => navigate("/student")} className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
          style={{ background: "rgba(255,255,255,0.2)" }}>
          <ArrowLeft size={20} color="white" />
        </button>
        <h1 style={{ color: "white", fontSize: "1.4rem", fontWeight: 800 }}>Pinjaman Mikro</h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>Dana cepat untuk kebutuhan pendidikan</p>

        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          {[{ key: "active", label: "Pinjaman Aktif" }, { key: "apply", label: "Ajukan Pinjaman" }].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as "active" | "apply")}
              className="px-4 py-1.5 rounded-full transition-all"
              style={{
                background: tab === t.key ? "white" : "rgba(255,255,255,0.2)",
                color: tab === t.key ? "#1677FF" : "white",
                fontWeight: 600,
                fontSize: "0.82rem",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-6 py-5 overflow-y-auto pb-24">
        {/* ── Tab: Pinjaman Aktif ── */}
        {tab === "active" && (
          <div>
            {loansLoading ? (
              <div className="flex justify-center py-12"><div className="animate-pulse w-8 h-8 rounded-full bg-blue-200"></div></div>
            ) : activeLoans.length === 0 ? (
              <div className="flex flex-col items-center py-14">
                <div className="w-24 h-24 rounded-full flex items-center justify-center mb-5"
                  style={{ background: "#EEF4FF", color: "#1677FF" }}>
                  <CreditCard size={40} />
                </div>
                <p style={{ fontWeight: 800, color: "#242424", fontSize: "1.1rem", textAlign: "center", marginBottom: "8px" }}>
                  Tidak Ada Pinjaman Aktif
                </p>
                <p style={{ color: "#8C8C8C", textAlign: "center", fontSize: "0.87rem", lineHeight: "1.6", marginBottom: "24px" }}>
                  Kamu belum memiliki pinjaman aktif saat ini.{"\n"}
                  Ajukan pinjaman mikro untuk kebutuhan pendidikanmu.
                </p>
                <button onClick={() => setTab("apply")}
                  className="px-6 py-3 rounded-2xl text-white font-bold"
                  style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)" }}>
                  Ajukan Pinjaman
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {activeLoans.map((loan) => (
                  <div key={loan.id} className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p style={{ fontWeight: 700, color: "#242424", fontSize: "0.95rem" }}>Pengajuan Pinjaman</p>
                        <p style={{ color: "#8C8C8C", fontSize: "0.75rem" }}>{new Date(loan.created_at).toLocaleDateString("id-ID")}</p>
                      </div>
                      <span className="px-2 py-1 rounded-full" style={{
                        background: loan.status === 'approved' ? "#F6FFED" : loan.status === 'rejected' ? "#FFF2F0" : "#FFF7E6",
                        color: loan.status === 'approved' ? "#52C41A" : loan.status === 'rejected' ? "#F95654" : "#FD9A16",
                        fontSize: "0.7rem", fontWeight: 700
                      }}>
                        {loan.status === 'approved' ? "Disetujui" : loan.status === 'rejected' ? "Ditolak" : "Pending"}
                      </span>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p style={{ color: "#595959", fontSize: "0.82rem", lineHeight: "1.4" }}>
                        {loan.reason}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Ajukan Pinjaman ── */}
        {tab === "apply" && (
          <div>
            {step === "submitted" ? (
              <div className="flex flex-col items-center py-12">
                <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
                  style={{ background: "#FFF7E6" }}>
                  <Clock size={48} color="#FD9A16" />
                </div>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#242424", textAlign: "center", marginBottom: "8px" }}>
                  Pengajuan Terkirim!
                </h2>
                <p style={{ color: "#8C8C8C", textAlign: "center", marginBottom: "24px", fontSize: "0.9rem" }}>
                  Pengajuan pinjaman kamu sedang ditinjau oleh tim EDUFIN. Biasanya diproses dalam 1-2 hari kerja.
                </p>
                <div className="w-full rounded-2xl p-4 mb-6" style={{ background: "#FFF7E6", border: "1px solid #FFD591" }}>
                  <div className="flex justify-between mb-2">
                    <span style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>Jumlah</span>
                    <span style={{ fontWeight: 700, color: "#242424", fontSize: "0.85rem" }}>{formatRupiah(parseInt(amount) || 0)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>Tujuan</span>
                    <span style={{ fontWeight: 600, color: "#242424", fontSize: "0.85rem" }}>{purpose}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>Cicilan</span>
                    <span style={{ fontWeight: 600, color: "#242424", fontSize: "0.85rem" }}>{period} bulan</span>
                  </div>
                </div>
                <button onClick={() => navigate("/student")}
                  className="w-full py-4 rounded-2xl text-white"
                  style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)", fontWeight: 700 }}>
                  Kembali ke Beranda
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Info */}
                <div className="rounded-2xl p-4" style={{ background: "#EEF4FF" }}>
                  <p className="flex items-center gap-1.5" style={{ fontWeight: 700, color: "#1677FF", fontSize: "0.9rem", marginBottom: "4px" }}>
                    <Lightbulb size={16} /> Tentang Pinjaman Mikro EDUFIN
                  </p>
                  <p style={{ color: "#595959", fontSize: "0.82rem", lineHeight: "1.5" }}>
                    Pinjaman tanpa bunga untuk kebutuhan pendidikan. Maksimal Rp 3.000.000 dengan cicilan 3-12 bulan.
                  </p>
                </div>

                {/* Error */}
                {submitError && (
                  <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: "#FFF2F0" }}>
                    <AlertCircle size={18} color="#F95654" />
                    <p style={{ color: "#F95654", fontSize: "0.85rem" }}>{submitError}</p>
                  </div>
                )}

                {/* Amount */}
                <div>
                  <label style={{ fontSize: "0.9rem", fontWeight: 600, color: "#242424", display: "block", marginBottom: "8px" }}>
                    Jumlah Pinjaman
                  </label>
                  <div className="bg-white rounded-2xl px-4 py-3.5 shadow-sm" style={{ border: "1.5px solid", borderColor: amount ? "#1677FF" : "transparent" }}>
                    <div className="flex items-center gap-2">
                      <span style={{ color: "#8C8C8C", fontWeight: 600 }}>Rp</span>
                      <input
                        type="number"
                        placeholder="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="flex-1 bg-transparent outline-none"
                        style={{ fontSize: "1rem", color: "#242424" }}
                        max={3000000}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {[500000, 1000000, 1500000, 2000000].map((v) => (
                      <button
                        key={v}
                        onClick={() => setAmount(String(v))}
                        className="flex-1 py-1.5 rounded-lg text-xs font-semibold"
                        style={{ background: amount === String(v) ? "#1677FF" : "#F5F7FA", color: amount === String(v) ? "white" : "#595959" }}>
                        {v / 1000}rb
                      </button>
                    ))}
                  </div>
                </div>

                {/* Purpose */}
                <div>
                  <label style={{ fontSize: "0.9rem", fontWeight: 600, color: "#242424", display: "block", marginBottom: "8px" }}>
                    Tujuan Penggunaan
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {LOAN_PURPOSES.map((p) => (
                      <button
                        key={p}
                        onClick={() => setPurpose(p)}
                        className="py-2.5 px-3 rounded-xl text-left transition-all"
                        style={{
                          background: purpose === p ? "#EEF4FF" : "white",
                          border: "1.5px solid",
                          borderColor: purpose === p ? "#1677FF" : "#F0F0F0",
                          color: purpose === p ? "#1677FF" : "#595959",
                          fontSize: "0.8rem",
                          fontWeight: purpose === p ? 600 : 400,
                        }}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Period */}
                <div>
                  <label style={{ fontSize: "0.9rem", fontWeight: 600, color: "#242424", display: "block", marginBottom: "8px" }}>
                    Periode Cicilan
                  </label>
                  <div className="flex gap-2">
                    {["3", "6", "9", "12"].map((p) => (
                      <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        className="flex-1 py-3 rounded-xl font-semibold transition-all"
                        style={{
                          background: period === p ? "#1677FF" : "white",
                          color: period === p ? "white" : "#595959",
                          border: "1.5px solid",
                          borderColor: period === p ? "#1677FF" : "#F0F0F0",
                        }}>
                        {p} bln
                      </button>
                    ))}
                  </div>
                </div>

                {/* Upload */}
                <div>
                  <label style={{ fontSize: "0.9rem", fontWeight: 600, color: "#242424", display: "block", marginBottom: "8px" }}>
                    Dokumen Pendukung
                  </label>
                  <label
                    htmlFor="loan-file-input"
                    className="rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all"
                    style={{
                      border: uploadedFile ? "2px solid #1677FF" : "2px dashed #D9D9D9",
                      background: uploadedFile ? "#EEF4FF" : "#FAFAFA",
                    }}>
                    <input id="loan-file-input" type="file" accept="image/*,.pdf" className="hidden"
                      onChange={(e) => setUploadedFile(e.target.files?.[0] ?? null)} />
                    <Upload size={28} color={uploadedFile ? "#1677FF" : "#BFBFBF"} />
                    {uploadedFile ? (
                      <div className="text-center mt-2">
                        <p style={{ color: "#1677FF", fontSize: "0.85rem", fontWeight: 600 }}>{uploadedFile.name}</p>
                        <p style={{ color: "#8C8C8C", fontSize: "0.72rem" }}>{(uploadedFile.size / 1024).toFixed(1)} KB — Klik untuk ganti</p>
                      </div>
                    ) : (
                      <>
                        <p style={{ color: "#8C8C8C", fontSize: "0.85rem", marginTop: "8px", textAlign: "center" }}>
                          Unggah kartu pelajar atau tagihan sekolah
                        </p>
                        <span className="mt-3 px-4 py-2 rounded-xl"
                          style={{ background: "#EEF4FF", color: "#1677FF", fontSize: "0.82rem", fontWeight: 600 }}>
                          Pilih File
                        </span>
                      </>
                    )}
                  </label>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!amount || !purpose || step === "submitting"}
                  className="w-full py-4 rounded-2xl text-white disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)", fontWeight: 700, fontSize: "1rem" }}>
                  {step === "submitting" ? "Mengirim..." : "Ajukan Pinjaman"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
