import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronRight, School, MapPin, Phone, Mail, Shield, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ITSupportForm } from "../shared/ITSupportForm";
import { SchoolDataForm } from "./modals/SchoolDataForm";
import { AcademicYearForm } from "./modals/AcademicYearForm";
import { BankAccountForm } from "./modals/BankAccountForm";
import { NotificationSettings } from "./modals/NotificationSettings";

export function SchoolProfilePage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showITSupport, setShowITSupport] = useState(false);
  const [showSchoolData, setShowSchoolData] = useState(false);
  const [showAcademicYear, setShowAcademicYear] = useState(false);
  const [showBankAccount, setShowBankAccount] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const INFO = [
    { icon: <School size={16} color="#1677FF" />, label: "Nama Sekolah", value: "SDN 3 Malang" },
    { icon: <MapPin size={16} color="#EA4E0D" />, label: "Alamat", value: "Jl. Veteran No.12, Malang" },
    { icon: <Phone size={16} color="#52C41A" />, label: "Telepon", value: "(0341) 123-4567" },
    { icon: <Mail size={16} color="#722ED1" />, label: "Email", value: "admin@sdn3malang.sch.id" },
  ];

  const MENUS = [
    { icon: "🏫", label: "Data Sekolah", sub: "Edit profil & informasi", action: () => setShowSchoolData(true) },
    { icon: "📋", label: "Tahun Ajaran", sub: "Kelola periode akademik", action: () => setShowAcademicYear(true) },
    { icon: "💳", label: "Rekening Sekolah", sub: "Akun penerima pembayaran", action: () => setShowBankAccount(true) },
    { icon: "🔔", label: "Notifikasi", sub: "Pengaturan pemberitahuan", action: () => setShowNotification(true) },
    { icon: "🎧", label: "Hubungi Tim IT", sub: "Bantuan teknis aplikasi", action: () => setShowITSupport(true) },
  ];

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#F3F6FB" }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-6" style={{ background: "linear-gradient(145deg,#0D5FD6 0%,#108EE9 100%)" }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.25)", fontSize: "1.8rem" }}>
            🏫
          </div>
          <div>
            <h1 style={{ color: "white", fontWeight: 800, fontSize: "1.1rem" }}>SDN 3 Malang</h1>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.75rem" }}>NPSN: 20534812</p>
            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full"
              style={{ background: "rgba(82,196,26,0.3)", fontSize: "0.65rem", color: "#B7EB8F", fontWeight: 700 }}>
              <Shield size={9} /> Terverifikasi EDUFIN
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 pb-32 space-y-3">
        {/* Info Sekolah */}
        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          {INFO.map((item, i) => (
            <div key={item.label} className="flex items-center gap-3 px-4 py-3.5"
              style={{ borderBottom: i < INFO.length - 1 ? "1px solid #F5F7FA" : "none" }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#F5F7FA" }}>
                {item.icon}
              </div>
              <div className="flex-1">
                <p style={{ color: "#8C8C8C", fontSize: "0.68rem" }}>{item.label}</p>
                <p style={{ fontWeight: 600, color: "#242424", fontSize: "0.85rem" }}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          {MENUS.map((item, i) => (
            <button key={item.label} onClick={item.action} className="w-full flex items-center gap-3 px-4 py-3.5 transition-all active:bg-gray-50"
              style={{ borderBottom: i < MENUS.length - 1 ? "1px solid #F5F7FA" : "none" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#F5F7FA", fontSize: "1rem" }}>
                {item.icon}
              </div>
              <div className="flex-1 text-left">
                <p style={{ fontWeight: 600, color: "#242424", fontSize: "0.88rem" }}>{item.label}</p>
                <p style={{ color: "#8C8C8C", fontSize: "0.72rem" }}>{item.sub}</p>
              </div>
              <ChevronRight size={16} color="#BFBFBF" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={() => { logout(); navigate("/login"); }}
          className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
          style={{ background: "#FFF2EE", color: "#EA4E0D", fontWeight: 700 }}
        >
          <LogOut size={17} /> Keluar dari Akun
        </button>
      </div>

      {/* Modals */}
      <SchoolDataForm isOpen={showSchoolData} onClose={() => setShowSchoolData(false)} />
      <AcademicYearForm isOpen={showAcademicYear} onClose={() => setShowAcademicYear(false)} />
      <BankAccountForm isOpen={showBankAccount} onClose={() => setShowBankAccount(false)} />
      <NotificationSettings isOpen={showNotification} onClose={() => setShowNotification(false)} />
      <ITSupportForm isOpen={showITSupport} onClose={() => setShowITSupport(false)} />
    </div>
  );
}
