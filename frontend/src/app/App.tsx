import React from "react";
import { RouterProvider } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { router } from "./routes";

// AuthProvider di sini — di luar RouterProvider — agar hanya mount SEKALI.
// Jika AuthProvider ada di dalam AppLayout (layout route), ia akan re-mount
// setiap kali user navigasi, menyebabkan isLoading reset & redirect ke login.
export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}