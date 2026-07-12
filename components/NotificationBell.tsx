import { useState, useRef, useEffect } from "react";
import { Bell, Check, Trash2, Briefcase, Award, AlertCircle, Info } from "lucide-react";
import { useNotifications, AppNotification } from "./notifications";
import { useLang } from "./language";

const iconMap: Record<string, React.ReactNode> = {
  job_assigned: <Briefcase className="w-4 h-4 text-blue-500" />,
  new_job: <Briefcase className="w-4 h-4 text-emerald-500" />,
  job_completed: <Check className="w-4 h-4 text-emerald-500" />,
  verification_approved: <Award className="w-4 h-4 text-emerald-500" />,
  verification_rejected: <AlertCircle className="w-4 h-4 text-red-500" />,
  info: <Info className="w-4 h-4 text-slate-400" />,
};

function timeAgo(dateStr: string, lang: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return lang === "sw" ? "Sasa hivi" : "Just now";
  if (mins < 60) return `${mins}${lang === "sw" ? "dk" : "m"}`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}${lang === "sw" ? "sr" : "h"}`;
  const days = Math.floor(hrs / 24);
  return `${days}${lang === "sw" ? "siku" : "d"}`;
}

export function NotificationBell() {
  const { notifications, unreadCount, markRead, markAllRead, clearAll } = useNotifications();
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="relative p-2 hover:bg-white/10 rounded-xl transition">
        <Bell className="w-5 h-5 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border z-50 overflow-hidden">
          <div className="p-3 border-b flex items-center justify-between bg-slate-50">
            <h3 className="font-bold text-sm">{lang === "sw" ? "Arifa" : "Notifications"}</h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-[10px] text-[#1e3a5f] font-semibold hover:underline">
                  {lang === "sw" ? "Wote imesomwa" : "Mark all read"}
                </button>
              )}
              {notifications.length > 0 && (
                <button onClick={clearAll} className="text-[10px] text-red-500 font-semibold hover:underline">
                  {lang === "sw" ? "Futa" : "Clear"}
                </button>
              )}
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-400">
                {lang === "sw" ? "Hakuna arifa bado" : "No notifications yet"}
              </div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} onClick={() => markRead(n.id)} className={`flex items-start gap-3 p-3 cursor-pointer hover:bg-slate-50 transition border-b last:border-b-0 ${!n.read ? "bg-[#1e3a5f]/[0.03]" : ""}`}>
                  <div className="mt-0.5">{iconMap[n.type] || iconMap.info}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs ${!n.read ? "font-bold" : "font-medium"}`}>{n.title}</p>
                    <p className="text-[11px] text-slate-500 truncate">{n.body}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{timeAgo(n.createdAt, lang)}</p>
                  </div>
                  {!n.read && <div className="w-2 h-2 bg-[#1e3a5f] rounded-full mt-1.5 shrink-0" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
