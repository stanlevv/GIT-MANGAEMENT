import React, { useState } from "react";
import { useNavigate } from "react-router";
import { 
  ArrowLeft, 
  ArrowUpRight, 
  RefreshCw, 
  Search, 
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  Download,
  TrendingUp,
  CreditCard,
  History,
  AlertCircle
} from "lucide-react";
import { useApi } from "../../hooks/useApi";
import { formatRupiah } from "../../lib/format";
import { motion, AnimatePresence } from "framer-motion";

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
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, loading, error, refetch } =
    useApi<PaymentHistoryResponse>("/payment/history");

  const payments = data?.payments ?? [];

  const filtered = payments.filter((p) => {
    const cat = categoryFromType(p.payment_type);
    const matchesCat = activeCat === "Semua" || cat === activeCat;
    const matchesSearch = p.receipt_no.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.payment_method.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalOut = payments.reduce((s, p) => s + (p.payment_status === 'success' ? p.amount_paid : 0), 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-80 bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-500 -z-10 rounded-b-[50px] shadow-2xl" />

      {/* Header */}
      <header className="px-6 pt-12 pb-6 text-white">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/student")}
            className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center transition-transform active:scale-90"
          >
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-xl font-black">Riwayat Pembayaran</h1>
          <button className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
            <Download size={20} />
          </button>
        </div>

        {/* Summary Card */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
            <span className="text-white/70 text-xs font-bold uppercase tracking-wider">Total Pengeluaran</span>
          </div>
          {loading ? (
            <div className="h-10 w-48 bg-white/10 rounded-xl animate-pulse mt-2" />
          ) : (
            <div>
              <h2 className="text-3xl font-black">{formatRupiah(totalOut)}</h2>
              <div className="flex items-center gap-2 mt-2 text-white/60 text-[10px] font-medium">
                <CheckCircle2 size={12} className="text-green-300" />
                <span>{payments.filter(p => p.payment_status === 'success').length} Transaksi Berhasil</span>
              </div>
            </div>
          )}
        </motion.div>
      </header>

      <main className="px-6 -mt-4 relative z-10">
        {/* Search & Filter */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari No. Kuitansi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <button className="w-14 h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-500 shadow-sm">
            <Filter size={20} />
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-6 scrollbar-hide px-1 -mx-1">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              className={`flex-shrink-0 px-6 py-3 rounded-2xl text-xs font-black transition-all ${
                activeCat === c 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                  : "bg-white text-gray-500 border border-gray-100"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Transaction List */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-white rounded-3xl animate-pulse border border-gray-50" />
            ))
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="bg-red-50 p-4 rounded-full mb-4">
                <AlertCircle size={40} className="text-red-500" />
              </div>
              <h3 className="font-bold text-gray-900">Gagal Memuat Data</h3>
              <p className="text-xs text-gray-400 mt-1 mb-6">Periksa koneksi internet Anda.</p>
              <button 
                onClick={refetch}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200"
              >
                <RefreshCw size={18} /> Coba Lagi
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-[40px] border border-gray-100 shadow-sm">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Calendar size={40} className="text-gray-200" />
              </div>
              <h3 className="font-bold text-gray-400">Belum Ada Transaksi</h3>
              <p className="text-xs text-gray-300 mt-1">Transaksi Anda akan muncul di sini.</p>
            </div>
          ) : (
            filtered.map((p) => {
              const cat    = categoryFromType(p.payment_type);
              const isOk   = p.payment_status === "success";
              
              return (
                <motion.div 
                  key={p.id} 
                  variants={itemVariants}
                  className="bg-white rounded-[32px] p-5 shadow-sm border border-gray-50 flex items-center gap-4 group hover:shadow-md transition-all"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-active:scale-95 ${
                    isOk ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {cat === "SPP" ? <CreditCard size={24} /> : <History size={24} />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-gray-900 text-sm truncate uppercase tracking-tight">
                        {cat} {p.payment_type !== "penuh" ? `(${p.payment_type})` : ""}
                      </h4>
                      <p className="font-black text-blue-600 text-sm">-{formatRupiah(p.amount_paid)}</p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold mb-2">
                      <span>{formatMethodLabel(p.payment_method)}</span>
                      <span>•</span>
                      <span className="truncate">No. {p.receipt_no}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Clock size={10} className="text-gray-300" />
                        <span className="text-[10px] text-gray-400 font-medium">{formatDate(p.created_at)}</span>
                      </div>
                      <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${
                        isOk ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {isOk ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                        <span className="text-[9px] font-black uppercase">{isOk ? 'Berhasil' : 'Pending'}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </main>
    </div>
  );
}