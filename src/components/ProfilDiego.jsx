import { useState } from 'react'

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

export default function ProfilDiego() {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: "#111118",
        border: `1px solid ${hovered ? "#a78bfa55" : "#ffffff14"}`,
        borderRadius: "20px",
        padding: "28px",
        width: "280px",
        cursor: "default",
        transition: "border-color 0.35s ease, transform 0.35s ease, box-shadow 0.35s ease",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 20px 60px #a78bfa22, 0 0 0 1px #a78bfa22"
          : "0 4px 24px #00000044",
        overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute",
        top: "-40px",
        right: "-40px",
        width: "140px",
        height: "140px",
        borderRadius: "50%",
        background: "#a78bfa",
        opacity: hovered ? 0.12 : 0.05,
        filter: "blur(40px)",
        transition: "opacity 0.5s ease",
        pointerEvents: "none",
      }} />

      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
        <div style={{
          width: "52px",
          height: "52px",
          borderRadius: "14px",
          background: "#1e1333",
          border: "1.5px solid #a78bfa66",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'DM Mono', monospace",
          fontSize: "14px",
          fontWeight: "600",
          color: "#a78bfa",
          letterSpacing: "1px",
          flexShrink: 0,
        }}>
          DA
        </div>
        <div>
          <p style={{
            margin: 0,
            fontSize: "17px",
            fontWeight: "700",
            color: "#f1f0f8",
            fontFamily: "'Sora', sans-serif",
            letterSpacing: "-0.3px",
            lineHeight: 1.2,
          }}>Diego Alvaro</p>
          <p style={{
            margin: "4px 0 0",
            fontSize: "12px",
            color: "#a78bfa",
            fontFamily: "'DM Mono', monospace",
            opacity: 0.85,
          }}>UI/UX Designer</p>
        </div>
      </div>

      <p style={{
        margin: "0 0 20px",
        fontSize: "13.5px",
        color: "#8b8a9e",
        lineHeight: "1.7",
        fontFamily: "'Sora', sans-serif",
      }}>Crafting digital experiences that feel intuitive and human. Obsessed with typography and whitespace.</p>

      <div style={{
        display: "flex",
        gap: "8px",
        marginBottom: "20px",
        padding: "12px",
        background: "#ffffff06",
        borderRadius: "12px",
        border: "1px solid #ffffff0a",
      }}>
        {[
          { label: "Projects", value: 42 },
          { label: "Followers", value: "1.2k" },
          { label: "Stars", value: 318 },
        ].map((s) => (
          <div key={s.label} style={{ flex: 1, textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#e9e8f4", fontFamily: "'Sora', sans-serif" }}>{s.value}</p>
            <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#5c5b72", fontFamily: "'DM Mono', monospace" }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
        {["Figma", "Framer", "Prototyping"].map((skill) => (
          <span key={skill} style={{
            fontSize: "11px",
            padding: "4px 10px",
            borderRadius: "6px",
            background: "#1e1333",
            color: "#a78bfa",
            fontFamily: "'DM Mono', monospace",
            border: "1px solid #a78bfa33",
          }}>{skill}</span>
        ))}
      </div>

      <div style={{ height: "1px", background: "#ffffff0d", marginBottom: "16px" }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          {[
            { icon: <GithubIcon />, href: "#" },
            { icon: <LinkedinIcon />, href: "#" },
            { icon: <TwitterIcon />, href: "#" },
          ].map((s, i) => (
            <a key={i} href={s.href} style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "#ffffff08",
              border: "1px solid #ffffff10",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6b6a82",
              textDecoration: "none",
              transition: "background 0.2s, color 0.2s",
            }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "#a78bfa22";
                e.currentTarget.style.color = "#a78bfa";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "#ffffff08";
                e.currentTarget.style.color = "#6b6a82";
              }}
            >{s.icon}</a>
          ))}
        </div>

        <button style={{
          fontSize: "12px",
          padding: "7px 16px",
          borderRadius: "8px",
          background: "#a78bfa",
          color: "#080810",
          fontFamily: "'DM Mono', monospace",
          fontWeight: "600",
          border: "none",
          cursor: "pointer",
          letterSpacing: "0.3px",
          transition: "opacity 0.2s",
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >Contact</button>
      </div>
    </div>
  )
}
