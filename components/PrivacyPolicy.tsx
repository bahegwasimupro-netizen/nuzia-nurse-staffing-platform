import { useNavigate } from "react-router-dom";
import { useLang } from "./language";
import { ArrowLeft, Shield } from "lucide-react";

export function PrivacyPolicy() {
  const { t, lang } = useLang();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#1e3a5f] mb-8 transition">
          <ArrowLeft className="w-4 h-4" /><span>{t("auth.back")}</span>
        </button>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#1e3a5f]/10 rounded-xl flex items-center justify-center"><Shield className="w-5 h-5 text-[#1e3a5f]" /></div>
          <h1 className="text-3xl font-bold">{lang === "sw" ? "Sera za Faragha" : "Privacy Policy"}</h1>
        </div>
        <div className="prose prose-slate max-w-none space-y-6 text-sm leading-relaxed text-slate-600">
          <p className="text-xs text-slate-400">{lang === "sw" ? "Sasisha mwisho: Julai 2026" : "Last updated: July 2026"}</p>
          {lang === "sw" ? (
            <>
              <h2 className="text-lg font-bold text-slate-800">1. Utangulizi</h2>
              <p>NUZIA inathamini faragha yako. Sera hii inaeleza jinsi tunavyokusanya, kutumia, na kulinda taarifa zako binafsi tunapokuhudumia kupitia jukwaa letu la usajili wa wauguzi.</p>
              <h2 className="text-lg font-bold text-slate-800">2. Taarifa Tunazokusanya</h2>
              <p>Tunakusanya taarifa zifuatazo:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Jina kamili, barua pepe, na namba ya simu</li>
                <li>Leseni ya TNMC na taarifa za kitaalamu (kwa wauguzi)</li>
                <li>Eneo la kijiografia (wakati wa kuomba huduma)</li>
                <li>Historia ya malipo na mawasiliano</li>
              </ul>
              <h2 className="text-lg font-bold text-slate-800">3. Jinsi Tunavyotumia Taarifa</h2>
              <p>Tunatumia taarifa zako kwa:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Kuunganisha wauguzi na wateja</li>
                <li>Kutoa huduma na malipo</li>
                <li>Kuboresha ubora wa jukwaa letu</li>
                <li>Kukuarifu kuhusu huduma mpya</li>
              </ul>
              <h2 className="text-lg font-bold text-slate-800">4. Ulinzi wa Taarifa</h2>
              <p>Tunatumia teknolojia ya sasa ya usalama kuhakikisha taarifa zako ziko salama. Hatuzuii taarifa zako na wasambazaji wa tatu bidhaa yako idhini.</p>
              <h2 className="text-lg font-bold text-slate-800">5. Haki Zako</h2>
              <p>Una haki ya kupata, kusahihisha, au kufuta taarifa zako wakati wowote. Wasiliana nasi kupitia support@nuzia.co.tz.</p>
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold text-slate-800">1. Introduction</h2>
              <p>NUZIA values your privacy. This policy describes how we collect, use, and protect your personal information when you use our nurse staffing platform.</p>
              <h2 className="text-lg font-bold text-slate-800">2. Information We Collect</h2>
              <p>We collect the following information:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Full name, email address, and phone number</li>
                <li>TNMC license and professional credentials (for nurses)</li>
                <li>Geographic location (when requesting services)</li>
                <li>Payment history and communications</li>
              </ul>
              <h2 className="text-lg font-bold text-slate-800">3. How We Use Information</h2>
              <p>We use your information to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Match nurses with clients</li>
                <li>Deliver services and process payments</li>
                <li>Improve our platform quality</li>
                <li>Notify you about new services</li>
              </ul>
              <h2 className="text-lg font-bold text-slate-800">4. Data Protection</h2>
              <p>We use current security technology to ensure your data is safe. We do not sell your information to third parties without your consent.</p>
              <h2 className="text-lg font-bold text-slate-800">5. Your Rights</h2>
              <p>You have the right to access, correct, or delete your information at any time. Contact us at support@nuzia.co.tz.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
