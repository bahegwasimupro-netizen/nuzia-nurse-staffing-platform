import { useNavigate, useLocation } from "react-router-dom";
import { useLang } from "./language";
import { Home, Briefcase, MessageCircle, Settings, Bell } from "lucide-react";

interface BottomNavProps {
  role: "client" | "nurse" | "admin";
}

export function BottomNav({ role }: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLang();
  const current = location.pathname;

  const items = {
    client: [
      { icon: Home, label: lang === "sw" ? "Nyumbani" : "Home", path: "/portal/client" },
      { icon: Briefcase, label: lang === "sw" ? "Kazi" : "Jobs", path: "/portal/client" },
      { icon: MessageCircle, label: lang === "sw" ? "Ujumbe" : "Chat", path: "/portal/client" },
      { icon: Settings, label: lang === "sw" ? "Mipangilio" : "Settings", path: "/portal/client" },
    ],
    nurse: [
      { icon: Home, label: lang === "sw" ? "Nyumbani" : "Home", path: "/portal/nurse" },
      { icon: Briefcase, label: lang === "sw" ? "Kazi" : "Jobs", path: "/portal/nurse" },
      { icon: MessageCircle, label: lang === "sw" ? "Ujumbe" : "Chat", path: "/portal/nurse" },
      { icon: Settings, label: lang === "sw" ? "Mipangilio" : "Settings", path: "/portal/nurse" },
    ],
    admin: [
      { icon: Home, label: lang === "sw" ? "Nyumbani" : "Home", path: "/portal/admin" },
      { icon: Briefcase, label: lang === "sw" ? "Kazi" : "Jobs", path: "/portal/admin" },
      { icon: Bell, label: lang === "sw" ? "Arifa" : "Alerts", path: "/portal/admin" },
      { icon: Settings, label: lang === "sw" ? "Mipangilio" : "Settings", path: "/portal/admin" },
    ],
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40 md:hidden">
      <div className="flex items-center justify-around py-2 px-1">
        {items[role].map((item, i) => {
          const Icon = item.icon;
          const isActive = current === item.path;
          return (
            <button
              key={i}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-0.5 min-w-[60px] py-1.5 px-2 rounded-xl transition active:bg-slate-100"
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-[#1e3a5f]" : "text-slate-400"}`} />
              <span className={`text-[10px] font-medium ${isActive ? "text-[#1e3a5f]" : "text-slate-400"}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
