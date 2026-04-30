import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, CheckCircle, Download, ChevronRight, RefreshCw } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useApi } from "../../hooks/useApi";
import { apiFetch } from "../../../config/api";
import { formatRupiah } from "../../lib/format";

// ─── Types ──────────────────────────────────────────────────────────────────
interface BillItem { name: string; amount: number; }
interface Bill {
  id: number;
  month: string;
  status: "Lunas" | "Tertunggak" | "Menunggu Pembayaran";
  due_date: string;
  total_amount: number;
  items: BillItem[];
}
interface Student { nisn: string; school_name: string; class_name: string; }
interface BillsResponse { bills: Bill[]; students: Student[]; }

const PAYMENT_METHODS = [
  { id: "bca",       label: "Transfer Bank BCA",       icon: "🏦", note: "No. Rek: 1234-5678-9012" },
  { id: "bni",       label: "Virtual Account BNI",     icon: "🏦", note: "VA otomatis dikirim via notifikasi" },
  { id: "qris",      label: "QRIS (GoPay / OVO / DANA)", icon: "📱", note: "Scan QR di halaman berikutnya" },
  { id: "indomaret", label: "Indomaret / Alfamart",    icon: "🏪", note: "Kode bayar dikirim via SMS" },
];

type CicilanOption = "penuh" | "2x" | "3x";
type Step = "list" | "checkout" | "confirm" | "success";

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  } catch { return dateStr; }
}

export function PaySPP() {
  const navigate        = useNavigate();
  const [params]        = useSearchParams();
  const { user }        = useAuth();

  const [selected, setSelected]         = useState<number[]>([]);
  const [step, setStep]                 = useState<Step>("list");
  const [cicilanOption, setCicilanOption] = useState<CicilanOption>(
    params.get("mode") === "cicilan" ? "2x" : "penuh"
  );
  const [payMethod, setPayMethod]       = useState("");
  const [payLoading, setPayLoading]     = useState(false);
  const [receiptNo, setReceiptNo]       = useState("");
  const [apiError, setApiError]         = useState("");

  const { data, loading, error, refetch } = useApi<BillsResponse>("/student/bills");

  const bills    = data?.bills    ?? [];
  const students = data?.students ?? [];
  const student  = students[0];

  const unpaid        = bills.filter((b) => b.status !== "Lunas");
  const selectedBills = bills.filter((b) => selected.includes(b.id));
  const subtotal      = selectedBills.reduce((acc, b) => acc + b.total_amount, 0);

  // Auto-select tagihan tertunggak pertama saat data load
  useEffect(() => {
    if (unpaid.length > 0 && selected.length === 0) {
      setSelected([unpaid[0].id]);
    }
  }, [bills.length]); // eslint-disable-line

  const firstPayment =
    cicilanOption === "penuh" ? subtotal :
    cicilanOption === "2x"   ? Math.ceil(subtotal / 2) :
                               Math.ceil(subtotal / 3);

  const toggleSelect = (id: number) => {
    const bill = bills.find((b) => b.id === id);
    if (!bill || bill.status === "Lunas") return;
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const selectedMethod = PAYMENT_METHODS.find((m) => m.id === payMethod);

  // ─── SUCCESS ──────────────────────────────────────────────────────────────
  if (step === "success") {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6" style={{ background: "#F6FFED" }}>
            <CheckCircle size={52} color="#52C41A" />
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#242424", marginBottom: "8px", textAlign: "center" }}>
            {cicilanOption === "penuh" ? "Pembayaran Berhasil!" : "Cicilan Pertama Berhasil!"}
          </h2>
          <p style={{ color: "#8C8C8C", textAlign: "center", marginBottom: "32px", fontSize: "0.9rem" }}>
            {cicilanOption === "penuh"
              ? "SPP kamu telah berhasil dibayarkan secara penuh"
              : `Cicilan 1/${cicilanOption === "2x" ? "2" : "3"} berhasil.`}
          </p>

          {/* E-Receipt */}
          <div className="w-full rounded-3xl overflow-hidden shadow-md" style={{ border: "1px solid #F0F0F0" }}>
            <div className="px-5 py-4" style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)" }}>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.8rem" }}>No. Kwitansi</p>
              <p style={{ color: "white", fontWeight: 700 }}>{receiptNo}</p>
            </div>
            <div className="px-5 py-4 space-y-3">
              {[
                ["Nama",         user?.name],
                ["NISN",         student?.nisn ?? "—"],
                ["Sekolah",      student?.school_name ?? "—"],
                ["Bulan Bayar",  selectedBills.map(b => b.month).join(", ")],
                ["Jenis Bayar",  cicilanOption === "penuh" ? "Penuh" : `Cicilan ${cicilanOption}`],
                ["Metode",       selectedMethod?.label ?? "—"],
                ["Waktu",        new Date().toLocaleString("id-ID")],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between">
                  <span style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>{label}</span>
                  <span style={{ fontWeight: 600, color: "#242424", fontSize: "0.85rem" }}>{val}</span>
                </div>
              ))}
              <div className="h-px" style={{ background: "#F0F0F0" }} />
              <div className="flex justify-between">
                <span style={{ fontWeight: 700, color: "#242424" }}>
                  {cicilanOption === "penuh" ? "Total Dibayar" : "Bayar Sekarang"}
                </span>
                <span style={{ fontWeight: 800, color: "#1677FF" }}>{formatRupiah(firstPayment)}</span>
              </div>
            </div>
          </div>

          <button
            className="w-full mt-4 py-3.5 rounded-2xl flex items-center justify-center gap-2"
            style={{ background: "#F5F7FA", color: "#1677FF", fontWeight: 600 }}
          >
            <Download size={18} /> Unduh E-Receipt (PDF)
          </button>
          <button
            onClick={() => navigate("/student")}
            className="w-full mt-3 py-3.5 rounded-2xl text-white"
            style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)", fontWeight: 700 }}
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  // ─── CONFIRM ──────────────────────────────────────────────────────────────
  if (step === "confirm") {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <div className="px-6 pt-12 pb-4">
          <button onClick={() => setStep("checkout")}
            className="w-10 h-10 rounded-full flex items-center justify-center mb-6"
            style={{ background: "#F5F7FA" }}>
            <ArrowLeft size={20} color="#242424" />
          </button>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#242424" }}>Konfirmasi Pembayaran</h1>
        </div>

        <div className="flex-1 px-6 overflow-y-auto space-y-4 pb-52">
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #F0F0F0" }}>
            {selectedBills.map((b) => (
              <div key={b.id}>
                <div className="px-4 py-3" style={{ background: "#EEF4FF" }}>
                  <p style={{ fontWeight: 700, color: "#1677FF", fontSize: "0.9rem" }}>{b.month}</p>
                </div>
                {b.items.map((item) => (
                  <div key={item.name} className="flex justify-between px-4 py-2.5" style={{ borderBottom: "1px solid #F5F7FA" }}>
                    <span style={{ color: "#595959", fontSize: "0.85rem" }}>{item.name}</span>
                    <span style={{ fontWeight: 600, color: "#242424", fontSize: "0.85rem" }}>{formatRupiah(item.amount)}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-4 space-y-3" style={{ background: "#F5F7FA" }}>
            {[
              ["Jenis Pembayaran", cicilanOption === "penuh" ? "Penuh" : `Cicilan ${cicilanOption} (Gratis)`],
              ["Metode", selectedMethod?.label ?? "—"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>{k}</span>
                <span style={{ fontWeight: 600, color: "#242424", fontSize: "0.85rem" }}>{v}</span>
              </div>
            ))}
          </div>

          {apiError && (
            <div className="rounded-2xl p-3" style={{ background: "#FFF2F0", border: "1px solid #FFCCC7" }}>
              <p style={{ color: "#CF1322", fontSize: "0.82rem" }}>⚠️ {apiError}</p>
            </div>
          )}
        </div>

        <div className="fixed bottom-[72px] left-1/2 w-full max-w-[430px] px-6 py-4"
          style={{ transform: "translateX(-50%)", background: "white", boxShadow: "0 -4px 20px rgba(0,0,0,0.08)" }}>
          <div className="flex justify-between mb-1">
            <span style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>
              {cicilanOption === "penuh" ? "Total Pembayaran" : "Bayar Sekarang"}
            </span>
            <span style={{ fontWeight: 800, color: "#1677FF", fontSize: "1.1rem" }}>{formatRupiah(firstPayment)}</span>
          </div>
          <button
            onClick={async () => {
              setPayLoading(true);
              setApiError("");
              try {
                const res  = await apiFetch("/payment/create", {
                  method: "POST",
                  body: JSON.stringify({
                    bill_ids:       selected,
                    payment_method: payMethod,
                    payment_type:   cicilanOption,
                    amount_paid:    firstPayment,
                  }),
                });
                const data = await res.json();
                if (res.ok && data.success) {
                  setReceiptNo(data.receipt_no ?? "EDU" + Date.now());
                  refetch(); // refresh tagihan setelah bayar
                  setStep("success");
                } else {
                  setApiError(data.message ?? "Pembayaran gagal. Coba lagi.");
                }
              } catch {
                setApiError("Tidak bisa terhubung ke server. Pastikan Laravel berjalan.");
              } finally {
                setPayLoading(false);
              }
            }}
            className="w-full py-4 rounded-2xl text-white"
            style={{
              background: "linear-gradient(135deg, #1677FF, #108EE9)",
              fontWeight: 700, fontSize: "1rem",
              opacity: payLoading ? 0.7 : 1,
            }}
          >
            {payLoading ? "Memproses..." : "Konfirmasi & Bayar"}
          </button>
        </div>
      </div>
    );
  }

  // ─── CHECKOUT ─────────────────────────────────────────────────────────────
  if (step === "checkout") {
    const CICILAN_OPTIONS: { key: CicilanOption; label: string; sub: string; badge?: string }[] = [
      { key: "penuh", label: "Bayar Penuh",  sub: `${formatRupiah(subtotal)} (1x bayar)` },
      { key: "2x",    label: "Cicilan 2x",   sub: `${formatRupiah(Math.ceil(subtotal / 2))} × 2 kali · tgl 1 & 15`, badge: "Gratis" },
      { key: "3x",    label: "Cicilan 3x",   sub: `${formatRupiah(Math.ceil(subtotal / 3))} × 3 kali · tgl 1, 10 & 20`, badge: "Gratis" },
    ];

    return (
      <div className="flex flex-col min-h-screen" style={{ background: "#F5F7FA" }}>
        <div className="px-6 pt-12 pb-5" style={{ background: "linear-gradient(160deg, #1677FF 0%, #108EE9 100%)" }}>
          <button onClick={() => setStep("list")}
            className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
            style={{ background: "rgba(255,255,255,0.2)" }}>
            <ArrowLeft size={20} color="white" />
          </button>
          <h1 style={{ color: "white", fontSize: "1.4rem", fontWeight: 800 }}>Pilih Cara Bayar</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>Tagihan: {formatRupiah(subtotal)}</p>
        </div>

        <div className="flex-1 px-6 py-5 overflow-y-auto pb-52 space-y-5">
          <div>
            <p style={{ fontWeight: 700, color: "#242424", marginBottom: "12px" }}>Jenis Pembayaran</p>
            <div className="space-y-3">
              {CICILAN_OPTIONS.map((opt) => (
                <button key={opt.key} onClick={() => setCicilanOption(opt.key)}
                  className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl bg-white shadow-sm transition-all active:scale-[0.98]"
                  style={{ border: "2px solid", borderColor: cicilanOption === opt.key ? "#1677FF" : "transparent" }}>
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    style={{
                      borderColor: cicilanOption === opt.key ? "#1677FF" : "#D9D9D9",
                      background:  cicilanOption === opt.key ? "#1677FF" : "transparent",
                    }}>
                    {cicilanOption === opt.key && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <p style={{ fontWeight: 700, color: "#242424", fontSize: "0.9rem" }}>{opt.label}</p>
                      {opt.badge && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: "#F6FFED", color: "#52C41A" }}>
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    <p style={{ color: "#8C8C8C", fontSize: "0.8rem" }}>{opt.sub}</p>
                  </div>
                  {cicilanOption === opt.key && <ChevronRight size={16} color="#1677FF" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontWeight: 700, color: "#242424", marginBottom: "12px" }}>Metode Pembayaran</p>
            <div className="space-y-2">
              {PAYMENT_METHODS.map((m) => (
                <button key={m.id} onClick={() => setPayMethod(m.id)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white shadow-sm transition-all active:scale-[0.98]"
                  style={{ border: "1.5px solid", borderColor: payMethod === m.id ? "#1677FF" : "transparent" }}>
                  <span style={{ fontSize: "1.3rem" }}>{m.icon}</span>
                  <div className="flex-1 text-left">
                    <p style={{ fontWeight: 600, color: "#242424", fontSize: "0.88rem" }}>{m.label}</p>
                    <p style={{ color: "#8C8C8C", fontSize: "0.78rem" }}>{m.note}</p>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    style={{ borderColor: payMethod === m.id ? "#1677FF" : "#D9D9D9" }}>
                    {payMethod === m.id && <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#1677FF" }} />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="fixed bottom-[72px] left-1/2 w-full max-w-[430px] px-6 py-4"
          style={{ transform: "translateX(-50%)", background: "white", boxShadow: "0 -4px 20px rgba(0,0,0,0.08)" }}>
          <div className="flex justify-between mb-3">
            <span style={{ color: "#8C8C8C", fontSize: "0.9rem" }}>
              {cicilanOption === "penuh" ? "Total Bayar" : "Bayar Sekarang"}
            </span>
            <span style={{ fontWeight: 800, color: "#1677FF", fontSize: "1.05rem" }}>{formatRupiah(firstPayment)}</span>
          </div>
          <button onClick={() => setStep("confirm")} disabled={!payMethod}
            className="w-full py-4 rounded-2xl text-white disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)", fontWeight: 700, fontSize: "1rem" }}>
            Lanjutkan
          </button>
        </div>
      </div>
    );
  }

  // ─── LIST (default) ───────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#F5F7FA" }}>
      <div className="px-6 pt-12 pb-5" style={{ background: "linear-gradient(160deg, #1677FF 0%, #108EE9 100%)" }}>
        <button onClick={() => navigate("/student")}
          className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
          style={{ background: "rgba(255,255,255,0.2)" }}>
          <ArrowLeft size={20} color="white" />
        </button>
        <h1 style={{ color: "white", fontSize: "1.4rem", fontWeight: 800 }}>Pembayaran SPP</h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>
          {student?.school_name ?? user?.school ?? ""}
        </p>
      </div>

      <div className="flex-1 px-6 py-5 overflow-y-auto pb-52">
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                <div className="h-5 w-32 rounded mb-3" style={{ background: "#F0F0F0" }} />
                <div className="h-4 w-full rounded mb-2" style={{ background: "#F0F0F0" }} />
                <div className="h-4 w-3/4 rounded" style={{ background: "#F0F0F0" }} />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center py-12">
            <span style={{ fontSize: "3rem" }}>⚠️</span>
            <p style={{ color: "#8C8C8C", margin: "12px 0", textAlign: "center" }}>Gagal memuat tagihan</p>
            <button onClick={refetch} className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{ background: "#EEF4FF", color: "#1677FF", fontWeight: 600, fontSize: "0.85rem" }}>
              <RefreshCw size={14} /> Coba Lagi
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {unpaid.length > 0 && (
              <div className="flex items-start gap-3 px-4 py-3 rounded-2xl mb-5"
                style={{ background: "#FFF2F0", border: "1px solid #FFCCC7" }}>
                <span style={{ fontSize: "1.2rem" }}>⚠️</span>
                <div>
                  <p style={{ color: "#CF1322", fontWeight: 700, fontSize: "0.85rem" }}>Tagihan Tertunggak</p>
                  <p style={{ color: "#CF1322", fontSize: "0.8rem" }}>
                    {unpaid.length} tagihan belum dibayar · Total {formatRupiah(unpaid.reduce((s, b) => s + b.total_amount, 0))}
                  </p>
                </div>
              </div>
            )}

            <p style={{ fontWeight: 700, color: "#242424", marginBottom: "12px" }}>Pilih Tagihan</p>
            <div className="space-y-3">
              {bills.map((bill) => {
                const isSelected = selected.includes(bill.id);
                const isPaid     = bill.status === "Lunas";
                return (
                  <div
                    key={bill.id}
                    onClick={() => toggleSelect(bill.id)}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm transition-all"
                    style={{
                      border: "2px solid",
                      borderColor: isSelected && !isPaid ? "#1677FF" : "transparent",
                      opacity: isPaid ? 0.7 : 1,
                      cursor: isPaid ? "default" : "pointer",
                    }}
                  >
                    <div className="px-4 py-3 flex items-center justify-between"
                      style={{ background: isPaid ? "#F6FFED" : "#FFF2F0" }}>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                          style={{
                            borderColor: isPaid ? "#52C41A" : isSelected ? "#1677FF" : "#D9D9D9",
                            background:  isPaid ? "#52C41A" : isSelected ? "#1677FF"  : "transparent",
                          }}>
                          {(isPaid || isSelected) && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <p style={{ fontWeight: 700, color: "#242424", fontSize: "0.9rem" }}>{bill.month}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{
                          background: isPaid ? "rgba(82,196,26,0.15)" : "rgba(249,86,84,0.15)",
                          color:      isPaid ? "#52C41A"               : "#F95654",
                        }}>
                        {bill.status}
                      </span>
                    </div>
                    <div className="px-4 py-3">
                      {bill.items.map((item) => (
                        <div key={item.name} className="flex justify-between py-1">
                          <span style={{ color: "#8C8C8C", fontSize: "0.82rem" }}>{item.name}</span>
                          <span style={{ color: "#595959", fontSize: "0.82rem" }}>{formatRupiah(item.amount)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between pt-2 mt-1" style={{ borderTop: "1px solid #F0F0F0" }}>
                        <span style={{ fontWeight: 700, color: "#242424", fontSize: "0.88rem" }}>Subtotal</span>
                        <span style={{ fontWeight: 700, color: "#242424", fontSize: "0.88rem" }}>
                          {formatRupiah(bill.total_amount)}
                        </span>
                      </div>
                      <p style={{ color: "#BFBFBF", fontSize: "0.75rem", marginTop: "2px" }}>
                        Jatuh tempo: {formatDate(bill.due_date)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {selected.length > 0 && (
        <div className="fixed bottom-[72px] left-1/2 w-full max-w-[430px] px-6 py-4"
          style={{ transform: "translateX(-50%)", background: "white", boxShadow: "0 -4px 20px rgba(0,0,0,0.08)" }}>
          <div className="flex justify-between mb-3">
            <span style={{ color: "#8C8C8C", fontSize: "0.9rem" }}>Total {selected.length} tagihan</span>
            <span style={{ fontWeight: 800, color: "#1677FF", fontSize: "1.05rem" }}>{formatRupiah(subtotal)}</span>
          </div>
          <button onClick={() => setStep("checkout")}
            className="w-full py-4 rounded-2xl text-white"
            style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)", fontWeight: 700, fontSize: "1rem" }}>
            Pilih Cara Bayar →
          </button>
        </div>
      )}
    </div>
  );
}