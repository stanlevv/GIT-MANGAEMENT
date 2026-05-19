import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Search, Heart, Star, TrendingUp, RefreshCw, Target, AlertTriangle, Flame } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useApi } from "../../hooks/useApi";
import { formatRupiah } from "../../lib/format";

interface Campaign {
  id: number;
  title: string;
  description: string;
  target_amount: number;
  current_amount: number;
  image_url?: string;
  status: string;
  type?: string;          // bantuan_siswa | proyek_sekolah
  donations_count?: number;
}
interface CampaignsResponse { campaigns: Campaign[]; }

const CATEGORIES = ["Semua", "Beasiswa", "Fasilitas", "Perlengkapan", "Ujian"];

export function DonorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch]               = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  const { data, loading, error, refetch } = useApi<CampaignsResponse>("/campaigns");
  const campaigns = data?.campaigns ?? [];

  const filtered = campaigns.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    // Filter kategori berdasarkan type dari backend (bantuan_siswa, proyek_sekolah)
    // Mapping: Beasiswa/Perlengkapan/Ujian → bantuan_siswa, Fasilitas → proyek_sekolah
    const matchCategory =
      activeCategory === "Semua" ||
      (activeCategory === "Fasilitas" && c.type === "proyek_sekolah") ||
      (["Beasiswa", "Perlengkapan", "Ujian"].includes(activeCategory) && c.type === "bantuan_siswa") ||
      false;
    return matchSearch && matchCategory;
  });

  const totalCampaigns  = campaigns.length;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="px-6 pt-12 pb-5" style={{ background: "linear-gradient(160deg, #1677FF 0%, #108EE9 100%)" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center text-white"
              style={{ background: "rgba(255,255,255,0.25)", fontSize: "1.2rem", fontWeight: 700 }}>
              {user?.name?.[0] ?? "D"}
            </div>
            <div>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.8rem" }}>Halo Donatur,</p>
              <p style={{ color: "white", fontWeight: 700, fontSize: "0.95rem" }}>{user?.name}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.15)" }}>
            <div className="flex items-center gap-1.5 mb-1">
              <Heart size={13} color="rgba(255,255,255,0.7)" />
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.72rem" }}>Kampanye Aktif</span>
            </div>
            {loading
              ? <div className="h-6 w-20 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.2)" }} />
              : <p style={{ color: "white", fontWeight: 700 }}>{totalCampaigns} kampanye</p>
            }
          </div>
          <div className="flex-1 rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.15)" }}>
            <div className="flex items-center gap-1.5 mb-1">
              <Star size={13} color="rgba(255,255,255,0.7)" />
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.72rem" }}>Total Terkumpul</span>
            </div>
            {loading
              ? <div className="h-6 w-24 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.2)" }} />
              : <p style={{ color: "white", fontWeight: 700 }}>
                  {formatRupiah(campaigns.reduce((s, c) => s + c.current_amount, 0))}
                </p>
            }
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.2)" }}>
          <Search size={18} color="rgba(255,255,255,0.7)" />
          <input
            type="text"
            placeholder="Cari kampanye pendidikan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none"
            style={{ color: "white", fontSize: "0.9rem" }}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-3 overflow-x-auto flex gap-2 bg-white" style={{ scrollbarWidth: "none" }}>
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className="flex-shrink-0 px-4 py-1.5 rounded-full transition-all"
            style={{
              background: activeCategory === cat ? "#1677FF" : "#F5F7FA",
              color:      activeCategory === cat ? "white"   : "#595959",
              fontWeight: 600, fontSize: "0.82rem",
            }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Urgent Banner */}
      {!loading && campaigns.some(c => c.current_amount / c.target_amount > 0.8) && (
        <div className="px-6 py-3" style={{ background: "#FFF7E6" }}>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} color="#FD9A16" />
            <span style={{ color: "#FD9A16", fontWeight: 600, fontSize: "0.82rem" }} className="flex items-center gap-1">
              Beberapa kampanye hampir mencapai target! Yuk ikut berdonasi <Target size={14} />
            </span>
          </div>
        </div>
      )}

      {/* Campaign List */}
      <div className="flex-1 overflow-y-auto pb-24 px-6 py-4 space-y-4" style={{ background: "#F5F7FA" }}>

        {/* Loading */}
        {loading && [1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm animate-pulse">
            <div className="h-44" style={{ background: "#F0F0F0" }} />
            <div className="p-4 space-y-2">
              <div className="h-5 w-3/4 rounded" style={{ background: "#F0F0F0" }} />
              <div className="h-4 w-1/2 rounded" style={{ background: "#F0F0F0" }} />
              <div className="h-2 w-full rounded-full" style={{ background: "#F0F0F0" }} />
            </div>
          </div>
        ))}

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center py-12">
            <AlertTriangle size={48} color="#FF4D4F" />
            <p style={{ color: "#8C8C8C", marginTop: "12px" }}>Gagal memuat kampanye</p>
            <button onClick={refetch}
              className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{ background: "#EEF4FF", color: "#1677FF", fontWeight: 600, fontSize: "0.85rem" }}>
              <RefreshCw size={14} /> Coba Lagi
            </button>
          </div>
        )}

        {/* Campaign cards */}
        {!loading && !error && filtered.map((c) => {
          const pct = Math.round((c.current_amount / c.target_amount) * 100);
          return (
            <div key={c.id} className="bg-white rounded-3xl overflow-hidden shadow-sm cursor-pointer"
              onClick={() => navigate(`/donor/campaign/${c.id}`)}>
              <div className="relative h-44 overflow-hidden">
                <img
                  src={c.image_url ?? "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400"}
                  alt={c.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)" }} />
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(82,196,26,0.9)" }}>
                  <span style={{ fontSize: "0.65rem", color: "white", fontWeight: 600 }}>✓ Terverifikasi</span>
                </div>
                {pct >= 80 && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-full"
                    style={{ background: "#FD9A16" }}>
                    <span style={{ fontSize: "0.65rem", color: "white", fontWeight: 700 }} className="flex items-center gap-1"><Flame size={10} color="white" /> Hampir Target</span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <p style={{ fontWeight: 700, color: "#242424", fontSize: "0.95rem", lineHeight: "1.3", marginBottom: "4px" }}
                  className="line-clamp-2">
                  {c.title}
                </p>
                <p style={{ color: "#8C8C8C", fontSize: "0.78rem", marginBottom: "10px" }} className="line-clamp-1">
                  {c.description}
                </p>

                <div className="w-full h-2 rounded-full mb-1.5" style={{ background: "#F0F0F0" }}>
                  <div className="h-full rounded-full"
                    style={{
                      width: `${Math.min(pct, 100)}%`,
                      background: pct >= 80
                        ? "linear-gradient(90deg, #52C41A, #389E0D)"
                        : "linear-gradient(90deg, #1677FF, #108EE9)"
                    }} />
                </div>
                <div className="flex justify-between mb-3">
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1677FF" }}>
                    {formatRupiah(c.current_amount)}
                  </span>
                  <span style={{ fontSize: "0.78rem", color: "#8C8C8C" }}>
                    {pct}% dari {formatRupiah(c.target_amount)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Heart size={13} color="#F95654" fill="#F95654" />
                    <span style={{ fontSize: "0.78rem", color: "#8C8C8C" }}>
                      {c.donations_count ?? 0} donatur
                    </span>
                  </div>
                  <button
                    className="px-5 py-2 rounded-xl text-white"
                    style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)", fontWeight: 600, fontSize: "0.82rem" }}
                    onClick={(e) => { e.stopPropagation(); navigate(`/donor/campaign/${c.id}`); }}
                  >
                    Donasi Sekarang
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center py-12">
            <Search size={48} color="#BFBFBF" />
            <p style={{ color: "#8C8C8C", marginTop: "12px" }}>Kampanye tidak ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
}
