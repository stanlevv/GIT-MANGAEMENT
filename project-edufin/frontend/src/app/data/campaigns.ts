/**
 * Centralized campaign data — satu sumber yang dipakai oleh semua komponen.
 * DonorDashboard, DonorCampaignsPage, FundraisingPage, CampaignDetail, StudentDashboard.
 */

export interface Campaign {
  id: number;
  title: string;
  target: number;
  collected: number;
  image: string;
  school: string;
  location: string;
  category: string;
  verified: boolean;
  donors: number;
  daysLeft: number;
  urgent?: boolean;
  story?: string;
  updates?: { date: string; text: string }[];
}

export const CAMPAIGNS: Campaign[] = [
  {
    id: 1,
    title: "Beasiswa Siswa Berprestasi SDN 3 Malang",
    target: 15000000,
    collected: 11200000,
    image: "https://images.unsplash.com/photo-1758316289766-d483969b7f90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    school: "SDN 3 Malang",
    location: "Malang",
    category: "Beasiswa",
    verified: true,
    donors: 124,
    daysLeft: 12,
    urgent: false,
    story: "SDN 3 Malang memiliki banyak siswa berprestasi namun terbentur keterbatasan biaya pendidikan. Program beasiswa ini bertujuan untuk membantu 10 siswa terbaik agar dapat melanjutkan pendidikan ke jenjang yang lebih tinggi tanpa hambatan finansial.\n\nDana yang terkumpul akan digunakan untuk biaya SPP, seragam, perlengkapan belajar, dan transportasi selama 1 tahun ajaran penuh.",
    updates: [
      { date: "5 Mei 2025", text: "Dana sudah mencapai 74% dari target! Terima kasih para donatur." },
      { date: "20 Apr 2025", text: "Kampanye resmi diluncurkan dan telah diverifikasi oleh sekolah." },
    ],
  },
  {
    id: 2,
    title: "Renovasi Lab Komputer SMP Negeri 5 Batu",
    target: 25000000,
    collected: 18500000,
    image: "https://images.unsplash.com/photo-1551161001-5c4184cc4317?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    school: "SMPN 5 Batu",
    location: "Batu",
    category: "Fasilitas",
    verified: true,
    donors: 89,
    daysLeft: 25,
    urgent: false,
    story: "Lab komputer SMPN 5 Batu sudah berusia lebih dari 10 tahun dan komputer-komputernya sudah usang. Kami membutuhkan dana untuk membeli 15 unit komputer baru beserta perlengkapannya.",
    updates: [
      { date: "1 Mei 2025", text: "Proses tender pembelian komputer sudah dimulai." },
    ],
  },
  {
    id: 3,
    title: "Dana Buku & Alat Tulis Siswa Kurang Mampu",
    target: 8000000,
    collected: 6100000,
    image: "https://images.unsplash.com/photo-1752920299180-e8fd9276c202?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    school: "SMA Negeri 2 Kepanjen",
    location: "Malang",
    category: "Perlengkapan",
    verified: false,
    donors: 67,
    daysLeft: 8,
    urgent: true,
    story: "Banyak siswa di SMA Negeri 2 Kepanjen yang tidak mampu membeli buku pelajaran dan alat tulis yang diperlukan. Kampanye ini bertujuan untuk menyediakan perlengkapan belajar bagi 30 siswa kurang mampu.",
    updates: [],
  },
  {
    id: 4,
    title: "Bantuan Biaya Ujian Siswa Tidak Mampu",
    target: 5000000,
    collected: 3200000,
    image: "https://images.unsplash.com/photo-1569173675610-42c361a86e37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    school: "MAN 1 Malang",
    location: "Malang",
    category: "Ujian",
    verified: true,
    donors: 45,
    daysLeft: 18,
    urgent: false,
    story: "Ujian nasional dan ujian sekolah memerlukan biaya yang tidak sedikit. Dana ini akan membantu 20 siswa dari keluarga tidak mampu agar dapat mengikuti ujian dengan tenang tanpa khawatir soal biaya.",
    updates: [],
  },
];

export const CAMPAIGN_MAP: Record<string, Campaign> = Object.fromEntries(
  CAMPAIGNS.map((c) => [String(c.id), c])
);
