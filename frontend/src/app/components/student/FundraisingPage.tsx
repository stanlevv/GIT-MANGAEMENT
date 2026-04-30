import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Search, Heart, RefreshCw } from "lucide-react";
import { formatRupiah } from "../../lib/format";
import { useApi } from "../../hooks/useApi";

interface Campaign {
  id: number;
  title: string;
  target_amount: number;
  current_amount: number;
  image_url?: string;
  status: string;
  donations_count?: number;
}
interface CampaignsResponse { campaigns: Campaign[]; }

const CATEGORIES = ["Semua", "Beasiswa", "Fasilitas", "Perlengkapan", "Ujian"];



export function FundraisingPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data, loading, error, refetch } = useApi<CampaignsResponse>("/campaigns");
  const campaigns = data?.campaigns ?? [];

  const filtered = campaigns.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#F5F7FA" }}>
      {/* Header */}
      <div className="px-6 pt-12 pb-5" style={{ background: "linear-gradient(160deg, #1677FF 0%, #108EE9 100%)" }}>
        <button onClick={() => navigate("/student")} className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
          style={{ background: "rgba(255,255,255,0.2)" }}>
          <ArrowLeft size={20} color="white" />
        </button>
        <h1 style={{ color: "white", fontSize: "1.4rem", fontWeight: 800 }}>Galang Dana</h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>Kampanye pendidikan aktif</p>

        {/* Search */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl mt-4"
          style={{ background: "rgba(255,255,255,0.2)" }}>
          <Search size={18} color="rgba(255,255,255,0.7)" />
          <input
            type="text"
            placeholder="Cari kampanye atau sekolah..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none"
            style={{ color: "white", fontSize: "0.9rem" }}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-4 overflow-x-auto flex gap-2" style={{ scrollbarWidth: "none", background: "white" }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="flex-shrink-0 px-4 py-1.5 rounded-full transition-all"
            style={{
              background: activeCategory === cat ? "#1677FF" : "#F5F7FA",
              color: activeCategory === cat ? "white" : "#595959",
              fontWeight: 600,
              fontSize: "0.82rem",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Campaign List */}
      <div className="flex-1 px-6 py-4 overflow-y-auto pb-32 space-y-4">
        {loading && [1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-3xl overflow-hidden animate-pulse shadow-sm">
            <div className="h-40" style={{ background: "#F0F0F0" }} />
            <div className="p-4 space-y-2">
              <div className="h-4 w-3/4 rounded" style={{ background: "#F0F0F0" }} />
              <div className="h-3 w-1/2 rounded" style={{ background: "#F0F0F0" }} />
            </div>
          </div>
        ))}

        {error && (
          <div className="flex flex-col items-center py-12">
            <span style={{ fontSize: "3rem" }}>⚠️</span>
            <p style={{ color: "#8C8C8C", marginTop: "12px" }}>Gagal memuat kampanye</p>
            <button onClick={refetch} className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{ background: "#EEF4FF", color: "#1677FF", fontWeight: 600, fontSize: "0.85rem" }}>
              <RefreshCw size={14} /> Coba Lagi
            </button>
          </div>
        )}

        {!loading && !error && filtered.map((c) => {
          const pct = Math.round((c.current_amount / c.target_amount) * 100);
          return (
            <div
              key={c.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm cursor-pointer"
              onClick={() => navigate(`/donor/campaign/${c.id}`)}
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={c.image_url ?? "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400"}
                  alt={c.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)" }} />
                <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(82,196,26,0.9)" }}>
                  <span style={{ fontSize: "0.65rem", color: "white", fontWeight: 600 }}>✓ Terverifikasi</span>
                </div>
              </div>
              <div className="p-4">
                <p style={{ fontWeight: 700, color: "#242424", fontSize: "0.95rem", lineHeight: "1.3", marginBottom: "4px" }}
                  className="line-clamp-2">
                  {c.title}
                </p>
                <div className="w-full h-2 rounded-full mb-2 mt-2" style={{ background: "#F0F0F0" }}>
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${Math.min(pct, 100)}%`, background: "linear-gradient(90deg, #1677FF, #108EE9)" }} />
                </div>
                <div className="flex justify-between mb-3">
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1677FF" }}>
                    {formatRupiah(c.current_amount)}
                  </span>
                  <span style={{ fontSize: "0.78rem", color: "#8C8C8C" }}>dari {formatRupiah(c.target_amount)} ({pct}%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Heart size={13} color="#F95654" fill="#F95654" />
                    <span style={{ fontSize: "0.78rem", color: "#8C8C8C" }}>{c.donations_count ?? 0} donatur</span>
                  </div>
                  <button
                    className="px-4 py-2 rounded-xl text-white"
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
            <span style={{ fontSize: "3rem" }}>🔍</span>
            <p style={{ color: "#8C8C8C", marginTop: "12px" }}>Kampanye tidak ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
}