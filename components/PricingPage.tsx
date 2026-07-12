import { useNavigate } from "react-router-dom";
import { useLang } from "./language";
import {
  Home, Activity, Heart, Baby, Stethoscope, Brain,
  Check, Star, Shield, Clock, Phone, ArrowRight,
  HelpCircle, ChevronDown, ChevronUp, Zap, Award, Users,
  Plane,
} from "lucide-react";
import { useState } from "react";

const services = [
  {
    icon: Home,
    titleKey: "services.homeCare",
    descKey: "services.homeCareDesc",
    price: 45000,
    color: "bg-emerald-500",
    lightColor: "bg-emerald-100 text-emerald-600",
    features: [
      "pricing.feature.home1",
      "pricing.feature.home2",
      "pricing.feature.home3",
      "pricing.feature.home4",
    ],
    popular: false,
  },
  {
    icon: Stethoscope,
    titleKey: "services.general",
    descKey: "services.generalDesc",
    price: 50000,
    color: "bg-purple-500",
    lightColor: "bg-purple-100 text-purple-600",
    features: [
      "pricing.feature.gen1",
      "pricing.feature.gen2",
      "pricing.feature.gen3",
      "pricing.feature.gen4",
    ],
    popular: false,
  },
  {
    icon: Baby,
    titleKey: "services.child",
    descKey: "services.childDesc",
    price: 55000,
    color: "bg-blue-500",
    lightColor: "bg-blue-100 text-blue-600",
    features: [
      "pricing.feature.pedia1",
      "pricing.feature.pedia2",
      "pricing.feature.pedia3",
      "pricing.feature.pedia4",
    ],
    popular: false,
  },
  {
    icon: Brain,
    titleKey: "services.mental",
    descKey: "services.mentalDesc",
    price: 60000,
    color: "bg-indigo-500",
    lightColor: "bg-indigo-100 text-indigo-600",
    features: [
      "pricing.feature.mental1",
      "pricing.feature.mental2",
      "pricing.feature.mental3",
      "pricing.feature.mental4",
    ],
    popular: false,
  },
  {
    icon: Heart,
    titleKey: "services.heart",
    descKey: "services.heartDesc",
    price: 65000,
    color: "bg-pink-500",
    lightColor: "bg-pink-100 text-pink-600",
    features: [
      "pricing.feature.cardiac1",
      "pricing.feature.cardiac2",
      "pricing.feature.cardiac3",
      "pricing.feature.cardiac4",
    ],
    popular: true,
  },
  {
    icon: Activity,
    titleKey: "services.icu",
    descKey: "services.icuDesc",
    price: 75000,
    color: "bg-red-500",
    lightColor: "bg-red-100 text-red-600",
    features: [
      "pricing.feature.icu1",
      "pricing.feature.icu2",
      "pricing.feature.icu3",
      "pricing.feature.icu4",
    ],
    popular: false,
  },
];

const addOns = [
  { icon: Clock, titleKey: "pricing.addon.overnight", descKey: "pricing.addon.overnightDesc", extra: 15000 },
  { icon: Zap, titleKey: "pricing.addon.emergency", descKey: "pricing.addon.emergencyDesc", extra: 20000 },
  { icon: Users, titleKey: "pricing.addon.team", descKey: "pricing.addon.teamDesc", extra: 10000 },
  { icon: Plane, titleKey: "pricing.addon.travel", descKey: "pricing.addon.travelDesc", extra: 0 },
];

const plans = [
  {
    titleKey: "pricing.plan.payg",
    descKey: "pricing.plan.paygDesc",
    price: null,
    unitKey: "pricing.plan.paygUnit",
    color: "border-slate-200",
    btnColor: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    features: [
      { text: "pricing.plan.paygF1", included: true },
      { text: "pricing.plan.paygF2", included: true },
      { text: "pricing.plan.paygF3", included: false },
      { text: "pricing.plan.paygF4", included: false },
      { text: "pricing.plan.paygF5", included: false },
    ],
  },
  {
    titleKey: "pricing.plan.weekly",
    descKey: "pricing.plan.weeklyDesc",
    price: null,
    unitKey: "pricing.plan.weeklyUnit",
    color: "border-primary",
    btnColor: "bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] text-white hover:shadow-lg",
    discount: "pricing.plan.weeklyDiscount",
    features: [
      { text: "pricing.plan.weeklyF1", included: true },
      { text: "pricing.plan.weeklyF2", included: true },
      { text: "pricing.plan.weeklyF3", included: true },
      { text: "pricing.plan.weeklyF4", included: false },
      { text: "pricing.plan.weeklyF5", included: false },
    ],
    popular: true,
  },
  {
    titleKey: "pricing.plan.monthly",
    descKey: "pricing.plan.monthlyDesc",
    price: null,
    unitKey: "pricing.plan.monthlyUnit",
    color: "border-emerald-500",
    btnColor: "bg-emerald-600 text-white hover:bg-emerald-700",
    discount: "pricing.plan.monthlyDiscount",
    features: [
      { text: "pricing.plan.monthlyF1", included: true },
      { text: "pricing.plan.monthlyF2", included: true },
      { text: "pricing.plan.monthlyF3", included: true },
      { text: "pricing.plan.monthlyF4", included: true },
      { text: "pricing.plan.monthlyF5", included: true },
    ],
  },
];

const faqKeys = [
  "pricing.faq1Q", "pricing.faq1A",
  "pricing.faq2Q", "pricing.faq2A",
  "pricing.faq3Q", "pricing.faq3A",
  "pricing.faq4Q", "pricing.faq4A",
  "pricing.faq5Q", "pricing.faq5A",
  "pricing.faq6Q", "pricing.faq6A",
];

function FAQItem({ questionKey, answerKey, t }: { questionKey: string; answerKey: string; t: (k: string) => string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition">
        <span className="font-semibold text-slate-800">{t(questionKey)}</span>
        {open ? <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t">
          <p className="pt-4">{t(answerKey)}</p>
        </div>
      )}
    </div>
  );
}

export function PricingPage() {
  const { t } = useLang();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0f1d35] via-[#1e3a5f] to-[#1a365d] text-white py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold">{t("pricing.badge")}</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-6">{t("pricing.heroTitle")}</h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">{t("pricing.heroSubtitle")}</p>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-white/60 flex-wrap">
            <div className="flex items-center gap-2"><Shield className="w-4 h-4" /><span>{t("pricing.heroTrust1")}</span></div>
            <div className="flex items-center gap-2"><Award className="w-4 h-4" /><span>{t("pricing.heroTrust2")}</span></div>
            <div className="flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400 fill-current" /><span>{t("pricing.heroTrust3")}</span></div>
          </div>
        </div>
      </section>

      {/* Service Pricing Cards */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">{t("pricing.serviceTitle")}</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">{t("pricing.serviceSubtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div key={service.titleKey} className={`bg-white rounded-2xl border-2 p-6 hover:shadow-xl transition-all relative ${service.popular ? "border-primary shadow-lg" : "border-slate-100"}`}>
                  {service.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full">
                      {t("pricing.mostPopular")}
                    </div>
                  )}
                  <div className={`w-12 h-12 rounded-xl ${service.lightColor} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{t(service.titleKey)}</h3>
                  <p className="text-sm text-slate-500 mb-4">{t(service.descKey)}</p>
                  <div className="mb-4">
                    <span className="text-3xl font-extrabold text-slate-800">TSh {service.price.toLocaleString()}</span>
                    <span className="text-sm text-slate-500">{t("common.perHour")}</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((fk) => (
                      <li key={fk} className="flex items-start gap-2 text-sm text-slate-600">
                        <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        <span>{t(fk)}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => navigate("/auth")}
                    className={`w-full font-bold py-2.5 rounded-xl transition-all ${service.popular ? "bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] text-white hover:shadow-lg" : "border-2 border-primary text-primary hover:bg-primary hover:text-white"}`}
                  >
                    {t("pricing.bookNow")}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">{t("pricing.addonTitle")}</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">{t("pricing.addonSubtitle")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {addOns.map((addon) => {
              const Icon = addon.icon;
              return (
                <div key={addon.titleKey} className="bg-slate-50 rounded-2xl border p-6 text-center hover:shadow-lg transition-all">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold mb-1">{t(addon.titleKey)}</h3>
                  <p className="text-sm text-slate-500 mb-3">{t(addon.descKey)}</p>
                  <p className="font-bold text-lg text-emerald-600">
                    {addon.extra > 0 ? `+TSh ${addon.extra.toLocaleString()}${t("common.perHour")}` : t("pricing.addonFree")}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Booking Plans */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">{t("pricing.planTitle")}</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">{t("pricing.planSubtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div key={plan.titleKey} className={`bg-white rounded-2xl border-2 p-8 relative ${plan.color} ${plan.popular ? "shadow-xl scale-105" : ""}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full">
                    {t("pricing.bestValue")}
                  </div>
                )}
                <h3 className="font-bold text-xl mb-2">{t(plan.titleKey)}</h3>
                <p className="text-sm text-slate-500 mb-6">{t(plan.descKey)}</p>
                {plan.discount && (
                  <div className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full mb-4">
                    {t(plan.discount)}
                  </div>
                )}
                <p className="text-sm text-slate-400 mb-6">{t(plan.unitKey)}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-2 text-sm">
                      {f.included ? (
                        <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border-2 border-slate-200 mt-0.5 shrink-0"></span>
                      )}
                      <span className={f.included ? "text-slate-700" : "text-slate-400"}>{t(f.text)}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate("/auth")}
                  className={`w-full font-bold py-3 rounded-xl transition-all ${plan.btnColor}`}
                >
                  {t("pricing.getStarted")}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Pricing Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">{t("pricing.howTitle")}</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">{t("pricing.howSubtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { step: "1", titleKey: "pricing.howStep1", descKey: "pricing.howStep1Desc" },
              { step: "2", titleKey: "pricing.howStep2", descKey: "pricing.howStep2Desc" },
              { step: "3", titleKey: "pricing.howStep3", descKey: "pricing.howStep3Desc" },
              { step: "4", titleKey: "pricing.howStep4", descKey: "pricing.howStep4Desc" },
            ].map((s, i) => (
              <div key={i} className="text-center relative">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">{s.step}</div>
                <h3 className="font-bold mb-2">{t(s.titleKey)}</h3>
                <p className="text-sm text-slate-500">{t(s.descKey)}</p>
                {i < 3 && <div className="hidden md:block absolute top-6 left-[60%] w-[80%] border-t-2 border-dashed border-slate-200"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-6">{t("pricing.payTitle")}</h3>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-xl border">
              <Phone className="w-5 h-5 text-emerald-600" />
              <span className="font-semibold">M-Pesa</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-xl border">
              <Phone className="w-5 h-5 text-red-500" />
              <span className="font-semibold">Airtel Money</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-xl border">
              <span className="font-semibold">💳 Visa / Mastercard</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-xl border">
              <span className="font-semibold">🏦 Bank Transfer</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">{t("pricing.faqTitle")}</h2>
            <p className="text-lg text-slate-500">{t("pricing.faqSubtitle")}</p>
          </div>
          <div className="space-y-3">
            {Array.from({ length: 6 }, (_, i) => (
              <FAQItem key={i} questionKey={faqKeys[i * 2]} answerKey={faqKeys[i * 2 + 1]} t={t} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-[#0f1d35] via-[#1e3a5f] to-[#1a365d] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">{t("pricing.ctaTitle")}</h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">{t("pricing.ctaSubtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate("/auth")} className="bg-white text-[#1e3a5f] px-8 py-3 rounded-xl font-bold hover:bg-white/90 transition flex items-center justify-center gap-2">
              {t("pricing.ctaBtn1")} <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => navigate("/")} className="border border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition flex items-center justify-center gap-2">
              <HelpCircle className="w-4 h-4" /> {t("pricing.ctaBtn2")}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
