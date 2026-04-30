import React, { useState } from "react";
import { X, CheckCircle } from "lucide-react";
import { apiFetch } from "../../../../config/api";

interface ApproveAidRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  aidRequestId: number | null;
  studentName: string;
  amount: number;
}

export const ApproveAidRequestModal: React.FC<ApproveAidRequestModalProps> = ({
  isOpen,
  onClose,
  aidRequestId,
  studentName,
  amount,
}) => {
  const [fundPoolId, setFundPoolId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aidRequestId) return;

    setIsSubmitting(true);
    setError("");

    try {
      const res = await apiFetch(`/school/aid-requests/${aidRequestId}/approve`, {
        method: "POST",
        body: JSON.stringify({
          fund_pool_id: parseInt(fundPoolId),
        }),
      });

      if (res.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          onClose();
        }, 2000);
      } else {
        const data = await res.json();
        setError(data.message || "Gagal menyetujui bantuan.");
      }
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center relative">
          <button onClick={() => { setShowSuccess(false); onClose(); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#F6FFED" }}>
            <CheckCircle size={32} color="#52C41A" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Berhasil</h3>
          <p className="text-sm text-gray-500">Bantuan disetujui dan saldo terpotong otomatis.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-[400px] p-6 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Setujui Bantuan</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={18} />
          </button>
        </div>

        <div className="mb-4 p-3 bg-blue-50 rounded-xl text-sm text-blue-800">
          Setujui bantuan untuk <strong>{studentName}</strong> sebesar <strong>Rp {amount.toLocaleString("id-ID")}</strong>
        </div>

        {error && <div className="p-3 mb-4 rounded-xl bg-red-50 text-red-500 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Pilih ID Fund Pool *</label>
            <input
              type="number"
              value={fundPoolId}
              onChange={(e) => setFundPoolId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border focus:border-blue-500 bg-gray-50"
              placeholder="Contoh: 1"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !fundPoolId}
            className="w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center"
            style={{ background: "#52C41A" }}
          >
            {isSubmitting ? "Memproses..." : "Konfirmasi & Potong Saldo"}
          </button>
        </form>
      </div>
    </div>
  );
};
