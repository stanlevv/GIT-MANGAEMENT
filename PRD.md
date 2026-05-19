# 📄 PRD — EDUFIN (Educational Finance Platform)

> **BACA FILE INI PERTAMA KALI** sebelum mengerjakan apapun di project ini.
> File ini adalah sumber kebenaran utama (single source of truth) untuk seluruh requirements project EDUFIN.

# 🗂️ Struktur Project

```
project-edufin/
├── PRD.md                    ← FILE INI (baca pertama kali)
├── AI_HANDOFF.md             ← Catatan pekerjaan AI terakhir
│
├── frontend/                 ← React 19 + TypeScript + Vite
│   └── src/
│       ├── main.tsx          ← Entry point aplikasi
│       ├── styles/           ← CSS global (index, theme, fonts, tailwind)
│       ├── assets/           ← Gambar & aset statis
│       └── app/
│           ├── App.tsx       ← Root component (AuthProvider + RouterProvider)
│           ├── routes.tsx    ← Definisi semua route
│           ├── store.ts      ← Redux store
│           │
│           ├── config/       ← Konfigurasi global
│           │   ├── api.ts    ← API_BASE URL, apiFetch, Google Client ID
│           │   └── school.ts ← Konstanta data sekolah
│           │
│           ├── pages/        ← Komponen level halaman (1:1 dengan route)
│           │   ├── auth/     ← OnboardingPage, LoginPage, RegisterPage
│           │   ├── student/  ← StudentDashboard, PaySPP, LoanPage, dll
│           │   ├── school/   ← SchoolDashboard, SchoolBillsPage, dll
│           │   └── donor/    ← DonorDashboard, CampaignDetail, dll
│           │
│           ├── components/   ← Komponen reusable (bukan halaman)
│           │   ├── ui/       ← Primitive shadcn/ui (button, card, dialog, dll)
│           │   ├── shared/   ← Layout & widget bersama (AppLayout, BottomNav, dll)
│           │   └── modals/   ← Form & modal per domain
│           │       ├── student/
│           │       ├── school/
│           │       └── donor/
│           │
│           ├── context/      ← React Context (AuthContext)
│           ├── hooks/        ← Custom hooks (useAuth, useApi)
│           ├── lib/          ← Utility murni (format.ts, authToken.ts, campaigns.ts)
│           └── services/     ← Integrasi API eksternal (aiApi.ts)
│
└── backend/                  ← Laravel (PHP) + Sanctum
    ├── app/
    │   ├── Http/Controllers/API/  ← AuthController, StudentController, dll
    │   ├── Http/Resources/        ← API Resource transformers
    │   ├── Http/Requests/         ← Form Request validators
    │   ├── Models/                ← User, Student, Bill, Payment, Campaign, dll
    │   └── Services/              ← TripayService, dll
    ├── database/
    │   ├── migrations/            ← Schema database
    │   └── seeders/               ← Data awal
    └── routes/api.php             ← Definisi endpoint API
```

> **Aturan penamaan:**
> - `pages/` → komponen yang di-render langsung oleh router (satu file = satu route)
> - `components/shared/` → layout atau widget yang dipakai lintas role
> - `components/modals/` → form atau dialog yang di-trigger dari page, dikelompokkan per role
> - `components/ui/` → primitive shadcn, **jangan dimodifikasi manual**
> - `app/config/api.ts` → satu-satunya sumber `API_BASE`, `apiFetch`, dan `GOOGLE_CLIENT_ID`

# PRODUCT REQUIREMENTS DOCUMENT (PRD)
EDUFIN – Platform Keuangan Pendidikan Digital untuk satu Sekolah

Versi: 1.1 (Revisi Flow Utama)  
Tanggal: 29 April 2026  
Penulis: diego

1.  Ringkasan Proyek (Project Overview)

EDUFIN adalah platform web mobile untuk mengelola keuangan sekolah secara digital.  
Tujuan utama: Menjembatani 3 aktor (Orang Tua/Siswa, Admin Sekolah, Donatur) dengan alur yang transparan, otomatis, dan aman.

Scope MVP:

- Pembayaran SPP & cicilan
- Ajukan & cairkan bantuan siswa
- Kampanye donasi (2 tipe: Bantuan Siswa & Proyek Sekolah)
- Dashboard real-time untuk semua aktor
- Integrasi payment gateway
- Laporan & audit lengkap

2. Aktor / User Roles

No | Aktor            | Akses Utama

1.  Orang Tua / Siswa > Mobile + Web
2.  Admin Sekolah     > Web Desktop
3.  Donatur           > Web publik (guest)

4.  Aliran Dana (Money Flow) – Hard Rules

[📝 NOTE: Fund Pools Architecture Decision]
Berdasarkan evaluasi arsitektur, diputuskan untuk membuat tabel `fund_pools` terpisah dari tabel `campaigns`. Ini untuk memastikan pemisahan logika (separation of concerns) yang lebih baik antara data tampilan kampanye dan buku besar keuangan (ledger), serta mematuhi PRD secara ketat.

5.  Setiap kampanye memiliki Pool Dana sendiri (tidak boleh bercampur).
6.  Dana hanya masuk melalui Payment Gateway.
7.  Dana hanya keluar setelah approval + cek saldo otomatis.
8.  Sistem blokir otomatis jika saldo pool tidak cukup.
9.  Semua transaksi masuk/keluar dicatat di Audit Log (siapa, kapan, berapa, dari pool mana, untuk apa).

Visual Aliran Dana Utama:

Donatur / Orang Tua
↓ (Bayar via Payment Gateway)
Dana 100% MASUK ke Pool Kampanye terkait (real-time update)
↓
Admin Dashboard (Saldo Pool ter-update)
↓
Pengajuan Bantuan / Pengeluaran Proyek
↓
Admin Pilih Pool Dana + Multi-Level Approval
↓
Pencairan Otomatis (SPP potong / Transfer / Reimbursement)
↓
Notifikasi + Audit Log + Laporan Transparan

4. Fitur Lengkap per Aktor (Frontend)

(Bagian ini PRD fokus permintaan adalah Flow Utama)

Orang Tua / Siswa: Dashboard, Kampanye Donasi, Ajukan Bantuan, Riwayat, Profil.  
Admin Sekolah: Sidebar (Dashboard, Kampanye Donasi, Pengajuan Bantuan, Pengeluaran Proyek, Laporan, dll).  
Donatur: Halaman publik kampanye.

5. FLOW UTAMA (DETAIL & LENGKAP) ← BAGIAN YANG DIPERLUAS

Berikut adalah alur end-to-end yang paling penting di EDUFIN. Setiap flow mencantumkan:

- Aktor yang terlibat
- Langkah-langkah frontend & backend
- Kondisi / validasi
- Notifikasi yang keluar

   5.1 Flow Pembuatan Kampanye Donasi (Admin)

      1. Admin login → klik Kampanye Donasi → + Buat Kampanye Baru\*\*.
      2. Pilih Tipe Kampanye :
         - Bantuan Siswa
         - Proyek Sekolah
      3. Isi data: nama kampanye, foto, deskripsi, target dana, tanggal mulai & berakhir, status publik/privat.
      4. Klik Simpan → sistem buat Pool Dana baru dengan saldo awal = Rp 0.
      5. Kampanye langsung muncul di list Admin dan (jika publik) di halaman Donatur.
      6. Backend: Buat record di tabel `campaigns` dan `fund_pools`. Notifikasi:Tidak ada (hanya internal).

   5.2 Flow Donasi (Donatur → Pool Dana)

      1. Donatur buka halaman `/kampanye` atau dari dashboard Orang Tua.
      2. Pilih kampanye → klik Donasi Sekarang.
      3. Masukkan nominal + pesan (opsional) → pilih metode pembayaran → Payment Gateway.
      4. Pembayaran sukses → webhook dari PG ke EDUFIN.
      5. Backend otomatis:
         - Tambah saldo ke `fund_pools` kampanye tersebut.
         - Catat transaksi di `transactions` (tipe = “donasi”).
      6. Dashboard Admin & halaman detail kampanye update real-time (progress bar + saldo).  
   Notifikasi:
   - Donatur: “Terima kasih, donasi Anda Rp X telah masuk ke Kampanye Y”
   - Admin: “Donasi baru Rp X masuk ke Kampanye Y”

   5.3 Flow Pengajuan & Pencairan Bantuan Siswa

      1. Orang Tua login → Dashboard → Ajukan Bantuan.
      2. Isi form: siswa, jenis bantuan (SPP, buku, ujian, dll), nominal, alasan, upload bukti.
      3. Klik Submit → status = “Pending”.
      4. Admin menerima notifikasi → buka **Pengajuan Bantuan Siswa**.
      5. Admin klik detail pengajuan → lihat riwayat siswa.
      6. Admin klik Approve:
         - Pilih Sumber Dana (dropdown hanya menampilkan pool kampanye Bantuan Siswa yang memiliki saldo cukup).
         - Sistem cek saldo otomatis. Jika kurang → tombol disable + pesan error.
      7. (Opsional) Approval level 2 oleh Kepala Sekolah jika nominal > Rp 5.000.000.
      8. Backend otomatis:
         - Kurangi saldo pool yang dipilih.
         - Potong tagihan SPP siswa atau buat record transfer.
         - Ubah status pengajuan menjadi “Disetujui & Dicairkan”.
      9. Pencairan:
         - Jika potong SPP → tagihan siswa langsung berkurang.
         - Jika transfer → panggil Payment Gateway (disbursement).
      Notifikasi:
         - Orang Tua: “Pengajuan bantuan Rp X disetujui dari Kampanye Y”
         - Donatur (opsional): “Donasi Anda telah membantu siswa Z”

   5.4 Flow Pengeluaran Proyek Sekolah (Renovasi Lab, Buku, Biaya Ujian, dll)

      1. Admin buka Pengeluaran Proyek → + Tambah Pengeluaran.
      2. Pilih kampanye tipe Proyek Sekolah.
      3. Isi: nominal, keterangan, upload invoice/kwitansi/foto bukti.
      4. Sistem cek saldo pool otomatis.
      5. Admin klik **Cairkan** → multi-level approval jika diperlukan.
      6. Backend:
         - Kurangi saldo pool.
         - Catat di `project_expenses`.
         - (Opsional) Panggil PG untuk transfer ke vendor.
      7. Kampanye detail otomatis update: “Dana terpakai Rp X dari Rp Y”.  
      Notifikasi:
         - Admin: “Pengeluaran proyek telah tercatat”
         - Donatur (opsional): “Donasi Anda telah digunakan untuk renovasi laboratorium”

   5.5 Flow Pembayaran SPP & Cicilan (Orang Tua)

      1. Orang Tua buka Dashboard → lihat tagihan SPP.
      2. Klik Bayar Sekarang atau Bayar Cicilan.
      3. Pilih nominal / cicilan → Payment Gateway.
      4. Sukses → webhook → update status tagihan siswa menjadi “Lunas” / “Cicilan ke-X”.
      5. Admin dashboard langsung ter-update (total pemasukan & grafik).
      Notifikasi: Orang Tua & Admin mendapat konfirmasi pembayaran.

6. Non-Functional Requirements

- Real-time update (WebSocket untuk saldo & notifikasi)
- Role-based access + audit log lengkap
- Payment Gateway integration (callback & disbursement)
- Export Excel/PDF di semua laporan
- Mobile-first web (Orang Tua), Desktop-first (Admin)

### 7. Acceptance Criteria

- Setiap flow di atas dapat dijalankan tanpa error.
- Tidak ada pencairan dana yang melebihi saldo pool.
- Semua aktor menerima notifikasi yang relevan.
- Laporan akhir kampanye menunjukkan 100% transparansi (dana masuk vs keluar).
- Audit log dapat menjawab “dari mana dana ini berasal dan ke mana digunakan”.

<!-- ================================================================ -->

---

## ⚡ Quick Reference untuk AI

### Tech Stack

| Layer    | Teknologi                                   |
| -------- | ------------------------------------------- |
| Frontend | React 19, TypeScript, Vite, React Router v7 |
| Backend  | Laravel (PHP), Sanctum Token Auth           |
| Database | SQLite (dev)                                |
| Payment  | Midtrans                                    |
| Auth     | Email/password + Google OAuth (donor only)  |

### Role Pengguna

| Role            | Akses                                         |
| --------------- | --------------------------------------------- |
| `parent`        | Bayar SPP, ajukan bantuan, lihat tagihan anak |
| `student`       | Lihat tagihan, riwayat, fundraising           |
| `admin_sekolah` | Kelola tagihan, laporan, monitoring           |
| `donor`         | Browse & donasi kampanye (login via Google)   |

### Database Tables (10 tabel)

`users` · `students` · `bills` · `payments` · `campaigns` · `donations` · `aid_requests` · `support_tickets` · `fund_pools` · `project_expenses`

### API Base URL

- **Development**: `http://localhost:8000/api`
- **Production**: sesuaikan dengan domain Rumahweb

### Cara Jalankan Project

```bash
# Backend
cd backend
php artisan serve

# Frontend
cd frontend
npm run dev
```

---

## 📌 Aturan Wajib untuk AI

1. **Selalu baca `AI_HANDOFF.md`** untuk tahu apa yang terakhir dikerjakan
2. **Update `AI_HANDOFF.md`** setelah selesai mengerjakan task
3. **Jangan hapus data dummy/seeder** tanpa konfirmasi user
4. **Gunakan Sanctum token** untuk semua request API yang butuh auth
5. **Google OAuth hanya untuk role `donor`** — role lain pakai email/password
6. **Tagihan dibuat otomatis** via Laravel Scheduler setiap bulan
