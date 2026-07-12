import { useNavigate } from "react-router-dom";
import { useLang } from "./language";
import { ArrowLeft, Award } from "lucide-react";

export function TNMCCompliance() {
  const { t, lang } = useLang();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#1e3a5f] mb-8 transition">
          <ArrowLeft className="w-4 h-4" /><span>{t("auth.back")}</span>
        </button>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center"><Award className="w-5 h-5 text-emerald-600" /></div>
          <h1 className="text-3xl font-bold">{lang === "sw" ? "Uzingatiaji wa TNMC" : "TNMC Compliance"}</h1>
        </div>
        <div className="prose prose-slate max-w-none space-y-6 text-sm leading-relaxed text-slate-600">
          <p className="text-xs text-slate-400">{lang === "sw" ? "Sasisha mwisho: Julai 2026" : "Last updated: July 2026"}</p>
          {lang === "sw" ? (
            <>
              <h2 className="text-lg font-bold text-slate-800">1. Kuhusu TNMC</h2>
              <p>Tanzania Nurses and Midwifery Council (TNMC) ndio shirika linalodhibiti uuguzi nchini Tanzania. Linaidhinisha na kusajili wauguzi wote wanaofanya kazi Tanzania.</p>
              <h2 className="text-lg font-bold text-slate-800">2. Mpango wetu wa Uzingatiaji</h2>
              <p>NUZIA inahakikisha kuwa:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Wauguzi wote waliosajiliwa kwenye jukwaa wanamiliki leseni ya TNMC ya sasa</li>
                <li>Kila muuguzi ana namba ya usajili ya TNMC inayoweza kuthibitishwa</li>
                <li>Msimamizi anaangalia leseni kabla ya kumpatia muuguzi kazi</li>
                <li>Taarifa za leseni zinahifadhiwa salama kwenye mfumo wetu</li>
              </ul>
              <h2 className="text-lg font-bold text-slate-800">3. Uthibitishaji wa Leseni</h2>
              <p>Kabla ya kumpatia muuguzi kazi yoyote, msimamizi anapaswa:</p>
              <ol className="list-decimal pl-6 space-y-1">
                <li>Kuangalia namba ya TNMC ya muuguzi</li>
                <li>Kupiga simu TNMC au kutumia mtandao wao kuthibitisha</li>
                <li>Kuhakikisha leseni bado ni halali na haijaisha muda</li>
                <li>Kuweka kumbukumbu ya uthibitishaji</li>
              </ol>
              <h2 className="text-lg font-bold text-slate-800">4. Wajibu wa Muuguzi</h2>
              <p>Kila muuguzi anapaswa:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Kuwa na leseni ya TNMC ya sasa</li>
                <li>Kusasisha leseni yake kabla ya kuisha muda</li>
                <li>Kutoa namba yake ya TNMC wakati wa usajili</li>
                <li>Kuzingatia kanuni za kimaadili za TNMC</li>
              </ul>
              <h2 className="text-lg font-bold text-slate-800">5. Wasiliana Nasi</h2>
              <p>Kwa maswali kuhusu uzingatiaji, wasiliana nasi: compliance@nuzia.co.tz</p>
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold text-slate-800">1. About TNMC</h2>
              <p>The Tanzania Nurses and Midwifery Council (TNMC) is the regulatory body for nursing in Tanzania. It certifies and registers all nurses practicing in the country.</p>
              <h2 className="text-lg font-bold text-slate-800">2. Our Compliance Program</h2>
              <p>NUZIA ensures that:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>All nurses registered on the platform hold a current TNMC license</li>
                <li>Each nurse has a verifiable TNMC registration number</li>
                <li>The admin verifies licenses before assigning work to nurses</li>
                <li>License information is securely stored in our system</li>
              </ul>
              <h2 className="text-lg font-bold text-slate-800">3. License Verification</h2>
              <p>Before assigning any work to a nurse, the administrator must:</p>
              <ol className="list-decimal pl-6 space-y-1">
                <li>Check the nurse's TNMC number</li>
                <li>Call TNMC or use their online portal to verify</li>
                <li>Confirm the license is current and not expired</li>
                <li>Maintain a record of the verification</li>
              </ol>
              <h2 className="text-lg font-bold text-slate-800">4. Nurse Responsibilities</h2>
              <p>Every nurse must:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Maintain a current TNMC license</li>
                <li>Renew their license before expiration</li>
                <li>Provide their TNMC number during registration</li>
                <li>Adhere to TNMC code of ethics</li>
              </ul>
              <h2 className="text-lg font-bold text-slate-800">5. Contact Us</h2>
              <p>For compliance questions, contact us at: compliance@nuzia.co.tz</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
