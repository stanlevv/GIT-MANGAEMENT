import React from 'react'

function App() {
  return (
    // Background dengan gradien dan dekorasi lingkaran blur
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Dekorasi Cahaya Blur di Background */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      {/* Card Utama dengan Efek Glassmorphism (Blur) */}
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl overflow-hidden relative z-10">
        
        {/* Header dengan Foto di Tengah - Sesuai Poin 43 */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="w-32 h-32 bg-slate-800 rounded-full border-4 border-white/30 shadow-2xl flex items-center justify-center overflow-hidden backdrop-blur-lg">
              {/* Ganti dengan <img src="/path-foto.jpg" /> jika sudah ada filenya */}
              <span className="text-white/50 text-xs italic font-semibold">FOTO PROFIL</span>
            </div>
          </div>
        </div>
        
        <div className="pt-20 pb-10 px-8 flex flex-col items-center">
          {/* Nama Lengkap - Sesuai Poin 39 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-white tracking-tight uppercase">Diego Armando Ramadhan</h1>
            <p className="text-blue-400 font-medium tracking-widest text-sm mt-2 uppercase">Teknologi Informasi • Universitas Brawijaya</p>
          </div>

          {/* Grid Data Diri - Sesuai Poin 40-42 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-8">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center backdrop-blur-sm">
              <span className="block text-blue-400 text-xs font-bold uppercase mb-1">Kelas</span>
              <span className="text-white font-medium">[Isi Kelas]</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center backdrop-blur-sm">
              <span className="block text-blue-400 text-xs font-bold uppercase mb-1">Jurusan</span>
              <span className="text-white font-medium">D3 Teknologi Informasi</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center backdrop-blur-sm">
              <span className="block text-blue-400 text-xs font-bold uppercase mb-1">Domisili</span>
              <span className="text-white font-medium">Malang</span>
            </div>
          </div>

          {/* Deskripsi - Sesuai Poin 44 (Min 100 Kata) */}
          <div className="w-full">
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-blue-500 pl-4">Tentang Diri</h2>
            <p className="text-slate-300 leading-relaxed text-justify text-sm bg-white/5 p-6 rounded-2xl border border-white/10 shadow-inner">
              Halo, nama saya Diego Armando Ramadhan. Saat ini saya sedang menempuh pendidikan di Universitas Brawijaya, Malang, pada program studi D3 Teknologi Informasi. Saya memiliki minat yang sangat besar dalam bidang pengembangan web, terutama dalam mengeksplorasi teknologi modern seperti ReactJS dan Tailwind CSS untuk menciptakan antarmuka yang responsif dan menarik. Selain fokus pada perkuliahan, saya juga aktif mempelajari sistem operasi Linux yang saya coba jalankan melalui lingkungan Android menggunakan Termux. Di luar dunia digital, saya sangat antusias dengan dunia kesehatan fisik, khususnya bodybuilding, yang telah membantu saya membentuk disiplin dan kerja keras. Saya percaya bahwa keseimbangan antara kemampuan teknis di bidang teknologi informasi dan kesehatan fisik yang terjaga akan sangat mendukung produktivitas saya sebagai pengembang di masa depan. Melalui proyek kolaborasi GitHub ini, saya berharap dapat terus mengasah kemampuan teknis dan kerjasama tim saya demi membangun masa depan yang lebih baik di industri teknologi.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App