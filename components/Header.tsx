import { useNavigate } from "react-router-dom";
import { useLang } from "./language";
import { LanguageToggle } from "./LanguageToggle";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-9 h-9 bg-gradient-to-br from-[#1e3a5f] to-[#2563eb] rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-extrabold text-lg">N</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-wide text-[#1e3a5f]">NUZIA</span>
              <span className="text-[10px] text-slate-400 font-semibold leading-none">by Tanzanite Life Care</span>
            </div>
          </div>

          <div className="hidden lg:flex relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              placeholder={t("nav.search")}
              className="pl-10 pr-4 py-2 w-full border rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-5">
          <button onClick={() => navigate("/jobs")} className="text-sm font-semibold text-slate-600 hover:text-[#1e3a5f] transition">{t("nav.jobs")}</button>
          <button onClick={() => navigate("/elective")} className="text-sm font-semibold text-slate-600 hover:text-[#1e3a5f] transition">{t("nav.elective")}</button>
          <button onClick={() => navigate("/pricing")} className="text-sm font-semibold text-slate-600 hover:text-[#1e3a5f] transition">{t("nav.pricing")}</button>
          <LanguageToggle />
          <button onClick={() => navigate("/auth")} className="text-sm font-semibold text-slate-600 hover:text-[#1e3a5f] transition">{t("nav.login")}</button>
          <button onClick={() => navigate("/auth")} className="bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] text-white font-bold text-sm px-5 py-2 rounded-xl hover:shadow-lg transition-all">{t("nav.signup")}</button>
        </nav>

        <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t bg-white px-4 py-4 space-y-3">
          <button onClick={() => { navigate("/jobs"); setMobileOpen(false); }} className="block w-full text-left text-sm font-semibold py-2">{t("nav.jobs")}</button>
          <button onClick={() => { navigate("/elective"); setMobileOpen(false); }} className="block w-full text-left text-sm font-semibold py-2">{t("nav.elective")}</button>
          <button onClick={() => { navigate("/pricing"); setMobileOpen(false); }} className="block w-full text-left text-sm font-semibold py-2">{t("nav.pricing")}</button>
          <div className="flex gap-2 py-2">
            <LanguageToggle />
          </div>
          <button onClick={() => { navigate("/auth"); setMobileOpen(false); }} className="block w-full text-center bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] text-white font-bold text-sm px-5 py-2.5 rounded-xl">{t("nav.login")} / {t("nav.signup")}</button>
        </div>
      )}
    </header>
  );
}
