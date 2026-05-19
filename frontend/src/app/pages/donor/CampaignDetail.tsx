import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Heart, Share2, CheckCircle, Users, RefreshCw, LogIn, AlertTriangle, PartyPopper, Smartphone, Building2, CreditCard, Lightbulb, School } from "lucide-react";
import { formatRupiah } from "../../lib/format";
import { useApi } from "../../hooks/useApi";
import { apiFetch } from "../../config/api";
import { useAuth } from "../../context/AuthContext";

interface Donation { id: number; amount: number; is_anonymous: boolean; message?: string; created_at: string; }
interface Campaign {
  id: number;
  title: string;
  description: string;
  target_amount: number;
  current_amount: number;
  image_url?: string;
  status: string;
  type?: string;
  category?: string;   // alias tampilan untuk type kampanye
  verified?: boolean;  // apakah kampanye terverifikasi admin
  donations_count?: number;
  donations?: Donation[];
}

interface CampaignResponse { campaign: Campaign; }

const DONATION_PRESETS = [10000, 25000, 50000, 100000, 250000, 500000];

export function CampaignDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();

  const { data, loading, error, refetch } = useApi<CampaignResponse>(`/campaigns/${id}`);
  const campaign = data?.campaign;

  const [donationAmount, setDonationAmount] = useState("");
  const [paymentMethod, setPaymentMethod]   = useState("");
  const [step, setStep]                     = useState<"detail" | "donate" | "success">("detail");
  const [liked, setLiked]                   = useState(false);
  const [submitLoading, setSubmitLoading]   = useState(false);
  const [submitError, setSubmitError]       = useState("");

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: "#C5D8FF", borderTopColor: "#1677FF" }} />
        <p style={{ color: "#8C8C8C", marginTop: "12px", fontSize: "0.85rem" }}>Memuat kampanye...</p>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center px-6">
        <AlertTriangle size={48} color="#FF4D4F" />
        <p style={{ color: "#8C8C8C", marginTop: "12px", textAlign: "center" }}>Kampanye tidak ditemukan</p>
        <button onClick={refetch} className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl"
          style={{ background: "#EEF4FF", color: "#1677FF", fontWeight: 600, fontSize: "0.85rem" }}>
          <RefreshCw size={14} /> Coba Lagi
        </button>
        <button onClick={() => navigate(-1)} style={{ color: "#1677FF", marginTop: "12px", fontSize: "0.85rem" }}>
          Kembali
        </button>
      </div>
    );
  }

  const pct = Math.round((campaign.current_amount / campaign.target_amount) * 100);

  if (step === "success") {
    return (
      <div className="flex flex-col min-h-screen bg-white items-center justify-center px-6">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
          style={{ background: "#F6FFED" }}>
          <CheckCircle size={52} color="#52C41A" />
        </div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#242424", textAlign: "center", marginBottom: "8px" }} className="flex items-center justify-center gap-2">
          Donasi Berhasil! <PartyPopper size={24} color="#1677FF" />
        </h2>
        <p style={{ color: "#8C8C8C", textAlign: "center", marginBottom: "8px" }}>
          Kamu telah berdonasi sebesar
        </p>
        <p style={{ fontSize: "1.4rem", fontWeight: 800, color: "#1677FF", marginBottom: "8px" }}>
          {formatRupiah(parseInt(donationAmount))}
        </p>
        <p style={{ color: "#8C8C8C", textAlign: "center", marginBottom: "8px" }}>untuk kampanye "{campaign.title}"</p>
        <p style={{ color: "#8C8C8C", textAlign: "center", marginBottom: "24px", fontSize: "0.85rem" }}>
          via {paymentMethod === "qris" ? "QRIS" : paymentMethod === "va" ? "Virtual Account" : "Bank Transfer"}
        </p>
        <div className="w-full rounded-2xl p-4 mb-6 text-center" style={{ background: "#EEF4FF" }}>
          <p style={{ color: "#1677FF", fontSize: "0.9rem" }} className="flex items-center justify-center gap-1">
            <Heart size={16} fill="currentColor" /> Terima kasih! Donasi kamu sangat berarti bagi pendidikan Indonesia.
          </p>
        </div>
        <button onClick={() => navigate(user?.role === "siswa" || user?.role === "parent" ? "/student" : "/donor")} className="w-full py-4 rounded-2xl text-white"
          style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)", fontWeight: 700 }}>
          Kembali ke Beranda
        </button>
        <button onClick={() => { setStep("detail"); setDonationAmount(""); setPaymentMethod(""); }} className="w-full py-3 mt-2 rounded-2xl"
          style={{ background: "#F5F7FA", color: "#595959", fontWeight: 600 }}>
          Donasi Lagi
        </button>
      </div>
    );
  }

  if (step === "donate") {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <div className="px-6 pt-12 pb-4">
          <button onClick={() => { setStep("detail"); setPaymentMethod(""); }} className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
            style={{ background: "#F5F7FA" }}>
            <ArrowLeft size={20} color="#242424" />
          </button>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#242424" }}>Masukkan Nominal</h1>
          <p style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>{campaign.title}</p>
        </div>
        <div className="flex-1 px-6 space-y-5">
          <div>
            <div className="bg-white rounded-2xl px-4 py-4 shadow-sm" style={{ border: "2px solid #1677FF" }}>
              <div className="flex items-center gap-2">
                <span style={{ color: "#8C8C8C", fontWeight: 600, fontSize: "1.1rem" }}>Rp</span>
                <input
                  type="number"
                  placeholder="0"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="flex-1 bg-transparent outline-none"
                  style={{ fontSize: "1.5rem", color: "#242424", fontWeight: 800 }}
                  autoFocus
                />
              </div>
            </div>
          </div>

          <div>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#595959", marginBottom: "10px" }}>
              Pilih nominal cepat:
            </p>
            <div className="grid grid-cols-3 gap-2">
              {DONATION_PRESETS.map((v) => (
                <button
                  key={v}
                  onClick={() => setDonationAmount(String(v))}
                  className="py-2.5 rounded-xl font-semibold transition-all"
                  style={{
                    background: donationAmount === String(v) ? "#1677FF" : "#F5F7FA",
                    color: donationAmount === String(v) ? "white" : "#595959",
                    fontSize: "0.82rem",
                  }}
                >
                  {formatRupiah(v)}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#595959", marginBottom: "10px" }}>
              Pilih metode pembayaran:
            </p>
            <div className="space-y-2">
              {[
                { id: "qris", label: "QRIS", icon: <Smartphone size={18} />, desc: "Scan & bayar pakai e-wallet" },
                { id: "va", label: "Virtual Account", icon: <Building2 size={18} />, desc: "Transfer via bank" },
                { id: "bank", label: "Bank Transfer", icon: <CreditCard size={18} />, desc: "Transfer manual ke rekening" },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl transition-all"
                  style={{
                    background: paymentMethod === method.id ? "#EEF4FF" : "#F5F7FA",
                    border: paymentMethod === method.id ? "2px solid #1677FF" : "2px solid transparent",
                  }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: paymentMethod === method.id ? "#1677FF" : "white",
                      fontSize: "1.2rem",
                    }}>
                    {paymentMethod === method.id ? "✓" : method.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <p style={{
                      fontWeight: 600,
                      fontSize: "0.88rem",
                      color: paymentMethod === method.id ? "#1677FF" : "#242424"
                    }}>
                      {method.label}
                    </p>
                    <p style={{ color: "#8C8C8C", fontSize: "0.72rem" }}>{method.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-4" style={{ background: "#EEF4FF" }}>
            <p style={{ color: "#1677FF", fontSize: "0.82rem", lineHeight: "1.5" }} className="flex items-start gap-1.5">
              <Lightbulb size={16} className="mt-0.5 flex-shrink-0" /> Donasi kamu akan langsung disalurkan ke rekening sekolah yang sudah terverifikasi.
            </p>
          </div>
        </div>

        <div className="px-6 pt-4 pb-20" style={{ boxShadow: "0 -4px 20px rgba(0,0,0,0.06)" }}>
          {submitError && (
            <p style={{ color: "#CF1322", fontSize: "0.8rem", marginBottom: "8px", textAlign: "center" }} className="flex items-center justify-center gap-1">
              <AlertTriangle size={14} /> {submitError}
            </p>
          )}
          <button
            onClick={async () => {
              setSubmitLoading(true);
              setSubmitError("");
              try {
                const res  = await apiFetch(`/campaigns/${id}/donate`, {
                  method: "POST",
                  body: JSON.stringify({
                    amount:       parseInt(donationAmount),
                    is_anonymous: false,
                    payment_method: paymentMethod,
                  }),
                });
                const data = await res.json();
                if (res.ok && data.success) {
                  refetch();
                  setStep("success");
                } else {
                  setSubmitError(data.message ?? "Donasi gagal.");
                }
              } catch {
                setSubmitError("Tidak bisa terhubung ke server.");
              } finally {
                setSubmitLoading(false);
              }
            }}
            disabled={!donationAmount || parseInt(donationAmount) < 10000 || !paymentMethod || submitLoading}
            className="w-full py-4 rounded-2xl text-white disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)", fontWeight: 700, fontSize: "1rem" }}
          >
            {submitLoading ? "Memproses..." : 
              donationAmount && parseInt(donationAmount) >= 10000 && paymentMethod
                ? `Donasi ${formatRupiah(parseInt(donationAmount))}`
                : "Pilih Nominal & Metode Pembayaran"}
          </button>
          <p style={{ textAlign: "center", color: "#8C8C8C", fontSize: "0.72rem", marginTop: "8px" }}>
            Minimal donasi Rp10.000
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Image */}
      <div className="relative h-64">
        <img src={campaign.image_url ?? "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400"} alt={campaign.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.1))" }} />

        {/* Back & Actions */}
        <div className="absolute top-12 left-6 right-6 flex justify-between">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.9)" }}>
            <ArrowLeft size={20} color="#242424" />
          </button>
          <div className="flex gap-2">
            <button onClick={() => setLiked(!liked)} className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.9)" }}>
              <Heart size={18} color={liked ? "#F95654" : "#595959"} fill={liked ? "#F95654" : "none"} />
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.9)" }}>
              <Share2 size={18} color="#595959" />
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute bottom-4 left-4 flex gap-2">
          {campaign.verified && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full"
              style={{ background: "rgba(82,196,26,0.9)" }}>
              <CheckCircle size={12} color="white" />
              <span style={{ fontSize: "0.72rem", color: "white", fontWeight: 600 }}>Terverifikasi Sekolah</span>
            </div>
          )}
          {(campaign.category || campaign.type) && (
            <div className="px-2.5 py-1 rounded-full" style={{ background: "rgba(22,119,255,0.9)" }}>
              <span style={{ fontSize: "0.72rem", color: "white", fontWeight: 600 }}>
                {campaign.category ?? (campaign.type === "bantuan_siswa" ? "Bantuan Siswa" : campaign.type === "proyek_sekolah" ? "Proyek Sekolah" : campaign.type)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-44">
        <div className="px-6 py-5">
          <h1 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#242424", lineHeight: "1.4", marginBottom: "4px" }}>
            {campaign.title}
          </h1>
          <p style={{ color: "#8C8C8C", fontSize: "0.82rem", marginBottom: "16px" }} className="flex items-center gap-1"><School size={14} /> Kampanye Pendidikan</p>

          {/* Progress */}
          <div className="rounded-2xl p-4 mb-5" style={{ background: "#F5F7FA" }}>
            <div className="flex justify-between mb-2">
              <div>
                <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1677FF" }}>{formatRupiah(campaign.current_amount)}</p>
                <p style={{ color: "#8C8C8C", fontSize: "0.78rem" }}>terkumpul dari {formatRupiah(campaign.target_amount)}</p>
              </div>
              <div className="text-right">
                <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "#242424" }}>{pct}%</p>
                <p style={{ color: "#8C8C8C", fontSize: "0.78rem" }}>tercapai</p>
              </div>
            </div>
            <div className="w-full h-3 rounded-full mb-3" style={{ background: "#E8E8E8" }}>
              <div className="h-full rounded-full"
                style={{ width: `${Math.min(pct, 100)}%`, background: "linear-gradient(90deg, #1677FF, #108EE9)" }} />
            </div>
            <div className="flex justify-between">
              <div className="flex items-center gap-1.5">
                <Users size={14} color="#8C8C8C" />
                <span style={{ color: "#8C8C8C", fontSize: "0.78rem" }}>{campaign.donations_count ?? 0} donatur</span>
              </div>
              <span style={{ color: "#8C8C8C", fontSize: "0.78rem" }}>Status: {campaign.status}</span>
            </div>
          </div>

          {/* Story */}
          <div className="mb-5">
            <p style={{ fontWeight: 700, color: "#242424", marginBottom: "10px" }}>Cerita Kampanye</p>
            {campaign.description.split("\n\n").map((para: string, i: number) => (
              <p key={i} style={{ color: "#595959", fontSize: "0.88rem", lineHeight: "1.7", marginBottom: "12px" }}>
                {para}
              </p>
            ))}
          </div>

          {campaign.donations && campaign.donations.length > 0 && (
            <div>
              <p style={{ fontWeight: 700, color: "#242424", marginBottom: "10px" }}>Donasi Terbaru</p>
              <div className="space-y-3">
                {campaign.donations.map((d) => (
                  <div key={d.id} className="flex gap-3 p-3 rounded-2xl" style={{ background: "#EEF4FF" }}>
                    <div className="w-1.5 flex-shrink-0 rounded-full" style={{ background: "#1677FF" }} />
                    <div>
                      <p style={{ color: "#8C8C8C", fontSize: "0.75rem" }}>
                        {new Date(d.created_at).toLocaleDateString("id-ID")}
                      </p>
                      <p style={{ color: "#1677FF", fontWeight: 700, fontSize: "0.85rem" }}>
                        {d.is_anonymous ? "Anonim" : "Donatur"} · {formatRupiah(d.amount)}
                      </p>
                      {d.message && <p style={{ color: "#595959", fontSize: "0.82rem" }}>{d.message}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom — sits above BottomNav (bottom-16 ≈ 64px) */}
      <div
        className="fixed bottom-16 left-1/2 w-full max-w-[430px] px-6 py-3 z-[51]"
        style={{ transform: "translateX(-50%)", background: "white", boxShadow: "0 -4px 20px rgba(0,0,0,0.08)" }}
      >
        {isAuthenticated ? (
          <button
            onClick={() => setStep("donate")}
            className="w-full py-4 rounded-2xl text-white flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)", fontWeight: 700, fontSize: "1rem" }}
          >
            <Heart size={18} fill="currentColor" /> Donasi Sekarang
          </button>
        ) : (
          <>
            <p style={{ textAlign: "center", color: "#8C8C8C", fontSize: "0.78rem", marginBottom: "8px" }}>
              Masuk untuk berdonasi
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-4 rounded-2xl text-white flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)", fontWeight: 700, fontSize: "1rem" }}
            >
              <LogIn size={18} /> Masuk / Daftar untuk Donasi
            </button>
          </>
        )}
      </div>
    </div>
  );
}