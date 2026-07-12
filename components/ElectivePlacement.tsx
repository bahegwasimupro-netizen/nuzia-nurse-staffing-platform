import { useLang } from "./language";
import { MapPin, Plane, GraduationCap, ArrowRight, CheckCircle, FileText, Users, Globe } from "lucide-react";

const localPlacements = [
  {
    institution: "Hospitali ya Taifa Muhimbili",
    location: "Dar es Salaam",
    specialty: "General Surgery & ICU",
    duration: "Miezi 3-6",
    description: "Fursa ya kujifunza upasuaji na utunzaji wa wagonjwa wa hatari katika hospitali kubwa zaidi nchini.",
    descriptionEn: "Learn surgery and critical patient care at Tanzania's largest hospital.",
    spots: 10,
    deadline: "Agosti 30, 2025",
  },
  {
    institution: "Hospitali ya Aga Khan",
    location: "Dar es Salaam",
    specialty: "Maternity & Pediatrics",
    duration: "Miezi 2-4",
    description: "Uzoefu wa huduma za uzazi na watoto katika hospitali ya kibinafsi ya kiwango cha kimataifa.",
    descriptionEn: "Gain maternity and pediatric experience at an international-standard private hospital.",
    spots: 8,
    deadline: "Septemba 15, 2025",
  },
  {
    institution: "Hospitali ya Jakaya Kikwete",
    location: "Dodoma",
    specialty: "Internal Medicine",
    duration: "Miezi 3",
    description: "Jifunze utunzaji wa wagonjwa wa ndani katika hospitali mpya ya kitaifa.",
    descriptionEn: "Learn internal patient care at Tanzania's newest national hospital.",
    spots: 12,
    deadline: "Oktoba 1, 2025",
  },
];

const internationalPlacements = [
  {
    country: "United Kingdom",
    flag: "🇬🇧",
    institutions: "NHS Trust Hospitals",
    specialty: "ICU, Emergency, General Ward",
    duration: "Miezi 6-12",
    salary: "GBP 2,200-2,800/mwezi",
    description: "Fursa ya kufanya kazi katika hospitali za NHS nchini Uingereza. Pata uzoefu wa kimataifa na mshahara mzuri.",
    descriptionEn: "Work in NHS hospitals in the UK. Gain international experience with competitive salary.",
    requirements: ["Leseni ya TNMC", "IELTS 6.5+", "Miaka 3+ ya uzoefu", "Criminal Record Check"],
  },
  {
    country: "United States",
    flag: "🇺🇸",
    institutions: "VA Hospitals & Private Hospitals",
    specialty: "Various Specialties",
    duration: "Miezi 12+",
    salary: "USD 4,000-6,000/mwezi",
    description: "Fursa ya kufanya kazi nchini Marekani kupitia programu ya NCLEX. Mshahara mkubwa na fursa za kukua.",
    descriptionEn: "Work in the US through NCLEX program. High salary and growth opportunities.",
    requirements: ["NCLEX-RN Certification", "IELTS 6.5+", "Miaka 2+ ya uzoefu", "Visa Processing"],
  },
  {
    country: "Germany",
    flag: "🇩🇪",
    institutions: "University Hospitals",
    specialty: "Geriatric & General Care",
    duration: "Miezi 12-24",
    salary: "EUR 2,500-3,200/mwezi",
    description: "Fursa ya kufanya kazi nchini Ujerumani. Utapata mafunzo ya lugha ya Ujerumani kabla ya kuanza.",
    descriptionEn: "Work in Germany. Free German language training before starting.",
    requirements: ["B1 German Certificate", "Leseni ya TNMC", "Miaka 2+ ya uzoefu"],
  },
  {
    country: "Saudi Arabia",
    flag: "🇸🇦",
    institutions: "Saudi German Hospital Group",
    specialty: "ICU, ER, Operating Theatre",
    duration: "Miezi 24",
    salary: "SAR 5,000-8,000/mwezi",
    description: "Fursa ya kufanya kazi katika hospitali za kibinafsi zilizo bora nchini Saudi Arabia. Bila kodi na usafiri.",
    descriptionEn: "Work at top private hospitals in Saudi Arabia. Free accommodation and transport.",
    requirements: ["Leseni ya TNMC", "Miaka 3+ ya uzoefu", "Dataflow Verification"],
  },
];

export function ElectivePlacement() {
  const { t } = useLang();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0f1d35] via-[#1e3a5f] to-[#1a365d] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <GraduationCap className="w-5 h-5" />
              <span className="text-sm font-semibold">{t("elective.title")}</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-6">{t("elective.title")}</h1>
            <p className="text-lg text-white/80 leading-relaxed">{t("elective.subtitle")}</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t("elective.howTitle")}</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Users, title: t("elective.step1"), desc: t("elective.step1Desc") },
              { icon: FileText, title: t("elective.step2"), desc: t("elective.step2Desc") },
              { icon: Globe, title: t("elective.step3"), desc: t("elective.step3Desc") },
              { icon: Plane, title: t("elective.step4"), desc: t("elective.step4Desc") },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-7 h-7" />
                </div>
                <div className="text-xs font-bold text-primary mb-2">Step {i + 1}</div>
                <h4 className="font-bold mb-2">{step.title}</h4>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Local Placements */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{t("elective.local")}</h2>
              <p className="text-sm text-muted-foreground">{t("elective.localDesc")}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {localPlacements.map((p, i) => (
              <div key={i} className="bg-white rounded-2xl border p-6 hover:shadow-lg transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{p.institution}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5" /> {p.location}
                    </p>
                  </div>
                  <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">{p.duration}</span>
                </div>
                <div className="text-xs font-bold text-primary mb-2 uppercase tracking-wider">{p.specialty}</div>
                <p className="text-sm text-muted-foreground mb-4">{p.description}</p>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                  <span>{p.spots} nafasi zimebaki</span>
                  <span>Mwisho: {p.deadline}</span>
                </div>
                <button className="w-full bg-primary text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  {t("elective.apply")} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* International Placements */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{t("elective.abroad")}</h2>
              <p className="text-sm text-muted-foreground">{t("elective.abroadDesc")}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {internationalPlacements.map((p, i) => (
              <div key={i} className="bg-white rounded-2xl border p-6 hover:shadow-lg transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{p.flag}</span>
                    <div>
                      <h3 className="font-bold text-lg">{p.country}</h3>
                      <p className="text-sm text-muted-foreground">{p.institutions}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">{p.duration}</span>
                </div>
                <div className="text-xs font-bold text-primary mb-2 uppercase tracking-wider">{p.specialty}</div>
                <p className="text-sm text-muted-foreground mb-3">{p.description}</p>
                <div className="text-sm font-bold text-emerald-600 mb-3">{p.salary}</div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.requirements.map((r, j) => (
                    <span key={j} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-500" /> {r}
                    </span>
                  ))}
                </div>
                <button className="w-full bg-primary text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  {t("elective.apply")} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-bold text-center mb-8">{t("elective.reqTitle")}</h2>
          <div className="bg-white rounded-2xl border p-8">
            <div className="grid md:grid-cols-2 gap-4">
              {[t("elective.req1"), t("elective.req2"), t("elective.req3"), t("elective.req4")].map((req, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="text-sm font-medium">{req}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
