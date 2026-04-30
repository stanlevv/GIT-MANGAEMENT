// File ini memisahkan hook useAuth dari AuthProvider agar Vite Fast Refresh
// tidak mengeluarkan warning "export is incompatible".
// Selalu import useAuth dari sini, bukan langsung dari AuthContext.
export { useAuth } from "./AuthContext";
