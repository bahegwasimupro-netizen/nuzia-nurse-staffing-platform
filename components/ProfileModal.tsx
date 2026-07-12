import { useState } from "react";
import { useAuth, UserProfile } from "./auth";
import { useLang } from "./language";
import { X, User, Save } from "lucide-react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { userProfile, updateProfile } = useAuth();
  const { t, lang } = useLang();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(userProfile?.name || "");
  const [phone, setPhone] = useState(userProfile?.phone || "");
  const [location, setLocation] = useState(userProfile?.location || "");
  const [specialty, setSpecialty] = useState(userProfile?.specialty || "");
  const [experience, setExperience] = useState(userProfile?.experience || "");
  const [hourlyRate, setHourlyRate] = useState(String(userProfile?.hourlyRate || ""));

  if (!isOpen || !userProfile) return null;

  const isNurse = userProfile.role === "nurse";

  const handleSave = async () => {
    setLoading(true);
    const data: Partial<UserProfile> = { name, phone, location };
    if (isNurse) {
      data.specialty = specialty;
      data.experience = experience;
      data.hourlyRate = Number(hourlyRate) || 0;
    }
    await updateProfile(data);
    setLoading(false);
    onClose();
  };

  const label = (key: string) => lang === "sw" ? key : key;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1e3a5f]/10 rounded-xl flex items-center justify-center"><User className="w-5 h-5 text-[#1e3a5f]" /></div>
              <h2 className="text-xl font-bold">{lang === "sw" ? "Hariri Wasifu" : "Edit Profile"}</h2>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl font-semibold">&times;</button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">{lang === "sw" ? "Jina Kamili" : "Full Name"}</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] bg-slate-50" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">{t("auth.phone")}</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] bg-slate-50" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">{lang === "sw" ? "Eneo" : "Location"}</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] bg-slate-50" />
            </div>

            {isNurse && (
              <>
                <div>
                  <label className="block text-sm font-semibold mb-1">{t("auth.specialty")}</label>
                  <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] bg-slate-50">
                    <option value="Huduma za Nyumbani">{t("services.homeCare")}</option>
                    <option value="ICU Specialist">{t("services.icu")}</option>
                    <option value="Huduma za Moyo">{t("services.heart")}</option>
                    <option value="Huduma za Watoto">{t("services.child")}</option>
                    <option value="Huduma za Jumla">{t("services.general")}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">{lang === "sw" ? "Uzoefu (Miaka)" : "Experience (Years)"}</label>
                  <input type="text" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="e.g. Miaka 5" className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] bg-slate-50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">{lang === "sw" ? "Kiwango kwa Saa (TSh)" : "Hourly Rate (TSh)"}</label>
                  <input type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] bg-slate-50" />
                </div>
              </>
            )}
          </div>

          <div className="flex gap-4 mt-6">
            <button onClick={onClose} className="w-1/2 bg-slate-100 hover:bg-slate-200 font-bold py-3 px-4 rounded-xl transition">{lang === "sw" ? "Ghairi" : "Cancel"}</button>
            <button onClick={handleSave} disabled={loading} className="w-1/2 bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /><span>{loading ? "..." : lang === "sw" ? "Hifadhi" : "Save"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
