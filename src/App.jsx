import React from 'react'

function App() {
  return (
    // Background utama dengan gradien gelap dan dekorasi blur
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans relative overflow-hidden">
      
      {/* Dekorasi Cahaya Blur di Background (Efek Estetik) */}
      <div className="absolute top-0 -left-10 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 -right-10 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

      {/* Card Utama dengan Efek Glassmorphism (Blur) */}
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden relative z-10">
        
        {/* Header Biru Gradien */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
          
          {/* FOTO PROFIL DI TENGAH - Sesuai Poin 43 Tugas UB */}
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="w-32 h-32 bg-slate-800 rounded-full border-4 border-white/30 shadow-2xl flex items-center justify-center overflow-hidden backdrop-blur-lg">
              {/* Mengambil foto dari public/fotodiri.png */}
              <img 
                src="/fotodiri.png" 
                alt="Diego Armando Ramadhan" 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=Foto+Diego"; }} 
              />
            </div>
          </div>
        </div>
        
        <div className="pt-20 pb-10 px-8 flex flex-col items-center">
          
          {/* IDENTITAS UTAMA - Sesuai Poin 39 Tugas UB */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-white tracking-tight uppercase">Diego Armando Ramadhan</h1>
            <p className="text-blue-400 font-semibold tracking-widest text-sm mt-2 uppercase">D3 Teknologi Informasi • Universitas Brawijaya</p>
          </div>

          {/* GRID DATA DIRI - Sesuai Poin 40-42 Tugas UB */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-8">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center backdrop-blur-sm transition-transform hover:scale-105">
              <span className="block text-blue-400 text-xs font-bold uppercase mb-1">Kelas</span>
              <span className="text-white font-medium text-base">[Isi Kelas Kamu]</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center backdrop-blur-sm transition-transform hover:scale-105">
              <span className="block text-blue-400 text-xs font-bold uppercase mb-1">Jurusan</span>
              <span className="text-white font-medium text-base">D3 Teknologi Informasi</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center backdrop-blur-sm transition-transform hover:scale-105">
              <span className="block text-blue-400 text-xs font-bold uppercase mb-1">Domisili</span>
              <span className="text-white font-medium text-base">Malang</span>
            </div>
          </div>

          {/* DESKRIPSI TENTANG DIRI - Sesuai Poin 44 (Wajib Min 100 Kata) */}
          <div className="w-full">
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-blue-500 pl-4">Tentang Saya</h2>
            <div className="bg-black/30 p-6 rounded-2xl border border-white/10 shadow-inner">
              <p className="text-slate-300 leading-relaxed text-justify text-sm">
                Halo, nama saya Diego Armando Ramadhan. Saat ini saya sedang menempuh pendidikan di Universitas Brawijaya, Malang, pada program studi D3 Teknologi Informasi. Saya memiliki minat yang sangat besar dalam bidang pengembangan web, terutama dalam mengeksplorasi teknologi modern seperti ReactJS dan Tailwind CSS untuk menciptakan antarmuka yang responsif dan menarik. Selain fokus pada perkuliahan, saya juga aktif mempelajari sistem operasi Linux yang saya coba jalankan melalui lingkungan Android menggunakan Termux. Di luar dunia digital, saya sangat antusias dengan dunia kesehatan fisik, khususnya bodybuilding, yang telah membantu saya membentuk disiplin dan kerja keras. Saya percaya bahwa keseimbangan antara kemampuan teknis di bidang teknologi informasi dan kesehatan fisik yang terjaga akan sangat mendukung produktivitas saya sebagai pengembang di masa depan. Melalui proyek kolaborasi GitHub ini, saya berharap dapat terus mengasah kemampuan teknis dan kerjasama tim saya demi membangun masa depan yang lebih baik di industri teknologi.
              </p>
            </div>
          </div>
          
          {/* Footer UB */}
          <div className="mt-8 text-slate-500 text-[10px] uppercase tracking-[0.2em]">
            &copy; 2026 Universitas Brawijaya • IMK Project
          </div>
        </div>
      </div>
    </div>
  )
}

export default App