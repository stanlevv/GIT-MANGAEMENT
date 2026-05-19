import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  CheckCircle, 
  Download, 
  ChevronRight, 
  RefreshCw, 
  CreditCard, 
  Wallet, 
  Building2, 
  QrCode,
  Info,
  Calendar,
  AlertTriangle,
  ChevronLeft
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useApi } from "../../hooks/useApi";
import { apiFetch } from "../../config/api";
import { formatRupiah } from "../../lib/format";

// --- Types ---
interface BillItem { name: string; amount: number; }
interface Bill {
  id: number;
  month: string;
  status: "Lunas" | "Tertunggak" | "Menunggu Pembayaran";
  due_date: string;
  total_amount: number;
  items: BillItem[];
}
interface Student { 
  id: number;
  name: string;
  nisn: string; 
  school_name: string; 
  class_name: string; 
  parent_name: string;
}
interface BillsResponse { bills: Bill[]; students: Student[]; }

const PAYMENT_METHODS = [
  { id: "BCAVA",     label: "BCA Virtual Account",     icon: <Building2 className="w-5 h-5" />, note: "Verifikasi Otomatis" },
  { id: "BNIVA",     label: "BNI Virtual Account",     icon: <Building2 className="w-5 h-5" />, note: "Verifikasi Otomatis" },
  { id: "BRIVA",     label: "BRI Virtual Account",     icon: <Building2 className="w-5 h-5" />, note: "Verifikasi Otomatis" },
  { id: "QRISC",     label: "QRIS (GoPay/OVO/DANA)",   icon: <QrCode className="w-5 h-5" />, note: "Scan kode QR" },
  { id: "ALFAMART",  label: "Alfamart / Alfamidi",     icon: <CreditCard className="w-5 h-5" />, note: "Tunjukkan kode di kasir" },
  { id: "INDOMARET", label: "Indomaret",               icon: <CreditCard className="w-5 h-5" />, note: "Tunjukkan kode di kasir" },
];

type CicilanOption = "penuh" | "2x" | "3x";
type Step = "list" | "checkout" | "confirm" | "success";

export function PaySPP() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { user } = useAuth();

  const [selected, setSelected] = useState<number[]>([]);
  const [step, setStep] = useState<Step>("list");
  const [cicilanOption, setCicilanOption] = useState<CicilanOption>(
    params.get("mode") === "cicilan" ? "2x" : "penuh"
  );
  const [payMethod, setPayMethod] = useState("");
  const [payLoading, setPayLoading] = useState(false);
  const [receiptNo, setReceiptNo] = useState("");
  const [apiError, setApiError] = useState("");

  // --- DATA FETCHING ---
  const { data: resData, loading, error, refetch } = useApi<BillsResponse>("/student/bills");

  const bills = resData?.bills?.map((b: any) => ({
    ...b,
    total_amount: Number(b.total_amount),
    items: typeof b.items === "string" ? JSON.parse(b.items) : b.items
  })) ?? [];

  const student = resData?.students?.[0];
  const unpaid = bills.filter((b) => b.status !== "Lunas");
  const selectedBills = bills.filter((b) => selected.includes(b.id));
  const subtotal = selectedBills.reduce((acc, b) => acc + b.total_amount, 0);

  // Auto-select unpaid bill on load
  useEffect(() => {
    if (unpaid.length > 0 && selected.length === 0) {
      setSelected([unpaid[0].id]);
    }
  }, [bills.length]); // eslint-disable-line

  const firstPayment =
    cicilanOption === "penuh" ? subtotal :
    cicilanOption === "2x" ? Math.ceil(subtotal / 2) :
    Math.ceil(subtotal / 3);

  const toggleSelect = (id: number) => {
    const bill = bills.find((b) => b.id === id);
    if (!bill || bill.status === "Lunas") return;
    setSelected((prev) => 
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectedMethod = PAYMENT_METHODS.find((m) => m.id === payMethod);

  // --- SUCCESS STEP ---
  if (step === "success") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100 overflow-hidden"
        >
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-center text-white relative">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-black mb-1">Pembayaran Berhasil!</h2>
              <p className="text-blue-100 text-sm">
                {cicilanOption === "penuh" ? "Lunas dibayarkan" : `Cicilan ${cicilanOption} diterima`}
              </p>
            </motion.div>
          </div>

          <div className="p-8">
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <span className="text-slate-400 text-xs font-bold uppercase">No. Kwitansi</span>
                <span className="text-slate-900 font-mono font-bold">{receiptNo}</span>
              </div>
              
              <div className="space-y-3">
                {[
                  ["Siswa", student?.name ?? user?.name],
                  ["Kelas", `Kelas ${student?.class_name ?? user?.class ?? "X"}`],
                  ["Sekolah", student?.school_name ?? user?.school ?? "-"],
                  ["Periode", selectedBills.map(b => b.month).join(", ")],
                  ["Metode", selectedMethod?.label],
                  ["Status", "Berhasil"]
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-slate-400 font-medium">{label}</span>
                    <span className="text-slate-900 font-bold">{val}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                <span className="text-slate-900 font-black">Total Dibayar</span>
                <span className="text-blue-600 text-xl font-black">{formatRupiah(firstPayment)}</span>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
                <Download className="w-5 h-5" /> Unduh Kwitansi
              </button>
              <button 
                onClick={() => navigate("/student")}
                className="w-full py-4 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-bold hover:bg-slate-50 transition-all"
              >
                Ke Dashboard
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-44">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-[#1677FF] pt-12 pb-24 px-6">
        <div className="absolute top-0 left-0 w-full h-full">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-20" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              x: [0, 50, 0],
            }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-400 rounded-full blur-3xl opacity-20" 
          />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => step === "list" ? navigate("/student") : setStep(step === "checkout" ? "list" : "checkout")}
              className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                {step === "list" ? "Pembayaran SPP" : step === "checkout" ? "Pilih Metode" : "Konfirmasi"}
              </h1>
              <p className="text-blue-100/80 text-sm font-medium">
                {student?.school_name || user?.school || "SMA 3 Malang"} • Kelas {student?.class_name || user?.class || "X"}
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-2xl rounded-[2rem] border border-white/20 p-6 shadow-xl">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-blue-100/70 text-xs font-bold uppercase tracking-widest mb-1">
                  {step === "list" ? "Total Tagihan" : "Total Bayar"}
                </p>
                <h2 className="text-4xl font-black text-white tabular-nums">
                  {formatRupiah(step === "list" ? bills.reduce((s, b) => s + b.total_amount, 0) : firstPayment)}
                </h2>
              </div>
              <div className="bg-emerald-400/20 text-emerald-300 px-4 py-2 rounded-xl border border-emerald-400/30 text-xs font-bold">
                Aktif
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-2xl mx-auto px-6 -mt-12 relative z-20">
        <AnimatePresence mode="wait">
          {step === "list" && (
            <motion.div 
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {unpaid.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-3xl p-4 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-600">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-amber-900 font-bold text-sm">Ada {unpaid.length} tagihan tertunggak</p>
                    <p className="text-amber-700 text-xs mt-0.5">Segera lakukan pembayaran untuk menghindari denda administrasi.</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-slate-900 font-black text-lg px-2">Daftar Tagihan</h3>
                {loading ? (
                  [1, 2, 3].map(i => (
                    <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 animate-pulse h-32" />
                  ))
                ) : error ? (
                  <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100">
                    <RefreshCw className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Gagal memuat data tagihan</p>
                    <button onClick={refetch} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm">Coba Lagi</button>
                  </div>
                ) : (
                  bills.map((bill) => (
                    <motion.div
                      key={bill.id}
                      onClick={() => toggleSelect(bill.id)}
                      whileTap={{ scale: 0.98 }}
                      className={`group relative bg-white rounded-[2rem] p-6 shadow-sm border-2 transition-all cursor-pointer ${
                        selected.includes(bill.id) ? "border-blue-500 shadow-blue-100 shadow-lg" : "border-white hover:border-slate-200"
                      } ${bill.status === "Lunas" ? "opacity-60 cursor-default" : ""}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            selected.includes(bill.id) ? "bg-blue-600 border-blue-600" : "border-slate-200"
                          }`}>
                            {selected.includes(bill.id) && <CheckCircle className="w-4 h-4 text-white" />}
                          </div>
                          <div>
                            <p className="text-slate-900 font-black text-lg">{bill.month}</p>
                            <p className="text-slate-400 text-xs font-bold">Jatuh Tempo: {bill.due_date}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
                          bill.status === "Lunas" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                        }`}>
                          {bill.status}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        {bill.items.map((item: any) => (
                          <div key={item.name} className="flex justify-between text-sm">
                            <span className="text-slate-400 font-medium">{item.name}</span>
                            <span className="text-slate-600 font-bold">{formatRupiah(item.amount)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                        <span className="text-slate-900 font-black text-lg">{formatRupiah(bill.total_amount)}</span>
                        <ChevronRight className={`w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-all ${selected.includes(bill.id) ? "translate-x-1 text-blue-500" : ""}`} />
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {step === "checkout" && (
            <motion.div 
              key="checkout"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <section>
                <h3 className="text-slate-900 font-black text-lg px-2 mb-4">Metode Pembayaran</h3>
                <div className="grid grid-cols-1 gap-3">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPayMethod(m.id)}
                      className={`flex items-center gap-4 p-5 rounded-3xl bg-white border-2 transition-all ${
                        payMethod === m.id ? "border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-100" : "border-white shadow-sm hover:border-slate-200"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                        payMethod === m.id ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
                      }`}>
                        {m.icon}
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-slate-900 font-black text-sm">{m.label}</p>
                        <p className="text-slate-400 text-xs font-medium">{m.note}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        payMethod === m.id ? "border-blue-600 bg-blue-600" : "border-slate-200"
                      }`}>
                        {payMethod === m.id && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between px-2 mb-4">
                  <h3 className="text-slate-900 font-black text-lg">Opsi Pembayaran</h3>
                  <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
                    Bebas Bunga
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { key: "penuh", label: "Bayar Penuh", sub: "1x Pembayaran langsung lunas" },
                    { key: "2x", label: "Cicilan 2x", sub: "Bagi pembayaran jadi 2 tahap" },
                    { key: "3x", label: "Cicilan 3x", sub: "Bagi pembayaran jadi 3 tahap" }
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setCicilanOption(opt.key as CicilanOption)}
                      className={`w-full flex items-center gap-4 p-5 rounded-3xl bg-white border-2 transition-all ${
                        cicilanOption === opt.key ? "border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-100" : "border-white shadow-sm hover:border-slate-200"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                        cicilanOption === opt.key ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
                      }`}>
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-slate-900 font-black text-sm">{opt.label}</p>
                        <p className="text-slate-400 text-xs font-medium">{opt.sub}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {step === "confirm" && (
            <motion.div 
              key="confirm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100"
            >
              <h3 className="text-slate-900 font-black text-xl mb-6">Detail Konfirmasi</h3>
              
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">Item Tagihan</p>
                  <div className="space-y-3">
                    {selectedBills.map(b => (
                      <div key={b.id} className="flex justify-between items-center">
                        <div>
                          <p className="text-slate-900 font-bold text-sm">SPP {b.month}</p>
                          <p className="text-slate-400 text-xs">{b.items.length} Komponen</p>
                        </div>
                        <span className="text-slate-900 font-black text-sm">{formatRupiah(b.total_amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Metode</p>
                    <p className="text-slate-900 font-black text-sm">{selectedMethod?.label}</p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Tipe</p>
                    <p className="text-slate-900 font-black text-sm uppercase">{cicilanOption}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-between items-end">
                  <div>
                    <p className="text-slate-400 text-xs font-bold mb-1">Bayar Sekarang</p>
                    <p className="text-3xl font-black text-blue-600">{formatRupiah(firstPayment)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-[10px] font-black">SISA SALDO</p>
                    <p className="text-slate-900 font-bold text-sm">{formatRupiah(subtotal - firstPayment)}</p>
                  </div>
                </div>

                {apiError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> {apiError}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Docked Bottom Bar */}
      {selected.length > 0 && step !== "success" && (
        <div 
          className="fixed left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-slate-100 px-6 py-4 z-40"
          style={{ bottom: "66px", boxShadow: "0 -8px 30px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-0.5">Total Terpilih</p>
              <p className="text-slate-900 font-black text-lg leading-none">{selected.length} Tagihan</p>
            </div>
            
            <button 
              onClick={async () => {
                if (step === "list") setStep("checkout");
                else if (step === "checkout") setStep("confirm");
                else {
                  setPayLoading(true);
                  setApiError("");
                  try {
                    const res = await apiFetch("/payment/create", {
                      method: "POST",
                      body: JSON.stringify({
                        bill_ids: selected,
                        payment_method: payMethod,
                        payment_type: cicilanOption,
                        amount_paid: firstPayment,
                      }),
                    });
                    const data = await res.json();
                    if (res.ok && data.success) {
                      if (data.checkout_url) {
                        window.location.href = data.checkout_url;
                      } else {
                        setReceiptNo(data.receipt_no ?? "EDU" + Date.now());
                        refetch();
                        setStep("success");
                      }
                    } else {
                      setApiError(data.message ?? "Gagal memproses pembayaran");
                    }
                  } catch {
                    setApiError("Kesalahan jaringan. Coba lagi.");
                  } finally {
                    setPayLoading(false);
                  }
                }
              }}
              disabled={step === "checkout" && !payMethod || payLoading}
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm flex items-center gap-3 hover:bg-blue-500 disabled:opacity-50 transition-all shadow-lg shadow-blue-600/30 active:scale-95"
            >
              {payLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {step === "list" ? "Lanjutkan" : step === "checkout" ? "Konfirmasi" : "Bayar Sekarang"}
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}