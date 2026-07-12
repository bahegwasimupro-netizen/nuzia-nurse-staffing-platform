import { useNavigate } from "react-router-dom";
import { useLang } from "./language";
import { Users, Award, Clock, Shield, Building, Heart } from "lucide-react";

export function TrustSection() {
  const { t } = useLang();
  const navigate = useNavigate();

  const stats = [
    { icon: Users, title: t("trust.tnmc"), desc: t("trust.tnmcDesc") },
    { icon: Award, title: t("trust.service"), desc: t("trust.serviceDesc") },
    { icon: Clock, title: t("trust.support"), desc: t("trust.supportDesc") },
    { icon: Shield, title: t("trust.verified"), desc: t("trust.verifiedDesc") },
  ];

  const partners = [
    "Wizara ya Afya", "TNMC", "Muhimbili Hospital",
    "Aga Khan Hospital", "WHO Tanzania", "Jakaya Kikwete Hospital"
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl mb-4">{t("trust.title")}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("trust.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-8 h-8 text-primary" />
                </div>
                <div className="font-bold text-lg mb-2">{stat.title}</div>
                <p className="text-sm text-muted-foreground">{stat.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Partners Section */}
        <div className="mb-16">
          <h3 className="text-2xl text-center mb-3">{t("trust.partnersTitle")}</h3>
          <p className="text-center text-muted-foreground mb-8 max-w-xl mx-auto">{t("trust.partnersSub")}</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {partners.map((partner, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mb-2">
                  <Building className="w-8 h-8 text-slate-500" />
                </div>
                <span className="text-sm font-medium text-gray-600">{partner}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-[#0f1d35] via-[#1e3a5f] to-[#1a365d] rounded-2xl p-8 text-white text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-6 h-6" />
            <h3 className="text-2xl lg:text-3xl">{t("trust.ctaTitle")}</h3>
          </div>
          <p className="text-lg mb-6 opacity-90">
            {t("trust.ctaSub")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate("/auth")} className="bg-white text-[#1e3a5f] px-8 py-3 rounded-xl font-bold hover:bg-white/90 transition">
              {t("trust.cta1")}
            </button>
            <button onClick={() => navigate("/auth")} className="border border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition">
              {t("trust.cta2")}
            </button>
          </div>
          <div className="mt-6 flex justify-center items-center gap-4 text-sm opacity-75">
            <span>{t("hero.payLabel")}</span>
            <span className="bg-white/20 px-3 py-1 rounded">M-Pesa</span>
            <span className="bg-white/20 px-3 py-1 rounded">Airtel Money</span>
            <span className="bg-white/20 px-3 py-1 rounded">Kadi za Benki</span>
          </div>
        </div>
      </div>
    </section>
  );
}
