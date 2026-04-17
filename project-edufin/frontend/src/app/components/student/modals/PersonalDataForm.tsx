import React, { useState } from "react";
import { X, Camera } from "lucide-react";

interface PersonalDataFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PersonalDataForm({ isOpen, onClose }: PersonalDataFormProps) {
  const [formData, setFormData] = useState({
    name: "Budi Santoso",
    nisn: "0012345678",
    email: "budi.santoso@student.id",
    phone: "081234567890",
    parentName: "Hendra Santoso",
    parentPhone: "081234567891",
    address: "Jl. Mawar No. 15, Malang",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit to API
    alert("Data pribadi berhasil diperbarui!");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="w-full max-w-[430px] bg-white rounded-t-3xl p-6 pb-8 animate-slide-up max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 style={{ fontWeight: 800, fontSize: "1.1rem", color: "#242424" }}>Data Pribadi</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "#F5F7FA" }}>
            <X size={18} color="#8C8C8C" />
          </button>
        </div>

        {/* Avatar */}
        <div className="flex justify-center mb-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white"
              style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)", fontSize: "2rem", fontWeight: 800 }}>
              B
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: "#1677FF", border: "2px solid white" }}>
              <Camera size={14} color="white" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label style={{ color: "#595959", fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "6px" }}>
              Nama Lengkap
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border"
              style={{ borderColor: "#E8E8E8", fontSize: "0.88rem" }}
              required
            />
          </div>

          <div>
            <label style={{ color: "#595959", fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "6px" }}>
              NISN
            </label>
            <input
              type="text"
              value={formData.nisn}
              disabled
              className="w-full px-4 py-3 rounded-xl border"
              style={{ borderColor: "#E8E8E8", fontSize: "0.88rem", background: "#F5F7FA", color: "#8C8C8C" }}
            />
            <p style={{ fontSize: "0.7rem", color: "#8C8C8C", marginTop: "4px" }}>
              NISN tidak dapat diubah
            </p>
          </div>

          <div>
            <label style={{ color: "#595959", fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "6px" }}>
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border"
              style={{ borderColor: "#E8E8E8", fontSize: "0.88rem" }}
              required
            />
          </div>

          <div>
            <label style={{ color: "#595959", fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "6px" }}>
              No. Handphone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border"
              style={{ borderColor: "#E8E8E8", fontSize: "0.88rem" }}
              required
            />
          </div>

          <div className="pt-3" style={{ borderTop: "1px solid #F0F0F0" }}>
            <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "#242424", marginBottom: "12px" }}>
              Data Orang Tua / Wali
            </p>

            <div className="space-y-4">
              <div>
                <label style={{ color: "#595959", fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                  Nama Orang Tua / Wali
                </label>
                <input
                  type="text"
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border"
                  style={{ borderColor: "#E8E8E8", fontSize: "0.88rem" }}
                  required
                />
              </div>

              <div>
                <label style={{ color: "#595959", fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                  No. HP Orang Tua / Wali
                </label>
                <input
                  type="tel"
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border"
                  style={{ borderColor: "#E8E8E8", fontSize: "0.88rem" }}
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label style={{ color: "#595959", fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "6px" }}>
              Alamat Lengkap
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border"
              style={{ borderColor: "#E8E8E8", fontSize: "0.88rem", minHeight: "80px" }}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl text-white font-bold"
            style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)" }}
          >
            Simpan Perubahan
          </button>
        </form>
      </div>
    </div>
  );
}
