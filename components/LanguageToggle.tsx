import { Globe } from "lucide-react";
import { useLang } from "./language";

export function LanguageToggle() {
  const { lang, toggle } = useLang();

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-primary hover:bg-primary/5 text-sm font-semibold transition-all"
      title={lang === "sw" ? "Switch to English" : "Badilisha kuwa Kiswahili"}
    >
      <Globe className="w-4 h-4" />
      <span>{lang === "sw" ? "EN" : "SW"}</span>
    </button>
  );
}
