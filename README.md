Panduan ini dirancang supaya loe nggak bingung dan langsung bisa buat di GIT-MANGAEMENT.
________________________________________
📌 PANDUAN KERJA KELOMPOK (STEP-BY-STEP)
"ikuti langkah ini berurutan biar kodingan nggak tabrakan:"
Step 1: Gabung ke Project (Wajib)
1.	Cek notifikasi email kalian atau buka link ini: https://github.com/notifications
2.	Klik "Accept Invitation" untuk masuk ke repo: stanlevv/GIT-MANGAEMENT.
Step 2: Ambil Projek ke Laptop (Clone)
Buka folder yang biasa kalian pake ngodinnk lalu click kanan open di Terminal nah munculkan cli folder kalian (misal di folder C:\laragon\www\branch-profile), lalu ketik: ini

git clone https://github.com/stanlevv/GIT-MANGAEMENT.git
cd GIT-MANGAEMENT
npm install
Step 3: Buat Jalur Sendiri (Branching)
JANGAN langsung edit di main. Buat branch pakai nama kalian:
PowerShell
git checkout -b dev/[nama
# Contoh: git checkout -b dev/agus-setiawan
Step 4: Buat Profil Kalian
Step 5: Setor ke GitHub (Push)
Setelah selesai dan sudah dicek di localhost:5173, kirim ke GitHub:
PowerShell
git add .
git commit -m "Update profil [Nama Kalian]"
git push origin dev/[nama-kalian]
________________________________________
Tips buat Diego (Leader):
•	Cek Progress: Kamu bisa pantau siapa yang sudah setor di tab "Branches" di GitHub.
•	Merge: Nanti kalau mereka sudah push, kamu tinggal klik "Compare & Pull Request" di GitHub untuk gabungkan profil mereka ke halaman utama (main).
________________________________________
Link Cepat untuk Tim:
•	Repo Kita: https://github.com/stanlevv/GIT-MANGAEMENT
•	Terima Undangan: https://github.com/notifications
•	Dokumentasi Tailwind: tailwindcss.com (buat cari warna/style).
________________________________________



# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
