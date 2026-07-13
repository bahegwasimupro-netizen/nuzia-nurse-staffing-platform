import { useNavigate } from "react-router-dom";
import { useLang } from "./language";
import { Search, Star, Users, Clock } from "lucide-react";

export function Hero() {
  const { t, lang } = useLang();
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-br from-[#0f1d35] via-[#1e3a5f] to-[#1a365d] text-white py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold">{t("hero.badge")}</span>
          </div>

          <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
            <div className="flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-sm font-bold text-emerald-300">150+</span>
              <span className="text-xs text-white/70">{lang === "sw" ? "Wauguzi Walioidhinishwa" : "Verified Nurses"}</span>
            </div>
            <div className="flex items-center gap-2 bg-amber-500/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span className="text-sm font-bold text-amber-300">4.9</span>
              <span className="text-xs text-white/70">{lang === "sw" ? "Ukadiriaji" : "Rating"}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-xs text-white/70">{lang === "sw" ? "📍 Dar es Salaam" : "📍 Dar es Salaam"}</span>
            </div>
          </div>
          <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6">
            {t("hero.title1")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">{t("hero.title2")}</span>{" "}
            {t("hero.title3")}
          </h1>
          <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t("hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-10">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                placeholder={t("hero.searchPlaceholder")}
                className="pl-12 pr-4 py-3.5 w-full rounded-xl text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50"
                onClick={() => navigate("/auth")}
                readOnly
              />
            </div>
            <button
              onClick={() => navigate("/auth")}
              className="bg-white text-[#1e3a5f] font-bold px-8 py-3.5 rounded-xl hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              {t("hero.searchBtn")}
            </button>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-white/60 flex-wrap font-semibold mb-8">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>{t("hero.rating")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{t("hero.service")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{t("hero.avail")}</span>
            </div>
          </div>

          <div className="inline-block p-4 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl">
            <p className="text-xs text-white/50 font-bold uppercase tracking-wider mb-2">{t("hero.payLabel")}</p>
            <div className="flex items-center justify-center gap-3 text-xs font-bold">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-md">M-Pesa</span>
              <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-md">Airtel Money</span>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-md">Kadi za Benki</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
