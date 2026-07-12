import { useNavigate } from "react-router-dom";
import { useLang } from "./language";
import { ArrowLeft, FileText } from "lucide-react";

export function TermsOfService() {
  const { t, lang } = useLang();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#1e3a5f] mb-8 transition">
          <ArrowLeft className="w-4 h-4" /><span>{t("auth.back")}</span>
        </button>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#1e3a5f]/10 rounded-xl flex items-center justify-center"><FileText className="w-5 h-5 text-[#1e3a5f]" /></div>
          <h1 className="text-3xl font-bold">{lang === "sw" ? "Masharti ya Huduma" : "Terms of Service"}</h1>
        </div>
        <div className="prose prose-slate max-w-none space-y-6 text-sm leading-relaxed text-slate-600">
          <p className="text-xs text-slate-400">{lang === "sw" ? "Sasisha mwisho: Julai 2026" : "Last updated: July 2026"}</p>
          {lang === "sw" ? (
            <>
              <h2 className="text-lg font-bold text-slate-800">1. Mapokezi</h2>
              <p>Kwa kutumia NUZIA, unakubali masharti haya. Ikiwa hukubaliani, tafadhali usitumie jukwaa letu.</p>
              <h2 className="text-lg font-bold text-slate-800">2. Huduma Zetu</h2>
              <p>NUZIA inatoa jukwaa la kuunganisha wauguzi waliothibitishwa na TNMC na wateja. Sisi si waajiri wa wauguzi na hatutoi huduma za moja kwa moja za afya.</p>
              <h2 className="text-lg font-bold text-slate-800">3. Majukumu ya Mtumiaji</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Kutoa taarifa sahihi na kamili wakati wa usajili</li>
                <li>Kuheshimu sheria na kanuni za TNMC</li>
                <li>Kulipa huduma kwa wakati kama ilivyokubaliwa</li>
                <li>Kutumia jukwaa kwa madhumuni halali tu</li>
              </ul>
              <h2 className="text-lg font-bold text-slate-800">4. Malipo</h2>
              <p>Malipo hulipwa kupitia njia tulizozingatia (M-Pesa, Airtel Money, au kadi). Bei zinaonyeshwa wazi kabla ya uthibitisho wa ombi.</p>
              <h2 className="text-lg font-bold text-slate-800">5. Kufuta na Refund</h2>
              <p>Kufuta zaidi ya masaa 24 kabla ya huduma ni bure. Kufuta ndani ya masaa 24 kuna ada ya 20% ya thamani ya huduma.</p>
              <h2 className="text-lg font-bold text-slate-800">6. Usalama</h2>
              <p>Wauguzi wote husajiliwa na namba zao za TNMC. NUZIA haibalihi usalama wa huduma za afya zinazotolewa na wauguzi waliosajiliwa.</p>
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold text-slate-800">1. Acceptance</h2>
              <p>By using NUZIA, you agree to these terms. If you do not agree, please do not use our platform.</p>
              <h2 className="text-lg font-bold text-slate-800">2. Our Services</h2>
              <p>NUZIA provides a platform connecting TNMC-certified nurses with clients. We are not employers of nurses and do not provide direct healthcare services.</p>
              <h2 className="text-lg font-bold text-slate-800">3. User Responsibilities</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide accurate and complete information during registration</li>
                <li>Comply with TNMC laws and regulations</li>
                <li>Pay for services as agreed</li>
                <li>Use the platform for lawful purposes only</li>
              </ul>
              <h2 className="text-lg font-bold text-slate-800">4. Payments</h2>
              <p>Payments are made through our approved channels (M-Pesa, Airtel Money, or card). Prices are clearly displayed before request confirmation.</p>
              <h2 className="text-lg font-bold text-slate-800">5. Cancellation & Refunds</h2>
              <p>Cancellation more than 24 hours before service is free. Cancellations within 24 hours incur a 20% fee of the service value.</p>
              <h2 className="text-lg font-bold text-slate-800">6. Liability</h2>
              <p>All nurses are registered with TNMC numbers. NUZIA does not guarantee the healthcare services provided by registered nurses.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
