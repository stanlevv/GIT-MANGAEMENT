import React, { useEffect } from "react";
import { X, Bell, Trash2, CheckCircle2, Info, Megaphone, Clock, Heart, Inbox } from "lucide-react";
import { useApi } from "../../../hooks/useApi";
import { api } from "../../../config/api";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: number;
  type: string;
  title: string;
  body: string;
  read_at: string | null;
  created_at: string;
}

interface NotificationResponse {
  notifications: Notification[];
  unread_count: number;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const { data, loading, refetch } = useApi<NotificationResponse>("/notifications");
  const notifications = data?.notifications ?? [];

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen]);

  const markAllAsRead = async () => {
    try {
      await api.post("/notifications/read-all");
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await api.post(`/notifications/${id}/read`);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await api.delete(`/notifications/${id}`);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "pembayaran_spp": return <Clock size={20} className="text-amber-500" />;
      case "donasi_masuk": return <Heart size={20} className="text-rose-500" />;
      case "kampanye_baru": return <Megaphone size={20} className="text-blue-500" />;
      case "bantuan_disetujui": return <CheckCircle2 size={20} className="text-emerald-500" />;
      case "bantuan_ditolak": return <X size={20} className="text-rose-500" />;
      default: return <Info size={20} className="text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />

      {/* Sheet */}
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-[480px] h-[85vh] sm:h-[600px] bg-white rounded-t-[40px] sm:rounded-[40px] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Handle for mobile */}
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mt-4 mb-2 sm:hidden" />

        {/* Header */}
        <div className="px-8 pt-6 pb-6 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Notifikasi</h2>
            <p className="text-sm font-bold text-slate-400">Kamu punya {data?.unread_count ?? 0} pesan baru</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 no-scrollbar">
          {notifications.length > 0 && (
            <div className="flex justify-end px-2">
              <button 
                onClick={markAllAsRead}
                className="text-xs font-black text-blue-600 uppercase tracking-wider hover:underline"
              >
                Baca Semua
              </button>
            </div>
          )}

          <AnimatePresence mode="popLayout">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="animate-pulse flex gap-4 p-5 rounded-3xl bg-slate-50">
                  <div className="w-12 h-12 rounded-2xl bg-slate-200 flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-slate-200 rounded-lg w-1/3" />
                    <div className="h-3 bg-slate-200 rounded-lg w-full" />
                  </div>
                </div>
              ))
            ) : notifications.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-24 h-24 rounded-[40px] bg-slate-50 flex items-center justify-center mb-6 text-slate-200">
                  <Inbox size={48} />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-1">Inbox Kosong</h3>
                <p className="text-sm font-bold text-slate-400">Tidak ada notifikasi saat ini.</p>
              </motion.div>
            ) : (
              notifications.map((notif, idx) => (
                <motion.div 
                  key={notif.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => !notif.read_at && markAsRead(notif.id)}
                  className={`group relative flex gap-4 p-5 rounded-[32px] transition-all cursor-pointer border ${
                    !notif.read_at ? "bg-blue-50/40 border-blue-100 ring-2 ring-blue-50/50" : "bg-white border-slate-100"
                  } hover:shadow-lg hover:shadow-blue-900/5`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    !notif.read_at ? "bg-white shadow-sm" : "bg-slate-50"
                  }`}>
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className={`text-[15px] font-black truncate ${!notif.read_at ? "text-slate-900" : "text-slate-500"}`}>
                        {notif.title}
                      </p>
                    </div>
                    <p className={`text-xs leading-relaxed mb-2 ${!notif.read_at ? "text-slate-700 font-bold" : "text-slate-400 font-medium"}`}>
                      {notif.body}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: id })}
                      </span>
                    </div>
                  </div>
                  
                  {/* Floating dot for unread */}
                  {!notif.read_at && (
                    <div className="absolute top-6 right-6 w-2.5 h-2.5 rounded-full bg-blue-600 shadow-lg shadow-blue-200" />
                  )}
                  
                  {/* Quick Delete */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.id);
                    }}
                    className="absolute bottom-6 right-6 p-2 rounded-xl bg-slate-100 text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-500 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50/50 border-t border-slate-50 text-center">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">EduFin Notifications V2.0</p>
        </div>
      </motion.div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
