// Re-export useAuth dari context agar Vite Fast Refresh tidak mengeluarkan warning
// "export is incompatible". Selalu import useAuth dari hooks/, bukan langsung dari AuthContext.
export { useAuth } from "../context/AuthContext";
