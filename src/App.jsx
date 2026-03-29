import ProfilDiego from './components/ProfilDiego'
import ProfilDavid from './components/ProfilDavid'
import ProfilKrisna from './components/ProfilKrisna'

export default function App() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Mono:wght@400;500;600&display=swap');
      `}</style>
      <div style={{
        minHeight: "100vh",
        backgroundColor: "#0a0a12",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
        fontFamily: "'Sora', sans-serif"
      }}>
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <p style={{
            fontSize: "12px",
            letterSpacing: "3px",
            color: "#4a4960",
            fontFamily: "'DM Mono', monospace",
            marginBottom: "12px",
            textTransform: "uppercase"
          }}>
            Kelompok Web & UI/UX
          </p>
          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: "bold",
            color: "#f0eff8",
            letterSpacing: "-1.5px",
            margin: "0",
            lineHeight: "1.2"
          }}>
            Our Development<br />
            <span style={{
              background: "linear-gradient(90deg, #a78bfa, #34d399)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>Team</span>
          </h1>
        </div>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
          alignItems: "flex-start",
          width: "100%"
        }}>
          <ProfilDiego />
          <ProfilDavid />
          <ProfilKrisna />
        </div>
      </div>
    </>
  )
}