import React, { useState } from "react";

interface Screen {
  id: string;
  title: string;
  role: string;
  component: React.ReactNode;
}

const screens: Screen[] = [
  {
    id: "login",
    title: "1. Login",
    role: "Semua Role",
    component: <LoginScreen />,
  },
  {
    id: "student-dashboard",
    title: "2. Dashboard Siswa",
    role: "Student",
    component: <StudentDashboardScreen />,
  },
  {
    id: "spp-payment",
    title: "3. Pembayaran SPP",
    role: "Student",
    component: <SPPPaymentScreen />,
  },
  {
    id: "campaign-submission",
    title: "4. Ajukan Kampanye",
    role: "Student/Parent",
    component: <CampaignSubmissionScreen />,
  },
  {
    id: "campaign-list",
    title: "5. Daftar Kampanye",
    role: "All Roles",
    component: <CampaignListScreen />,
  },
  {
    id: "campaign-detail",
    title: "6. Detail & Donasi",
    role: "Donor",
    component: <CampaignDetailScreen />,
  },
  {
    id: "school-dashboard",
    title: "7. Dashboard Sekolah",
    role: "School/Admin",
    component: <SchoolDashboardScreen />,
  },
  {
    id: "manage-bills",
    title: "8. Kelola Tagihan",
    role: "School/Admin",
    component: <ManageBillsScreen />,
  },
  {
    id: "manage-campaigns",
    title: "9. Kelola Kampanye",
    role: "School/Admin",
    component: <ManageCampaignsScreen />,
  },
  {
    id: "donor-profile",
    title: "10. Profil Donatur",
    role: "Donor",
    component: <DonorProfileScreen />,
  },
  {
    id: "aid-review",
    title: "11. Review Bantuan",
    role: "School/Admin",
    component: <AidReviewScreen />,
  },
  {
    id: "history",
    title: "12. Riwayat Transaksi",
    role: "All Roles",
    component: <HistoryScreen />,
  },
];

export default function WireframeViewer() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#F5F5F5",
      padding: "30px 20px",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Decorative Background Elements */}
      <div style={{
        position: "absolute",
        top: "5%",
        right: "8%",
        width: "200px",
        height: "200px",
        borderRadius: "50%",
        border: "2px solid rgba(0,0,0,0.1)",
        opacity: 0.6
      }} />
      <div style={{
        position: "absolute",
        top: "15%",
        right: "5%",
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        border: "2px solid rgba(0,0,0,0.1)",
        opacity: 0.4
      }} />
      <div style={{
        position: "absolute",
        bottom: "10%",
        left: "5%",
        display: "grid",
        gridTemplateColumns: "repeat(3, 8px)",
        gap: "8px",
        opacity: 0.4
      }}>
        {[...Array(9)].map((_, i) => (
          <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#666666" }} />
        ))}
      </div>
      <div style={{
        position: "absolute",
        top: "40%",
        left: "3%",
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        background: "#666666",
        opacity: 0.3
      }} />
      <div style={{
        position: "absolute",
        bottom: "20%",
        right: "10%",
        width: "30px",
        height: "30px",
        borderRadius: "50%",
        background: "#AAAAAA",
        opacity: 0.4
      }} />

      <div style={{ maxWidth: "1600px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h1 style={{
            fontSize: "42px",
            fontWeight: "900",
            color: "#666666",
            marginBottom: "12px",
            textShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            EDUFIN - Low Fidelity Wireframes
          </h1>
          <p style={{ fontSize: "18px", color: "#666666", fontWeight: "500" }}>
            Wireframe halaman-halaman penting sistem pendidikan dan donasi
          </p>
          <div style={{
            display: "inline-block",
            marginTop: "16px",
            padding: "8px 24px",
            background: "rgba(255, 255, 255, 0.9)",
            borderRadius: "24px",
            fontSize: "14px",
            color: "#8C8C8C",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}>
            📱 12 Wireframes • Mobile-First Design • Max Width 430px
          </div>
        </div>

        {/* All Wireframes Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
          marginBottom: "40px"
        }}>
          {screens.map((screen, index) => (
            <WireframeCard
              key={screen.id}
              number={index + 1}
              title={screen.title.replace(/^\d+\.\s*/, "")}
              role={screen.role}
              component={screen.component}
            />
          ))}
        </div>

        {/* Legend */}
        <div style={{
          background: "white",
          borderRadius: "24px",
          padding: "40px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)"
        }}>
          <h3 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "24px", color: "#333333" }}>
            📋 Penjelasan Elemen Wireframe
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
            <LegendItem color="#666666" label="Warna utama - CTA buttons dan header" />
            <LegendItem color="#f5f5f5" border="3px dashed #d9d9d9" label="Placeholder untuk konten dinamis (image, chart)" />
            <LegendItem color="white" border="3px solid #d9d9d9" label="Card dan List Item containers" />
            <LegendItem color="#fafafa" border="3px solid #d9d9d9" label="Form input fields untuk user input" />
          </div>

          <div style={{
            marginTop: "32px",
            padding: "24px",
            background: "#F0F0F0",
            borderRadius: "16px",
            borderLeft: "4px solid #666666"
          }}>
            <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#333333", marginBottom: "12px" }}>
              💡 Tips Export untuk Dokumentasi TA/Skripsi:
            </h4>
            <ul style={{ margin: 0, paddingLeft: "24px", color: "#666666", lineHeight: "1.8" }}>
              <li><strong>Screenshot:</strong> Win+Shift+S (Windows) atau Cmd+Shift+4 (Mac)</li>
              <li><strong>Print to PDF:</strong> Ctrl+P atau Cmd+P → Save as PDF</li>
              <li><strong>Resolution:</strong> Zoom browser ke 100-125% untuk hasil terbaik</li>
              <li><strong>Caption:</strong> Gunakan format "Gambar 4.X Wireframe [Nama Halaman]"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function WireframeCard({ number, title, role, component }: {
  number: number;
  title: string;
  role: string;
  component: React.ReactNode;
}) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "20px",
      background: "white",
      borderRadius: "24px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      transition: "transform 0.2s",
    }}>
      <div style={{
        marginBottom: "20px",
        textAlign: "center",
        width: "100%"
      }}>
        <div style={{
          display: "inline-block",
          padding: "6px 16px",
          background: "#EEEEEE",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: "700",
          color: "#666666",
          marginBottom: "12px"
        }}>
          {number}. {role}
        </div>
        <h3 style={{
          fontSize: "18px",
          fontWeight: "800",
          color: "#333333",
          margin: 0
        }}>
          {title}
        </h3>
      </div>
      <div>
        {component}
      </div>
      <div style={{
        marginTop: "20px",
        padding: "12px 24px",
        background: "#F0F0F0",
        borderRadius: "12px",
        border: "2px solid #DDDDDD",
        cursor: "move",
        userSelect: "none"
      }}>
        <span style={{ fontSize: "13px", fontWeight: "700", color: "#666666" }}>
          {title}
        </span>
      </div>
    </div>
  );
}

function LegendItem({ color, border, label }: { color: string; border?: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div style={{
        width: "48px",
        height: "32px",
        background: color,
        border: border || "none",
        borderRadius: "4px",
        flexShrink: 0
      }} />
      <span style={{ fontSize: "14px", color: "#666666" }}>{label}</span>
    </div>
  );
}



const wireframeStyles = {
  phone: {
    zoom: 0.7,
    width: "360px",
    height: "760px",
    border: "8px solid #B0B0B0",
    borderRadius: "40px",
    background: "white",
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.08)",
    position: "relative" as const,
    display: "flex",
    flexDirection: "column" as const,
    overflow: "hidden",
  },
  contentArea: {
    flex: 1,
    overflowY: "auto" as const,
    padding: "0 16px",
    msOverflowStyle: "none" as const,
    scrollbarWidth: "none" as const,
  },
  header: {
    background: "#DDDDDD",
    height: "60px",
    flexShrink: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 16px",
    marginBottom: "16px"
  },
  skeletonText: {
    background: "#D0D0D0",
    borderRadius: "4px",
    height: "12px",
  },
  skeletonCircle: {
    background: "#D0D0D0",
    borderRadius: "50%",
  },
  box: {
    background: "#E8E8E8",
    borderRadius: "12px",
  },
  card: {
    background: "#FAFAFA",
    border: "2px solid #EAEAEA",
    borderRadius: "14px",
    padding: "16px",
  },
  btn: {
    background: "#AAAAAA",
    borderRadius: "12px",
    height: "44px",
  },
  btnOutline: {
    background: "white",
    border: "2px solid #D0D0D0",
    borderRadius: "12px",
    height: "44px",
  },
  input: {
    background: "#F5F5F5",
    border: "2px solid #EAEAEA",
    borderRadius: "12px",
    height: "48px",
  },
  listItem: {
    border: "2px solid #EAEAEA",
    borderRadius: "14px",
    padding: "16px",
    background: "white",
  },
  bottomNav: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    height: "64px",
    flexShrink: 0,
    background: "white",
    borderTop: "2px solid #EAEAEA",
  },
  navItem: {
    width: "24px",
    height: "24px",
    background: "#D0D0D0",
    borderRadius: "6px"
  }
};

function LoginScreen() {
  return (
    <div style={wireframeStyles.phone}>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 20px" }}>
        <div style={{ width: "40px", ...wireframeStyles.skeletonText }} />
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ width: "14px", height: "14px", ...wireframeStyles.box }} />
          <div style={{ width: "14px", height: "14px", ...wireframeStyles.box }} />
          <div style={{ width: "24px", height: "14px", ...wireframeStyles.box }} />
        </div>
      </div>
      <div style={{ ...wireframeStyles.contentArea, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 24px" }}>
        <div style={{ ...wireframeStyles.box, height: "100px", borderRadius: "50%", width: "100px", margin: "0 auto 40px" }} />
        <div style={{ marginBottom: "40px" }}>
          <div style={{ ...wireframeStyles.skeletonText, width: "60%", margin: "0 auto 12px", height: "16px" }} />
          <div style={{ ...wireframeStyles.skeletonText, width: "80%", margin: "0 auto", height: "16px" }} />
        </div>
        <div style={{ ...wireframeStyles.input, marginBottom: "16px", display: "flex", alignItems: "center", padding: "0 16px" }}>
          <div style={{ width: "24px", height: "24px", ...wireframeStyles.skeletonCircle, marginRight: "12px" }} />
          <div style={{ ...wireframeStyles.skeletonText, flex: 1 }} />
        </div>
        <div style={{ ...wireframeStyles.input, marginBottom: "32px", display: "flex", alignItems: "center", padding: "0 16px" }}>
          <div style={{ width: "24px", height: "24px", ...wireframeStyles.skeletonCircle, marginRight: "12px" }} />
          <div style={{ ...wireframeStyles.skeletonText, flex: 1 }} />
        </div>
        <div style={{ ...wireframeStyles.btn, marginBottom: "16px" }} />
        <div style={{ ...wireframeStyles.btnOutline }} />
        <div style={{ marginTop: "32px" }}>
          <div style={{ ...wireframeStyles.skeletonText, width: "40%", margin: "0 auto", height: "10px" }} />
        </div>
      </div>
    </div>
  );
}

function StudentDashboardScreen() {
  return (
    <div style={wireframeStyles.phone}>
      <div style={wireframeStyles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "36px", height: "36px", ...wireframeStyles.skeletonCircle }} />
          <div style={{ width: "100px", ...wireframeStyles.skeletonText }} />
        </div>
        <div style={{ width: "24px", height: "24px", ...wireframeStyles.box, borderRadius: "6px" }} />
      </div>
      <div style={wireframeStyles.contentArea}>
        <div style={{ ...wireframeStyles.card, marginBottom: "16px" }}>
          <div style={{ width: "120px", ...wireframeStyles.skeletonText, marginBottom: "16px" }} />
          <div style={{ width: "160px", ...wireframeStyles.skeletonText, height: "32px", marginBottom: "20px" }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={wireframeStyles.btn} />
            <div style={wireframeStyles.btnOutline} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "16px" }}>
          <div style={{ ...wireframeStyles.box, height: "70px" }} />
          <div style={{ ...wireframeStyles.box, height: "70px" }} />
          <div style={{ ...wireframeStyles.box, height: "70px" }} />
        </div>
        <div style={{ ...wireframeStyles.box, height: "140px", marginBottom: "16px" }} />
        <div style={{ ...wireframeStyles.listItem, marginBottom: "12px", display: "flex", alignItems: "center" }}>
          <div style={{ width: "40px", height: "40px", ...wireframeStyles.box, marginRight: "16px" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
            <div style={{ width: "80%", ...wireframeStyles.skeletonText }} />
            <div style={{ width: "50%", ...wireframeStyles.skeletonText }} />
          </div>
        </div>
        <div style={{ ...wireframeStyles.listItem, display: "flex", alignItems: "center" }}>
          <div style={{ width: "40px", height: "40px", ...wireframeStyles.box, marginRight: "16px" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
            <div style={{ width: "70%", ...wireframeStyles.skeletonText }} />
            <div style={{ width: "40%", ...wireframeStyles.skeletonText }} />
          </div>
        </div>
      </div>
      <div style={wireframeStyles.bottomNav}>
        <div style={wireframeStyles.navItem} />
        <div style={wireframeStyles.navItem} />
        <div style={wireframeStyles.navItem} />
        <div style={wireframeStyles.navItem} />
      </div>
    </div>
  );
}

function SPPPaymentScreen() {
  return (
    <div style={wireframeStyles.phone}>
      <div style={wireframeStyles.header}>
        <div style={{ width: "24px", height: "24px", ...wireframeStyles.box, borderRadius: "6px" }} />
        <div style={{ width: "100px", ...wireframeStyles.skeletonText }} />
        <div style={{ width: "24px", height: "24px", opacity: 0 }} />
      </div>
      <div style={wireframeStyles.contentArea}>
        <div style={{ ...wireframeStyles.card, marginBottom: "20px" }}>
          <div style={{ width: "120px", ...wireframeStyles.skeletonText, marginBottom: "20px" }} />
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{ width: "80px", ...wireframeStyles.skeletonText }} />
              <div style={{ width: "100px", ...wireframeStyles.skeletonText }} />
            </div>
          ))}
          <div style={{ borderTop: "2px solid #EAEAEA", paddingTop: "16px", display: "flex", justifyContent: "space-between" }}>
            <div style={{ width: "50px", ...wireframeStyles.skeletonText, height: "16px" }} />
            <div style={{ width: "120px", ...wireframeStyles.skeletonText, height: "16px" }} />
          </div>
        </div>
        <div style={{ width: "140px", ...wireframeStyles.skeletonText, marginBottom: "16px" }} />
        {[...Array(3)].map((_, i) => (
          <div key={i} style={{ ...wireframeStyles.listItem, marginBottom: "12px", display: "flex", alignItems: "center" }}>
            <div style={{ width: "32px", height: "32px", ...wireframeStyles.box, borderRadius: "8px", marginRight: "16px" }} />
            <div style={{ width: "120px", ...wireframeStyles.skeletonText }} />
            <div style={{ marginLeft: "auto", width: "20px", height: "20px", border: "2px solid #D0D0D0", borderRadius: "50%" }} />
          </div>
        ))}
        <div style={{ ...wireframeStyles.btn, marginTop: "24px" }} />
      </div>
    </div>
  );
}

function CampaignSubmissionScreen() {
  return (
    <div style={wireframeStyles.phone}>
      <div style={wireframeStyles.header}>
        <div style={{ width: "24px", height: "24px", ...wireframeStyles.box, borderRadius: "6px" }} />
        <div style={{ width: "130px", ...wireframeStyles.skeletonText }} />
        <div style={{ width: "24px", height: "24px", opacity: 0 }} />
      </div>
      <div style={wireframeStyles.contentArea}>
        <div style={{ ...wireframeStyles.box, height: "160px", marginBottom: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ width: "48px", height: "48px", ...wireframeStyles.skeletonCircle }} />
        </div>
        <div style={{ ...wireframeStyles.input, marginBottom: "16px" }} />
        <div style={{ ...wireframeStyles.input, height: "100px", marginBottom: "16px" }} />
        <div style={{ ...wireframeStyles.input, height: "80px", marginBottom: "16px" }} />
        <div style={{ ...wireframeStyles.input, marginBottom: "16px" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
          <div style={wireframeStyles.input} />
          <div style={wireframeStyles.input} />
        </div>
        <div style={wireframeStyles.btn} />
      </div>
    </div>
  );
}

function CampaignListScreen() {
  return (
    <div style={wireframeStyles.phone}>
      <div style={wireframeStyles.header}>
        <div style={{ width: "140px", ...wireframeStyles.skeletonText }} />
        <div style={{ width: "32px", height: "32px", ...wireframeStyles.box, borderRadius: "6px" }} />
      </div>
      <div style={wireframeStyles.contentArea}>
        <div style={{ ...wireframeStyles.input, marginBottom: "16px", borderRadius: "24px" }} />
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <div style={{ ...wireframeStyles.btn, flex: 1, height: "32px", borderRadius: "16px" }} />
          <div style={{ ...wireframeStyles.btnOutline, flex: 1, height: "32px", borderRadius: "16px" }} />
          <div style={{ ...wireframeStyles.btnOutline, flex: 1, height: "32px", borderRadius: "16px" }} />
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} style={{ ...wireframeStyles.card, marginBottom: "16px", padding: "12px" }}>
            <div style={{ ...wireframeStyles.box, height: "140px", marginBottom: "12px" }} />
            <div style={{ width: "180px", ...wireframeStyles.skeletonText, marginBottom: "12px" }} />
            <div style={{ height: "8px", background: "#EAEAEA", borderRadius: "4px", marginBottom: "10px" }}>
              <div style={{ width: "60%", height: "100%", background: "#AAAAAA", borderRadius: "4px" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ width: "50px", ...wireframeStyles.skeletonText }} />
              <div style={{ width: "90px", ...wireframeStyles.skeletonText }} />
            </div>
          </div>
        ))}
      </div>
      <div style={wireframeStyles.bottomNav}>
        <div style={wireframeStyles.navItem} />
        <div style={wireframeStyles.navItem} />
        <div style={wireframeStyles.navItem} />
        <div style={wireframeStyles.navItem} />
      </div>
    </div>
  );
}

function CampaignDetailScreen() {
  return (
    <div style={wireframeStyles.phone}>
      <div style={{ ...wireframeStyles.box, position: "absolute", top: 0, left: 0, right: 0, height: "240px", borderRadius: "32px 32px 0 0" }} />
      <div style={{ position: "absolute", top: "24px", left: "20px", width: "36px", height: "36px", background: "white", borderRadius: "50%", zIndex: 10 }} />
      <div style={{ ...wireframeStyles.contentArea, marginTop: "220px", background: "white", borderRadius: "24px 24px 0 0", paddingTop: "24px", position: "relative", zIndex: 5 }}>
        <div style={{ width: "220px", height: "20px", ...wireframeStyles.skeletonText, marginBottom: "16px" }} />
        <div style={{ height: "10px", background: "#EAEAEA", borderRadius: "5px", marginBottom: "14px" }}>
          <div style={{ width: "70%", height: "100%", background: "#AAAAAA", borderRadius: "5px" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
          <div style={{ width: "120px", ...wireframeStyles.skeletonText }} />
          <div style={{ width: "80px", ...wireframeStyles.skeletonText }} />
        </div>
        <div style={{ width: "100px", ...wireframeStyles.skeletonText, marginBottom: "12px" }} />
        <div style={{ ...wireframeStyles.box, height: "100px", marginBottom: "24px" }} />
        <div style={{ width: "120px", ...wireframeStyles.skeletonText, marginBottom: "12px" }} />
        <div style={{ ...wireframeStyles.input, height: "56px", marginBottom: "24px" }} />
        <div style={{ width: "140px", ...wireframeStyles.skeletonText, marginBottom: "12px" }} />
        <div style={{ ...wireframeStyles.listItem, height: "56px", marginBottom: "24px" }} />
        <div style={wireframeStyles.btn} />
      </div>
    </div>
  );
}

function SchoolDashboardScreen() {
  return (
    <div style={wireframeStyles.phone}>
      <div style={wireframeStyles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "36px", height: "36px", ...wireframeStyles.box, borderRadius: "8px" }} />
          <div style={{ width: "110px", ...wireframeStyles.skeletonText }} />
        </div>
        <div style={{ width: "36px", height: "36px", ...wireframeStyles.skeletonCircle }} />
      </div>
      <div style={wireframeStyles.contentArea}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "20px" }}>
          <div style={{ ...wireframeStyles.box, height: "64px" }} />
          <div style={{ ...wireframeStyles.box, height: "64px" }} />
          <div style={{ ...wireframeStyles.box, height: "64px" }} />
        </div>
        <div style={{ ...wireframeStyles.card, marginBottom: "20px" }}>
          <div style={{ width: "140px", ...wireframeStyles.skeletonText, marginBottom: "16px" }} />
          <div style={{ ...wireframeStyles.box, height: "160px", display: "flex", alignItems: "flex-end", gap: "12px", padding: "12px", justifyContent: "center" }}>
            <div style={{ width: "24px", height: "40%", background: "#AAAAAA", borderRadius: "6px 6px 0 0" }} />
            <div style={{ width: "24px", height: "70%", background: "#AAAAAA", borderRadius: "6px 6px 0 0" }} />
            <div style={{ width: "24px", height: "50%", background: "#AAAAAA", borderRadius: "6px 6px 0 0" }} />
            <div style={{ width: "24px", height: "90%", background: "#AAAAAA", borderRadius: "6px 6px 0 0" }} />
            <div style={{ width: "24px", height: "60%", background: "#AAAAAA", borderRadius: "6px 6px 0 0" }} />
          </div>
        </div>
        <div style={{ width: "100px", ...wireframeStyles.skeletonText, marginBottom: "16px" }} />
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ ...wireframeStyles.listItem, marginBottom: "12px", display: "flex", alignItems: "center" }}>
            <div style={{ width: "24px", height: "24px", ...wireframeStyles.box, borderRadius: "6px", marginRight: "16px" }} />
            <div style={{ width: "140px", ...wireframeStyles.skeletonText }} />
            <div style={{ width: "20px", height: "20px", ...wireframeStyles.box, marginLeft: "auto", borderRadius: "6px" }} />
          </div>
        ))}
      </div>
      <div style={wireframeStyles.bottomNav}>
        <div style={wireframeStyles.navItem} />
        <div style={wireframeStyles.navItem} />
        <div style={wireframeStyles.navItem} />
        <div style={wireframeStyles.navItem} />
      </div>
    </div>
  );
}

function ManageBillsScreen() {
  return (
    <div style={wireframeStyles.phone}>
      <div style={wireframeStyles.header}>
        <div style={{ width: "24px", height: "24px", ...wireframeStyles.box, borderRadius: "6px" }} />
        <div style={{ width: "120px", ...wireframeStyles.skeletonText }} />
        <div style={{ width: "24px", height: "24px", ...wireframeStyles.box, borderRadius: "6px" }} />
      </div>
      <div style={wireframeStyles.contentArea}>
        <div style={{ ...wireframeStyles.input, marginBottom: "16px" }} />
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <div style={{ ...wireframeStyles.btn, flex: 1, height: "36px", borderRadius: "18px" }} />
          <div style={{ ...wireframeStyles.btnOutline, flex: 1, height: "36px", borderRadius: "18px" }} />
          <div style={{ ...wireframeStyles.btnOutline, flex: 1, height: "36px", borderRadius: "18px" }} />
        </div>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ ...wireframeStyles.listItem, marginBottom: "12px", padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <div style={{ width: "120px", ...wireframeStyles.skeletonText, height: "14px" }} />
              <div style={{ width: "70px", ...wireframeStyles.box, height: "20px", borderRadius: "10px" }} />
            </div>
            <div style={{ width: "160px", ...wireframeStyles.skeletonText, marginBottom: "10px" }} />
            <div style={{ width: "100px", ...wireframeStyles.skeletonText }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ManageCampaignsScreen() {
  return (
    <div style={wireframeStyles.phone}>
      <div style={wireframeStyles.header}>
        <div style={{ width: "24px", height: "24px", ...wireframeStyles.box, borderRadius: "6px" }} />
        <div style={{ width: "140px", ...wireframeStyles.skeletonText }} />
        <div style={{ width: "24px", height: "24px", ...wireframeStyles.box, borderRadius: "6px" }} />
      </div>
      <div style={wireframeStyles.contentArea}>
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <div style={{ ...wireframeStyles.btn, flex: 1, height: "36px", borderRadius: "18px" }} />
          <div style={{ ...wireframeStyles.btnOutline, flex: 1, height: "36px", borderRadius: "18px" }} />
          <div style={{ ...wireframeStyles.btnOutline, flex: 1, height: "36px", borderRadius: "18px" }} />
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} style={{ ...wireframeStyles.card, marginBottom: "16px" }}>
            <div style={{ ...wireframeStyles.box, height: "100px", marginBottom: "16px" }} />
            <div style={{ width: "160px", ...wireframeStyles.skeletonText, marginBottom: "12px" }} />
            <div style={{ width: "200px", ...wireframeStyles.skeletonText, marginBottom: "20px" }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div style={{ ...wireframeStyles.btnOutline, height: "40px", borderRadius: "8px" }} />
              <div style={{ ...wireframeStyles.btn, height: "40px", borderRadius: "8px" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DonorProfileScreen() {
  return (
    <div style={wireframeStyles.phone}>
      <div style={wireframeStyles.header}>
        <div style={{ width: "70px", ...wireframeStyles.skeletonText }} />
        <div style={{ width: "36px", height: "36px", ...wireframeStyles.box, borderRadius: "8px" }} />
      </div>
      <div style={wireframeStyles.contentArea}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "24px", marginTop: "12px" }}>
          <div style={{ width: "80px", height: "80px", ...wireframeStyles.skeletonCircle, marginBottom: "16px" }} />
          <div style={{ width: "140px", ...wireframeStyles.skeletonText, height: "16px", marginBottom: "10px" }} />
          <div style={{ width: "180px", ...wireframeStyles.skeletonText }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
          <div style={{ ...wireframeStyles.box, height: "80px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <div style={{ width: "50px", ...wireframeStyles.skeletonText, marginBottom: "10px" }} />
            <div style={{ width: "70px", ...wireframeStyles.skeletonText, height: "16px" }} />
          </div>
          <div style={{ ...wireframeStyles.box, height: "80px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <div style={{ width: "50px", ...wireframeStyles.skeletonText, marginBottom: "10px" }} />
            <div style={{ width: "40px", ...wireframeStyles.skeletonText, height: "16px" }} />
          </div>
        </div>
        <div style={{ width: "100px", ...wireframeStyles.skeletonText, marginBottom: "16px" }} />
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{ ...wireframeStyles.listItem, marginBottom: "12px", display: "flex", alignItems: "center" }}>
            <div style={{ width: "28px", height: "28px", ...wireframeStyles.box, borderRadius: "8px", marginRight: "16px" }} />
            <div style={{ width: "140px", ...wireframeStyles.skeletonText }} />
          </div>
        ))}
      </div>
      <div style={wireframeStyles.bottomNav}>
        <div style={wireframeStyles.navItem} />
        <div style={wireframeStyles.navItem} />
        <div style={wireframeStyles.navItem} />
        <div style={wireframeStyles.navItem} />
      </div>
    </div>
  );
}

function AidReviewScreen() {
  return (
    <div style={wireframeStyles.phone}>
      <div style={wireframeStyles.header}>
        <div style={{ width: "24px", height: "24px", ...wireframeStyles.box, borderRadius: "6px" }} />
        <div style={{ width: "130px", ...wireframeStyles.skeletonText }} />
        <div style={{ width: "24px", height: "24px", opacity: 0 }} />
      </div>
      <div style={wireframeStyles.contentArea}>
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <div style={{ ...wireframeStyles.btn, flex: 1, height: "36px", borderRadius: "18px" }} />
          <div style={{ ...wireframeStyles.btnOutline, flex: 1, height: "36px", borderRadius: "18px" }} />
          <div style={{ ...wireframeStyles.btnOutline, flex: 1, height: "36px", borderRadius: "18px" }} />
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} style={{ ...wireframeStyles.card, marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <div style={{ width: "120px", ...wireframeStyles.skeletonText, height: "14px" }} />
              <div style={{ width: "90px", ...wireframeStyles.skeletonText }} />
            </div>
            <div style={{ width: "180px", ...wireframeStyles.skeletonText, marginBottom: "16px" }} />
            <div style={{ ...wireframeStyles.box, height: "60px", marginBottom: "16px" }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div style={{ ...wireframeStyles.btnOutline, height: "40px", borderRadius: "8px" }} />
              <div style={{ ...wireframeStyles.btn, height: "40px", borderRadius: "8px" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HistoryScreen() {
  return (
    <div style={wireframeStyles.phone}>
      <div style={wireframeStyles.header}>
        <div style={{ width: "140px", ...wireframeStyles.skeletonText }} />
        <div style={{ width: "36px", height: "36px", ...wireframeStyles.box, borderRadius: "8px" }} />
      </div>
      <div style={wireframeStyles.contentArea}>
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <div style={{ ...wireframeStyles.btn, flex: 1, height: "36px", borderRadius: "18px" }} />
          <div style={{ ...wireframeStyles.btnOutline, flex: 1, height: "36px", borderRadius: "18px" }} />
          <div style={{ ...wireframeStyles.btnOutline, flex: 1, height: "36px", borderRadius: "18px" }} />
        </div>
        
        <div style={{ width: "90px", ...wireframeStyles.skeletonText, marginBottom: "16px" }} />
        {[...Array(2)].map((_, i) => (
           <div key={i} style={{ ...wireframeStyles.listItem, marginBottom: "12px" }}>
             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
               <div style={{ width: "140px", ...wireframeStyles.skeletonText }} />
               <div style={{ width: "24px", height: "24px", ...wireframeStyles.box, borderRadius: "6px" }} />
             </div>
             <div style={{ width: "180px", ...wireframeStyles.skeletonText }} />
           </div>
        ))}
        
        <div style={{ width: "90px", ...wireframeStyles.skeletonText, margin: "24px 0 16px" }} />
        {[...Array(2)].map((_, i) => (
          <div key={i+2} style={{ ...wireframeStyles.listItem, marginBottom: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <div style={{ width: "140px", ...wireframeStyles.skeletonText }} />
              <div style={{ width: "24px", height: "24px", ...wireframeStyles.box, borderRadius: "6px" }} />
            </div>
            <div style={{ width: "180px", ...wireframeStyles.skeletonText }} />
          </div>
        ))}
      </div>
      <div style={wireframeStyles.bottomNav}>
        <div style={wireframeStyles.navItem} />
        <div style={wireframeStyles.navItem} />
        <div style={wireframeStyles.navItem} />
        <div style={wireframeStyles.navItem} />
      </div>
    </div>
  );
}
