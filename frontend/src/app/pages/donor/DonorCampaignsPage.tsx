import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Search, ChevronRight, Heart, RefreshCw, AlertTriangle } from "lucide-react";
import { useApi } from "../../hooks/useApi";
import { formatRupiah } from "../../lib/format";

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

function formatK(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}jt`;
  return `${Math.round(n / 1000)}rb`;
}

type CategoryType = "Semua" | "Beasiswa" | "Fasilitas" | "Perlengkapan";

export function DonorCampaignsPage() {
  const navigate = useNavigate();
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState<CategoryType>("Semua");

  const { data, loading, error, refetch } = useApi<CampaignsResponse>("/campaigns");
  const campaigns = data?.campaigns ?? [];

  const filtered = campaigns.filter((c) => {
    return c.title.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#F3F6FB" }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-5" style={{ background: "linear-gradient(145deg,#0D5FD6 0%,#108EE9 100%)" }}>
        <h1 style={{ color: "white", fontWeight: 800, fontSize: "1.2rem", marginBottom: "12px" }}>
          Kampanye Donasi
        </h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8rem", marginBottom: "12px" }}>
          {loading ? "Memuat..." : `${campaigns.length} kampanye aktif`}
        </p>
        <div className="flex items-center gap-2 px-3 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)" }}>
          <Search size={16} color="rgba(255,255,255,0.7)" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kampanye atau sekolah..."
            className="flex-1 py-3 bg-transparent outline-none"
            style={{ color: "white", fontSize: "0.85rem" }}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="px-5 py-3 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {(["Semua", "Beasiswa", "Fasilitas", "Perlengkapan"] as CategoryType[]).map((c) => (
          <button key={c} onClick={() => setCategory(c)}
            className="px-4 py-1.5 rounded-xl flex-shrink-0 transition-all"
            style={{
              background: category === c ? "#1677FF" : "white",
              color:      category === c ? "white"   : "#595959",
              fontWeight: 600, fontSize: "0.78rem",
              boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
            }}>
            {c}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="px-5 flex-1 pb-32 space-y-3">

        {/* Loading */}
        {loading && [1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse"
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div className="h-36" style={{ background: "#F0F0F0" }} />
            <div className="p-4 space-y-2">
              <div className="h-4 w-3/4 rounded" style={{ background: "#F0F0F0" }} />
              <div className="h-4 w-1/2 rounded" style={{ background: "#F0F0F0" }} />
              <div className="h-2 w-full rounded-full" style={{ background: "#F0F0F0" }} />
            </div>
          </div>
        ))}

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center py-12">
            <AlertTriangle size={48} color="#8C8C8C" />
            <p style={{ color: "#8C8C8C", marginTop: "12px" }}>Gagal memuat kampanye</p>
            <button onClick={refetch}
              className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{ background: "#EEF4FF", color: "#1677FF", fontWeight: 600, fontSize: "0.85rem" }}>
              <RefreshCw size={14} /> Coba Lagi
            </button>
          </div>
        )}

        {/* Cards */}
        {!loading && !error && filtered.map((c) => {
          const pct = Math.round((c.current_amount / c.target_amount) * 100);
          return (
            <div key={c.id} className="bg-white rounded-2xl overflow-hidden cursor-pointer transition-all"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
              onClick={() => navigate(`/donor/campaign/${c.id}`)}>
              <div className="relative h-36 overflow-hidden">
                <img
                  src={c.image_url ?? "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400"}
                  alt={c.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(0,0,0,0.5),transparent)" }} />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(82,196,26,0.9)" }}>
                  <span style={{ fontSize: "0.62rem", color: "white", fontWeight: 700 }}>✓ Terverifikasi</span>
                </div>
              </div>
              <div className="p-4">
                <p style={{ fontWeight: 700, color: "#242424", fontSize: "0.88rem", lineHeight: "1.35", marginBottom: "2px" }}
                  className="line-clamp-2">
                  {c.title}
                </p>
                <div className="w-full h-2 rounded-full mb-1.5 mt-2" style={{ background: "#F0F0F0" }}>
                  <div className="h-full rounded-full"
                    style={{ width: `${Math.min(pct, 100)}%`, background: "linear-gradient(90deg,#1677FF,#108EE9)" }} />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p style={{ fontWeight: 800, color: "#1677FF", fontSize: "0.9rem" }}>{formatK(c.current_amount)}</p>
                    <p style={{ color: "#8C8C8C", fontSize: "0.68rem" }}>dari {formatK(c.target_amount)}</p>
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl"
                    style={{ background: "#1677FF", color: "white", fontWeight: 700, fontSize: "0.75rem" }}>
                    Donasi <ChevronRight size={13} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center py-12">
            <Search size={48} color="#8C8C8C" />
            <p style={{ color: "#8C8C8C", marginTop: "12px" }}>Kampanye tidak ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
}
