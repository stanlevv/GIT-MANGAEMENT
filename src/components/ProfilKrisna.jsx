const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
)
const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const color    = "#f472b6"
const colorBg  = "#2d1123"
const name     = "Krisna Aryo Wicaksono"
const role     = "Full-Stack Developer"
const photoSrc = "/GIT-MANGAEMENT/img/fotokrisna.png"
const kelas    = "TI-2D"
const domisili = "Kota Tuban"
const jurusan  = "Teknologi Informasi"
const skills   = ["Next.js", "PostgreSQL", "Docker", "React", "Node.js"]
const description = `Perkenalkan nama saya Krisna Aryo Wicaksono, mahasiswa di program studi Teknologi Informasi. Sejak mula terjun di dunia teknologi, saya mencurahkan fokus penuh pada rekayasa perangkat lunak dari berbagai sisi fungsionalitas. Menyatukan balutan arsitektur antarmuka UI interaktif cantik yang didukung daya pendorong mesin logika server secara utuh adalah dorongan terbesar bagi saya menjadi spesialisasi penuh yaitu Full Stack Developer. Saya menggunakan JavaScript modern layaknya React dan Next.js, sekaligus menantang diri berulang mereplikasi algoritma basis data relasional menggunakan PostgreSQL. Mengamati setiap baris dari deretan program mentransformasi instruksi rumit hingga benar-benar merubah pola proses bisnis menjadi efisien dan otomatis adalah salah satu capaian terindah yang sangat membuat ketagihan. Ke depannya saya ingin membangun startup teknologi yang memberikan solusi nyata bagi masyarakat luas.`

export default function ProfilKrisna() {
  return (
    <div style={{ display:"flex", flexDirection:"row", gap:"24px", alignItems:"flex-start", maxWidth:"900px", width:"100%", flexWrap:"wrap", justifyContent:"center", padding:"0 4px" }}>

      <div style={{ flex:"1 1 340px", width:"100%", background:"#111118", border:`1px solid ${color}22`, borderRadius:"24px", padding:"28px", boxShadow:`0 20px 60px ${color}11`, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-50px", right:"-50px", width:"180px", height:"180px", borderRadius:"50%", background:color, opacity:0.06, filter:"blur(50px)", pointerEvents:"none" }} />
        <h1 className="notranslate" translate="no" style={{ margin:"0 0 4px", fontSize:"1.8rem", fontWeight:"800", color:"#f0eff8", fontFamily:"'Sora',sans-serif", letterSpacing:"-1px" }}>{name}</h1>
        <p style={{ margin:"0 0 28px", fontSize:"11px", color, fontFamily:"'DM Mono',monospace", letterSpacing:"0.5px" }} translate="no">{role}</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(130px, 1fr))", gap:"10px", marginBottom:"28px" }}>
          {[["Kelas",kelas],["Domisili",domisili],["Jurusan / Prodi",jurusan,true]].map(([label,val,full])=>(
            <div key={label} style={{ gridColumn:full?"span 2":"span 1", background:"#ffffff06", borderRadius:"12px", padding:"12px 14px", border:"1px solid #ffffff08" }}>
              <p style={{ margin:"0 0 4px", fontSize:"10px", color:"#4a4960", fontFamily:"'DM Mono',monospace", textTransform:"uppercase", letterSpacing:"1px" }}>{label}</p>
              <p style={{ margin:0, fontSize:"14px", fontWeight:"600", color:"#e9e8f4", fontFamily:"'Sora',sans-serif" }}>{val}</p>
            </div>
          ))}
        </div>
        <h2 style={{ margin:"0 0 10px", fontSize:"11px", fontWeight:"600", color:"#f0eff8", fontFamily:"'DM Mono',monospace", textTransform:"uppercase", letterSpacing:"2px" }}>Tentang Diri</h2>
        <p style={{ margin:"0 0 28px", fontSize:"13.5px", color:"#8b8a9e", lineHeight:"1.85", fontFamily:"'Sora',sans-serif", textAlign:"justify" }}>{description}</p>
        
        <div style={{ marginBottom: "32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: "0 0 12px", fontSize: "11px", color: "#4a4960", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "1px" }}>Skill Metrics</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { name: "Backend Logic", val: 96 },
                { name: "DB Design", val: 90 },
                { name: "System Arch", val: 85 }
              ].map(s => (
                <div key={s.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontSize: "11px", color: "#8b8a9e" }}>{s.name}</span>
                    <span style={{ fontSize: "11px", color, fontWeight: "600" }}>{s.val}%</span>
                  </div>
                  <div style={{ width: "100%", height: "4px", background: "#ffffff0a", borderRadius: "10px", overflow: "hidden" }}>
                    <div style={{ width: `${s.val}%`, height: "100%", background: color, boxShadow: `0 0 10px ${color}88` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div style={{ display: "flex", justifyContent: "center" }}>
            <svg width="120" height="120" viewBox="0 0 120 120" style={{ filter: `drop-shadow(0 0 12px ${color}33)` }}>
              <circle cx="60" cy="60" r="50" fill="none" stroke="#ffffff10" strokeWidth="1" />
              <circle cx="60" cy="60" r="30" fill="none" stroke="#ffffff08" strokeWidth="1" />
              {[0, 72, 144, 216, 288].map(deg => (
                <line key={deg} x1="60" y1="60" x2={60 + 50 * Math.cos(deg * Math.PI / 180)} y2={60 + 50 * Math.sin(deg * Math.PI / 180)} stroke="#ffffff08" strokeWidth="1" />
              ))}
              <polygon points="60,30 90,40 100,90 40,110 20,70" fill={`${color}22`} stroke={color} strokeWidth="2" />
              <circle cx="60" cy="30" r="3" fill={color} />
              <circle cx="90" cy="40" r="3" fill={color} />
              <circle cx="100" cy="90" r="3" fill={color} />
              <circle cx="40" cy="110" r="3" fill={color} />
              <circle cx="20" cy="70" r="3" fill={color} />
            </svg>
          </div>
        </div>

        <div style={{ height:"1px", background:"#ffffff0d", marginBottom:"20px" }} />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ display:"flex", gap:"10px" }}>
            {[<GithubIcon/>,<LinkedinIcon/>,<TwitterIcon/>].map((icon,i)=>(
              <a key={i} href="#" style={{ width:"36px", height:"36px", borderRadius:"10px", background:"#ffffff08", border:"1px solid #ffffff10", display:"flex", alignItems:"center", justifyContent:"center", color:"#6b6a82", textDecoration:"none", transition:"all 0.2s" }}
                onMouseEnter={e=>{e.currentTarget.style.background=color+"22";e.currentTarget.style.color=color;}}
                onMouseLeave={e=>{e.currentTarget.style.background="#ffffff08";e.currentTarget.style.color="#6b6a82";}}
              >{icon}</a>
            ))}
          </div>
          <button style={{ fontSize:"12px", padding:"9px 22px", borderRadius:"10px", background:color, color:"#080810", fontFamily:"'DM Mono',monospace", fontWeight:"700", border:"none", cursor:"pointer" }}>Hire Me</button>
        </div>
      </div>

      
      <div style={{ flex:"0 0 240px", display:"flex", flexDirection:"column", alignItems:"center", gap:"16px" }}>
        <div style={{ width:"240px", height:"300px", borderRadius:"24px", overflow:"hidden", border:`2px solid ${color}33`, boxShadow:`0 24px 64px ${color}22`, position:"relative" }}>
          <img src={photoSrc} alt={name} style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top center" }}
            onError={e=>{e.currentTarget.style.display="none"; e.currentTarget.parentElement.style.background=colorBg; e.currentTarget.parentElement.style.display="flex"; e.currentTarget.parentElement.style.alignItems="center"; e.currentTarget.parentElement.style.justifyContent="center"; e.currentTarget.parentElement.innerHTML=`<span style="font-size:48px;font-weight:800;color:${color};font-family:DM Mono,monospace">K</span>`}}
          />
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"70px", background:"linear-gradient(to top,rgba(6,6,16,0.85),transparent)", pointerEvents:"none" }}/>
        </div>
        <div style={{ background:"#111118", border:`1px solid ${color}22`, borderRadius:"14px", padding:"14px 20px", width:"100%", textAlign:"center" }}>
          <p style={{ margin:"0 0 3px", fontSize:"15px", fontWeight:"700", color:"#f0eff8", fontFamily:"'Sora',sans-serif" }}>{name}</p>
          <p style={{ margin:0, fontSize:"11px", color, fontFamily:"'DM Mono',monospace" }}>{role}</p>
        </div>

        
        <div style={{ width: "100%", background: "#111118", border: "1px solid #ffffff0a", borderRadius: "18px", padding: "20px", marginTop: "12px" }}>
          <p style={{ margin: "0 0 16px", fontSize: "10px", color: "#4a4960", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "2px", textAlign: "center" }}>Technical Stack</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginBottom: "20px" }}>
            {[
              "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg",
              "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg",
              "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
              "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg"
            ].map((url, i) => (
              <img key={i} src={url} width="22" height="22" style={{ filter: `drop-shadow(0 0 8px ${color}33)` }} />
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { label: "Backend Dev", val: "Expert" },
              { label: "DB Management", val: "Advanced" },
              { label: "Cloud Deploy", val: "Intermediate" }
            ].map(item => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "#ffffff04", borderRadius: "10px" }}>
                <span style={{ fontSize: "11px", color: "#8b8a9e", fontFamily: "'Sora', sans-serif" }}>{item.label}</span>
                <span style={{ fontSize: "11px", fontWeight: "600", color, fontFamily: "'DM Mono', monospace" }}>{item.val}</span>
              </div>
            ))}
          </div>
        </div>

        
        <div style={{ width: "100%", background: "#111118", border: "1px solid #ffffff0a", borderRadius: "18px", padding: "20px", marginTop: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ fontSize: "10px", color: "#4a4960", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "1px" }}>Efficiency</span>
            <span style={{ fontSize: "10px", color, fontFamily: "'DM Mono', monospace", fontWeight: "700" }}>High</span>
          </div>
          <div style={{ height: "40px", width: "100%", overflow: "hidden" }}>
            <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 40">
              <defs>
                <linearGradient id="lineGradAkbar" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,38 L15,10 L30,25 L50,15 L70,30 L85,5 L100,15 V40 H0 Z" fill="url(#lineGradAkbar)" />
              <path d="M0,38 L15,10 L30,25 L50,15 T70,30 L85,5 L100,15" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 6px ${color}88)` }} />
            </svg>
          </div>
        </div>
      </div>

    </div>
  )
}
