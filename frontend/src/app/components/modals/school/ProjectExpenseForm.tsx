import React, { useState } from "react";
import { X, CheckCircle } from "lucide-react";
import { apiFetch } from "../../../config/api";

interface ProjectExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectExpenseForm: React.FC<ProjectExpenseFormProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    campaign_id: "",   // ID kampanye tipe proyek_sekolah
    amount: "",
    description: "",
    proof_url: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Backend mengharapkan: campaign_id, amount, description, proof_url (optional)
      const res = await apiFetch("/school/project-expenses", {
        method: "POST",
        body: JSON.stringify({
          campaign_id: parseInt(formData.campaign_id),
          amount: parseInt(formData.amount),
          description: formData.description,
          proof_url: formData.proof_url || undefined,
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
        setError(data.message || "Gagal mencatat pengeluaran.");
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
          <p className="text-sm text-gray-500">Pengeluaran proyek berhasil dicatat.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-[430px] p-6 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Catat Pengeluaran Proyek</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={18} />
          </button>
        </div>

        {error && <div className="p-3 mb-4 rounded-xl bg-red-50 text-red-500 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">ID Kampanye Proyek *</label>
            <input
              type="number"
              value={formData.campaign_id}
              onChange={(e) => setFormData({ ...formData, campaign_id: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border focus:border-blue-500 bg-gray-50"
              placeholder="Contoh: 1 (harus tipe proyek_sekolah)"
              required
            />
            <p className="text-xs text-gray-400 mt-1">Hanya kampanye bertipe "Proyek Sekolah" yang valid</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Jumlah (Rp) *</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border focus:border-blue-500 bg-gray-50"
              placeholder="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Deskripsi Pengeluaran *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border focus:border-blue-500 bg-gray-50 resize-none"
              placeholder="Penjelasan detail pengeluaran..."
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">URL Bukti (opsional)</label>
            <input
              type="url"
              value={formData.proof_url}
              onChange={(e) => setFormData({ ...formData, proof_url: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border focus:border-blue-500 bg-gray-50"
              placeholder="https://drive.google.com/..."
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center"
            style={{ background: "#1677FF" }}
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Pengeluaran"}
          </button>
        </form>
      </div>
    </div>
  );
};
