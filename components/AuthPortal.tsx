import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth";
import { KeyRound, Mail, User, Phone, Stethoscope, ArrowRight, ArrowLeft } from "lucide-react";

export function AuthPortal({ onClose }: { onClose: () => void }) {
  const { signIn, signUp, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<"client" | "nurse">("client");
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState("Huduma za Jumla");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Tafadhali jaza barua pepe na neno la siri!");
      return;
    }

    try {
      if (isLogin) {
        const profile = await signIn(email, password);
        if (profile.role === "admin") navigate("/portal/admin");
        else if (profile.role === "nurse") navigate("/portal/nurse");
        else navigate("/portal/client");
      } else {
        if (!name) {
          setErrorMsg("Tafadhali jaza jina lako kamili!");
          return;
        }
        const profile = await signUp(email, password, name, role, phone, role === "nurse" ? specialty : undefined);
        if (profile.role === "admin") navigate("/portal/admin");
        else if (profile.role === "nurse") navigate("/portal/nurse");
        else navigate("/portal/client");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Hitilafu imetokea. Tafadhali jaribu tena.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4">
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-[#1e3a5f] text-sm font-semibold transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Rudi Nyumbani</span>
      </button>

      <div className="w-full max-w-md bg-white rounded-2xl border shadow-xl p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1e3a5f] to-[#2563eb]"></div>

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-[#1e3a5f] to-[#2563eb] rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
            <span className="text-white font-bold text-xl">N</span>
          </div>
          <h2 className="text-2xl font-bold">
            {isLogin ? "Karibu Tena Nuzia" : "Jiunge na Nuzia leo"}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {isLogin ? "Ingia kuendelea na huduma" : "Tengeneza akaunti yako sasa"}
          </p>
        </div>

        <div className="flex rounded-lg bg-slate-100 p-1 mb-6">
          <button
            onClick={() => { setIsLogin(true); setErrorMsg(""); }}
            className={`w-1/2 rounded-md py-1.5 text-sm font-semibold transition-all ${isLogin ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
          >
            Ingia (Sign In)
          </button>
          <button
            onClick={() => { setIsLogin(false); setErrorMsg(""); }}
            className={`w-1/2 rounded-md py-1.5 text-sm font-semibold transition-all ${!isLogin ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
          >
            Sajili (Sign Up)
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xl text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Aina ya Akaunti</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setRole("client")} className={`py-2.5 px-4 border rounded-xl text-sm font-bold text-center transition-all ${role === "client" ? "border-[#1e3a5f] bg-[#1e3a5f]/5 text-[#1e3a5f]" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                  Mteja (Client)
                </button>
                <button type="button" onClick={() => setRole("nurse")} className={`py-2.5 px-4 border rounded-xl text-sm font-bold text-center transition-all ${role === "nurse" ? "border-[#2563eb] bg-[#2563eb]/5 text-[#2563eb]" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                  Muuguzi (Nurse)
                </button>
              </div>
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Jina Kamili</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
                <input type="text" required placeholder="e.g. Fatuma Ally" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-10 pr-4 py-3 border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] transition text-sm" />
              </div>
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Namba ya Simu</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
                <input type="tel" required placeholder="e.g. +255 754 000 000" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-10 pr-4 py-3 border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] transition text-sm" />
              </div>
            </div>
          )}

          {!isLogin && role === "nurse" && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Utaalamu wako</label>
              <div className="relative">
                <Stethoscope className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
                <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="w-full pl-10 pr-4 py-3 border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] transition text-sm">
                  <option>Huduma za Nyumbani</option>
                  <option>ICU Specialist</option>
                  <option>Huduma za Moyo</option>
                  <option>Huduma za Watoto</option>
                  <option>Huduma za Jumla</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Barua Pepe (Email)</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
              <input type="email" required placeholder="Ally@nuzia.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] transition text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 font-semibold">Neno la Siri (Password)</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
              <input type="password" required placeholder="******" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] transition text-sm" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] hover:from-[#162d4a] hover:to-[#1d4ed8] text-white font-bold py-3.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2 mt-6 active:scale-98">
            <span>{loading ? "Tafadhali subiri..." : isLogin ? "Ingia Sasa" : "Kamilisha Usajili"}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {isLogin && (
          <div className="mt-6 border-t pt-4 text-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block mb-2">Akaunti za Kujaribu (Demo Logins)</span>
            <div className="flex flex-col gap-1 text-slate-500 font-mono text-[11px]">
              <p>Msimamizi: <span className="text-slate-800 font-bold">admin@nuzia.com</span> (Neno lolote)</p>
              <p>Muuguzi: <span className="text-slate-800 font-bold">fatuma@nuzia.com</span> (Neno lolote)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
