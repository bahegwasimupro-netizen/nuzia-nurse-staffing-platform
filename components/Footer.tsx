import { useNavigate } from "react-router-dom";
import { useLang } from "./language";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const { t } = useLang();
  const navigate = useNavigate();

  return (
    <footer className="bg-[#0f1d35] text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#1e3a5f] to-[#2563eb] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">N</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold">NUZIA</span>
                <span className="text-xs text-gray-400">by Tanzanite Life Care</span>
              </div>
            </div>
            <p className="text-gray-300 mb-4">{t("footer.about")}</p>
            <div className="flex gap-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-white transition" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-white transition" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-white transition" />
              <Linkedin className="w-5 h-5 text-gray-400 hover:text-white transition" />
            </div>
          </div>

          {/* For Healthcare Facilities */}
          <div>
            <h4 className="font-semibold mb-4">{t("footer.facilities")}</h4>
            <ul className="space-y-2 text-gray-300">
              <li><button onClick={() => navigate("/")} className="hover:text-white transition text-sm">{t("footer.findNurses")}</button></li>
              <li><button onClick={() => navigate("/pricing")} className="hover:text-white transition text-sm">{t("footer.pricing")}</button></li>
              <li><button onClick={() => navigate("/")} className="hover:text-white transition text-sm">{t("footer.howItWorks")}</button></li>
            </ul>
          </div>

          {/* For Nurses */}
          <div>
            <h4 className="font-semibold mb-4">{t("footer.forNurses")}</h4>
            <ul className="space-y-2 text-gray-300">
              <li><button onClick={() => navigate("/auth")} className="hover:text-white transition text-sm">{t("footer.joinNurse")}</button></li>
              <li><button onClick={() => navigate("/jobs")} className="hover:text-white transition text-sm">{t("footer.findJobs")}</button></li>
              <li><button onClick={() => navigate("/elective")} className="hover:text-white transition text-sm">{t("footer.elective")}</button></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">{t("footer.contact")}</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="text-sm">support@nuzia.co.tz</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+255 123 456 789</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Dar es Salaam, Tanzania</span>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-400 mb-2">Malipo kupitia:</p>
                <div className="flex gap-2">
                  <span className="text-xs bg-emerald-600 px-2 py-1 rounded">M-Pesa</span>
                  <span className="text-xs bg-red-600 px-2 py-1 rounded">Airtel Money</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} NUZIA by Tanzanite Life Care. {t("footer.rights")}
            </p>
            <div className="flex gap-6 text-sm text-gray-400 mt-4 md:mt-0">
              <button onClick={() => navigate("/privacy")} className="hover:text-white transition">{t("footer.privacy")}</button>
              <button onClick={() => navigate("/terms")} className="hover:text-white transition">{t("footer.terms")}</button>
              <button onClick={() => navigate("/compliance")} className="hover:text-white transition">{t("footer.compliance")}</button>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">{t("footer.tnmcNote")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
