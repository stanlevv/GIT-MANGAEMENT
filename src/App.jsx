import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ProfilDiego from './components/ProfilDiego'
import ProfilDavid from './components/ProfilDavid'
import ProfilKrisna from './components/ProfilKrisna'


const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
)
const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)


function CardMini({ to, color, colorBg, initials, name, role, bio, skills, stats }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          background: "#111118",
          border: `1px solid ${hovered ? color + "55" : "#ffffff14"}`,
          borderRadius: "20px",
          padding: "28px",
          width: "280px",
          maxWidth: "90vw",
          cursor: "pointer",
          transition: "border-color 0.35s ease, transform 0.35s ease, box-shadow 0.35s ease",
          transform: hovered ? "translateY(-6px)" : "translateY(0)",
          boxShadow: hovered
            ? `0 20px 60px ${color}22, 0 0 0 1px ${color}22`
            : "0 4px 24px #00000044",
          overflow: "hidden",
        }}
      >
      
        <div style={{
          position: "absolute", top: "-40px", right: "-40px",
          width: "140px", height: "140px", borderRadius: "50%",
          background: color, opacity: hovered ? 0.14 : 0.05,
          filter: "blur(40px)", transition: "opacity 0.5s ease", pointerEvents: "none",
        }} />

        
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
          <div style={{
            width: "50px", height: "50px", borderRadius: "14px",
            background: colorBg, border: `1.5px solid ${color}66`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "800", color, fontFamily: "'DM Mono', monospace"
          }} translate="no">
            {initials}
          </div>
          <div style={{ flex: 1 }}>
            <h2 className="notranslate" translate="no" style={{ margin: 0, fontSize: "17px", fontWeight: "700", color: "#f0eff8", letterSpacing: "-0.5px" }}>{name}</h2>
            <p style={{ margin: 0, fontSize: "11px", color, fontWeight: "500", fontFamily: "'DM Mono', monospace" }}>{role}</p>
          </div>
        </div>

        
        <p style={{ margin: "0 0 20px", fontSize: "13px", color: "#8b8a9e", lineHeight: "1.7", fontFamily: "'Sora', sans-serif" }}>{bio}</p>

        
        <div style={{ display: "flex", gap: "6px", marginBottom: "20px", padding: "10px 12px", background: "#ffffff06", borderRadius: "10px", border: "1px solid #ffffff0a" }}>
          {stats.map(s => (
            <div key={s.label} style={{ flex: 1, textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#e9e8f4", fontFamily: "'Sora', sans-serif" }}>{s.value}</p>
              <p style={{ margin: "2px 0 0", fontSize: "10px", color: "#5c5b72", fontFamily: "'DM Mono', monospace" }}>{s.label}</p>
            </div>
          ))}
        </div>

        
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
          {skills.map(s => (
            <span key={s} style={{ fontSize: "10px", padding: "3px 9px", borderRadius: "6px", background: colorBg, color, fontFamily: "'DM Mono', monospace", border: `1px solid ${color}33` }}>{s}</span>
          ))}
        </div>

        
        <div style={{ height: "1px", background: "#ffffff0d", marginBottom: "20px" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              {[<GithubIcon />, <LinkedinIcon />, <TwitterIcon />].map((icon, i) => (
                <span key={i} onClick={e => e.preventDefault()} style={{
                  width: "32px", height: "32px", borderRadius: "10px",
                  background: "#ffffff08", border: "1px solid #ffffff10",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#6b6a82", transition: "all 0.2s", cursor: "pointer",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = color + "22"; e.currentTarget.style.color = color; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#ffffff08"; e.currentTarget.style.color = "#6b6a82"; }}
                >{icon}</span>
              ))}
            </div>
          </div>
          
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              fontSize: "12px",
              padding: "10px",
              borderRadius: "12px",
              background: color + "15",
              color: color,
              fontFamily: "'DM Mono', monospace",
              fontWeight: "600",
              border: `1px solid ${color}33`,
              letterSpacing: "0.5px",
              transition: "all 0.3s ease",
              width: "100%",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = color
              e.currentTarget.style.color = "#080810"
              e.currentTarget.style.boxShadow = `0 8px 24px ${color}44`
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = color + "15"
              e.currentTarget.style.color = color
              e.currentTarget.style.boxShadow = "none"
            }}
          >
            Lihat Profil Lengkap
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}

const TECHS = [
  { name: "JavaScript", url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
  { name: "TypeScript", url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" },
  { name: "React",      url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
  { name: "PHP",        url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg" },
  { name: "Laravel",    url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg" },
  { name: "Bootstrap",  url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg" },
  { name: "Tailwind",   url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
  { name: "Node.js",    url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" },
  { name: "Python",     url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
  { name: "MySQL",      url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" },
  { name: "Git",        url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" },
  { name: "Vue.js",     url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" },
  { name: "Docker",     url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" },
  { name: "PostgreSQL", url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" },
  { name: "Figma",      url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg" },
]


function Home() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const move = (e) => setMouse({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <div style={{
      minHeight: "100vh", background: "#060610",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "60px 24px", fontFamily: "'Sora', sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      
      <div style={{
        position: "fixed", left: mouse.x, top: mouse.y,
        width: "500px", height: "500px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 70%)",
        transform: "translate(-50%,-50%)", pointerEvents: "none", zIndex: 1,
        transition: "left 0.06s ease, top 0.06s ease",
      }} />

      
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(167,139,250,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,0.025) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      
      <div style={{ position: "relative", zIndex: 2, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>

        
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={{ fontSize: "10px", letterSpacing: "4px", color: "#3d3b55", fontFamily: "'DM Mono', monospace", margin: "0 0 16px", textTransform: "uppercase" }}>
            Tugas Mata Kuliah Web
          </p>
          <h1 style={{ fontSize: "clamp(2.6rem, 5.5vw, 4rem)", fontWeight: "800", color: "#f0eff8", letterSpacing: "-2px", margin: "0 0 4px", lineHeight: 1.1 }}>
            Website Profil
          </h1>
          <h2 className="color-shift-text" style={{ fontSize: "clamp(2.6rem, 5.5vw, 4rem)", fontWeight: "800", letterSpacing: "-2px", margin: "0 0 20px", lineHeight: 1.1 }}>
            Anggota Kelompok
          </h2>
          <p style={{ fontSize: "12px", color: "#3d3b55", fontFamily: "'DM Mono', monospace", letterSpacing: "2px", textTransform: "uppercase", margin: 0 }}>
            — Klik kartu untuk melihat profil —
          </p>
        </div>

        
        <div style={{ width: "100%", maxWidth: "1000px", overflow: "hidden", position: "relative", marginBottom: "52px" }}>
          <div className="ticker-track" style={{ display: "flex", alignItems: "center", gap: "32px", animation: "ticker 22s linear infinite", whiteSpace: "nowrap", width: "max-content" }}>
            {[0, 1].map(copy => (
              <div key={copy} style={{ display: "flex", alignItems: "center", gap: "32px" }}>
                {TECHS.map(tech => (
                  <div key={tech.name + copy} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
                    <img src={tech.url} alt={tech.name} width="30" height="30"
                      style={{ display: "block", opacity: 0.8, transition: "opacity 0.2s, transform 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1.2)"; }}
                      onMouseLeave={e => { e.currentTarget.style.opacity = "0.8"; e.currentTarget.style.transform = "scale(1)"; }}
                    />
                    <span style={{ fontSize: "9px", color: "#3a3850", fontFamily: "'DM Mono', monospace", letterSpacing: "0.5px" }}>{tech.name}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        
        <div style={{ display: "flex", flexWrap: "wrap", gap: "28px", justifyContent: "center", alignItems: "flex-start" }}>
          <CardMini
            to="/diego"
            color="#a78bfa" colorBg="#1e1333"
            initials="DR" name="Diego Armando Ramadhan" role="UI/UX Designer"
            bio="Crafting digital experiences that feel intuitive and human. Obsessed with typography and whitespace."
            skills={["Figma", "Framer", "React"]}
            stats={[{ label: "Projects", value: 42 }, { label: "Stars", value: 318 }, { label: "Followers", value: "1.2k" }]}
          />
          <CardMini
            to="/david"
            color="#34d399" colorBg="#0d2620"
            initials="DB" name="David Bimantoro Sarasadi" role="Frontend Engineer"
            bio="Building performant web apps with React. Clean code advocate and open source contributor."
            skills={["React", "TypeScript", "Node.js"]}
            stats={[{ label: "Projects", value: 67 }, { label: "Stars", value: 512 }, { label: "Followers", value: "890" }]}
          />
          <CardMini
            to="/krisna"
            color="#f472b6" colorBg="#2d1123"
            initials="KA" name="Krisna Aryo Wicaksono" role="Full-Stack Developer"
            bio="Bridging frontend elegance with backend power. Love building things from zero to production."
            skills={["Next.js", "PostgreSQL", "Docker"]}
            stats={[{ label: "Projects", value: 55 }, { label: "Stars", value: 704 }, { label: "Followers", value: "1.5k" }]}
          />
        </div>

      </div>
    </div>
  )
}


function PageDetail({ children }) {
  return (
    <div style={{
      minHeight: "100vh", background: "#060610",
      display: "flex", flexDirection: "column",
      alignItems: "center", padding: "40px 24px 80px",
      fontFamily: "'Sora', sans-serif", position: "relative",
    }}>
     
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(167,139,250,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,0.025) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      
      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: "900px", marginBottom: "32px" }}>
        <Link to="/" style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "8px 16px", background: "#111118",
          border: "1px solid #ffffff14", borderRadius: "10px",
          color: "#9b9ab0", textDecoration: "none",
          fontFamily: "'DM Mono', monospace", fontSize: "12px", letterSpacing: "0.3px",
          transition: "all 0.2s ease",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#a78bfa55"; e.currentTarget.style.color = "#f0eff8"; e.currentTarget.style.background = "#1a1828"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#ffffff14"; e.currentTarget.style.color = "#9b9ab0"; e.currentTarget.style.background = "#111118"; }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Kembali ke Beranda
        </Link>
      </div>

      <div style={{ position: "relative", zIndex: 2, width: "100%", display: "flex", justifyContent: "center" }}>
        {children}
      </div>
    </div>
  )
}


const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Mono:wght@400;500;600&display=swap');
    * { box-sizing: border-box; }
    body { margin: 0; background: #060610; }
    a { text-decoration: none; }

    .blob { position: absolute; border-radius: 50%; filter: blur(80px); animation: float 18s ease-in-out infinite; }
    .blob-1 { width: 500px; height: 500px; background: radial-gradient(circle, #4f1d96, #1a0533); top: -100px; left: -100px; opacity: 0.45; animation-duration: 20s; }
    .blob-2 { width: 400px; height: 400px; background: radial-gradient(circle, #065f46, #022c22); bottom: -80px; right: -80px; opacity: 0.4; animation-duration: 24s; animation-delay: -6s; }
    .blob-3 { width: 320px; height: 320px; background: radial-gradient(circle, #831843, #3b0218); top: 40%; left: 55%; opacity: 0.35; animation-duration: 16s; animation-delay: -10s; }
    @keyframes float {
      0%,100% { transform: translate(0,0) scale(1); }
      33%      { transform: translate(40px,-50px) scale(1.08); }
      66%      { transform: translate(-30px,30px) scale(0.94); }
    }

    .color-shift-text {
      background: linear-gradient(135deg, #e2e0f0, #a78bfa, #e2e0f0);
      background-size: 200% 200%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: colorBreath 6s ease-in-out infinite;
    }
    @keyframes colorBreath {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes ticker {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
    .ticker-track:hover { animation-play-state: paused; }

    /* 🛡️ Translation & Mobile Protection */
    .notranslate, [translate="no"] { unicode-bidi: isolate; }
    
    @media (max-width: 768px) {
      .blob { filter: blur(40px) !important; opacity: 0.25 !important; }
      .blob-1 { width: 300px; height: 300px; }
      .blob-2 { width: 250px; height: 250px; }
      .blob-3 { width: 200px; height: 200px; }
    }
  `}</style>
)


export default function App() {
  return (
    <>
      <GlobalStyle />
      <Router basename="/GIT-MANGAEMENT">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/diego"  element={<PageDetail><ProfilDiego /></PageDetail>} />
          <Route path="/david"  element={<PageDetail><ProfilDavid /></PageDetail>} />
          <Route path="/krisna" element={<PageDetail><ProfilKrisna /></PageDetail>} />
        </Routes>
      </Router>
    </>
  )
}