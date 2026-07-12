import { useLang } from "./language";
import { MapPin, Plane, Briefcase, Clock, ArrowRight, CheckCircle, Building2, Stethoscope, Star, DollarSign } from "lucide-react";

function futureDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("sw-TZ", { year: "numeric", month: "long", day: "numeric" });
}

function daysAgo(days: number, lang: string): string {
  if (lang === "sw") return `Siku ${days} zilizopita`;
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

const localJobs = [
  {
    title: "ICU Nurse",
    hospital: "Muhimbili National Hospital",
    location: "Dar es Salaam",
    type: "Full-time",
    salary: "TSh 800,000-1,200,000/mwezi",
    postedDays: 2,
    deadlineDays: 45,
    description: "Tafuta muuguzi mwenye ujuzi wa ICU kwa hospitali yetu. Uzoefu wa miaka 3+ unahitajika.",
    descriptionEn: "Seeking an experienced ICU nurse. 3+ years experience required.",
    benefits: ["Bima ya afya", "Likizo", "Mafunzo ya ziada", "Usafiri"],
    benefitsEn: ["Health insurance", "Leave", "Additional training", "Transport"],
  },
  {
    title: "Midwife",
    hospital: "Aga Khan Hospital",
    location: "Dar es Salaam",
    type: "Full-time",
    salary: "TSh 700,000-1,000,000/mwezi",
    postedDays: 5,
    deadlineDays: 60,
    description: "Muuguzi wa uzazi ana hitajika kwa kitengo chetu cha uzazi. Leseni ya TNMC lazima.",
    descriptionEn: "Midwife needed for our maternity ward. TNMC license mandatory.",
    benefits: ["Bima ya afya", "Mishahara ya ziada", "Nyumba"],
    benefitsEn: ["Health insurance", "Bonus pay", "Housing"],
  },
  {
    title: "Pediatric Nurse",
    hospital: "Jakaya Kikwete Hospital",
    location: "Dodoma",
    type: "Full-time",
    salary: "TSh 650,000-900,000/mwezi",
    postedDays: 1,
    deadlineDays: 30,
    description: "Nafasi ya muuguzi wa watoto katika hospitali mpya ya kitaifa.",
    descriptionEn: "Pediatric nurse position at Tanzania's newest national hospital.",
    benefits: ["Bima ya afya", "Likizo", "Mafunzo"],
    benefitsEn: ["Health insurance", "Leave", "Training"],
  },
  {
    title: "Theatre Nurse",
    hospital: "Temeke Referral Hospital",
    location: "Dar es Salaam",
    type: "Contract",
    salary: "TSh 900,000-1,300,000/mwezi",
    postedDays: 3,
    deadlineDays: 50,
    description: "Muuguzi wa upasuaji ana hitajika kwa mikataba ya muda.",
    descriptionEn: "Theatre nurse needed for short-term contracts.",
    benefits: ["Bima ya afya", "Ushirikiano wa kimataifa"],
    benefitsEn: ["Health insurance", "International collaboration"],
  },
];

const internationalJobs = [
  {
    title: "ICU Staff Nurse",
    country: "United Kingdom",
    flag: "🇬🇧",
    hospital: "NHS Trust Hospitals",
    salary: "GBP 2,200-2,800/mwezi",
    type: "Full-time",
    postedDays: 1,
    deadlineDays: 90,
    description: "Nafasi za muuguzi wa ICU katika hospitali za NHS nchini Uingereza. Usajili wa rahisi kupitia Nuzia.",
    descriptionEn: "ICU nurse positions at NHS hospitals in UK. Easy registration through Nuzia.",
    benefits: ["Bima ya afya ya bure", "Likizo ya wiki 28", "Mafunzo ya bure", "Kukodisha nyumba"],
    benefitsEn: ["Free health insurance", "28 weeks leave", "Free training", "Housing allowance"],
  },
  {
    title: "Registered Nurse",
    country: "United States",
    flag: "🇺🇸",
    hospital: "Multiple Healthcare Systems",
    salary: "USD 4,000-6,000/mwezi",
    type: "Full-time",
    postedDays: 3,
    deadlineDays: 120,
    description: "Fursa za muuguzi nchini Marekani. Msaada kamili wa usajili wa NCLEX na visa.",
    descriptionEn: "Nurse positions in the US. Full support for NCLEX registration and visa.",
    benefits: ["Green Card Sponsorship", "Bima ya afya", "Mafunzo", "Relocation package"],
    benefitsEn: ["Green Card Sponsorship", "Health insurance", "Training", "Relocation package"],
  },
  {
    title: "Geriatric Nurse",
    country: "Germany",
    flag: "🇩🇪",
    hospital: "University Hospital Berlin",
    salary: "EUR 2,500-3,200/mwezi",
    type: "Full-time",
    postedDays: 7,
    deadlineDays: 150,
    description: "Muuguzi wa wazee nchini Ujerumani. Mafunzo ya lugha ya Ujerumani yatatolewa bure.",
    descriptionEn: "Geriatric nurse in Germany. Free German language training provided.",
    benefits: ["Bima ya afya", "Bure la lugha", "Usafiri", "Likizo ya wiki 30"],
    benefitsEn: ["Health insurance", "Free language course", "Transport pass", "30 weeks leave"],
  },
  {
    title: "Operating Theatre Nurse",
    country: "Saudi Arabia",
    flag: "🇸🇦",
    hospital: "Saudi German Hospital",
    salary: "SAR 5,000-8,000/mwezi",
    type: "Full-time",
    postedDays: 2,
    deadlineDays: 75,
    description: "Muuguzi wa upasuaji katika hospitali bora ya kibinafsi nchini Saudi Arabia.",
    descriptionEn: "Theatre nurse at a top private hospital in Saudi Arabia.",
    benefits: ["Bure la nyumba", "Bure la usafiri", "Bima ya afya", "Likizo ya wiki 36"],
    benefitsEn: ["Free accommodation", "Free transport", "Health insurance", "36 weeks leave"],
  },
];

export function JobOpportunities() {
  const { t, lang } = useLang();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0f1d35] via-[#1e3a5f] to-[#1a365d] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Briefcase className="w-5 h-5" />
              <span className="text-sm font-semibold">{t("jobs.title")}</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-6">{t("jobs.title")}</h1>
            <p className="text-lg text-white/80 leading-relaxed">{t("jobs.subtitle")}</p>
          </div>
        </div>
      </section>

      {/* Local Jobs */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{t("jobs.local")}</h2>
              <p className="text-sm text-muted-foreground">{t("jobs.localDesc")}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {localJobs.map((job, i) => (
              <div key={i} className="bg-white rounded-2xl border p-6 hover:shadow-lg transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{job.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Building2 className="w-3.5 h-3.5" /> {job.hospital}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" /> {job.location}
                    </p>
                  </div>
                  <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {job.type}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{lang === "sw" ? job.description : job.descriptionEn}</p>
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-600">{job.salary}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {(lang === "sw" ? job.benefits : job.benefitsEn).map((b, j) => (
                    <span key={j} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-500" /> {b}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                  <span>{daysAgo(job.postedDays, lang)}</span>
                  <span>{lang === "sw" ? "Mwisho:" : "Deadline:"} {futureDate(job.deadlineDays)}</span>
                </div>
                <button className="w-full bg-primary text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  {t("jobs.apply")} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* International Jobs */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{t("jobs.abroad")}</h2>
              <p className="text-sm text-muted-foreground">{t("jobs.abroadDesc")}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {internationalJobs.map((job, i) => (
              <div key={i} className="bg-white rounded-2xl border p-6 hover:shadow-lg transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{job.flag}</span>
                    <div>
                      <h3 className="font-bold text-lg">{job.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3.5 h-3.5" /> {job.hospital}
                      </p>
                      <p className="text-sm text-muted-foreground">{job.country}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {job.type}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{lang === "sw" ? job.description : job.descriptionEn}</p>
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-600">{job.salary}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {(lang === "sw" ? job.benefits : job.benefitsEn).map((b, j) => (
                    <span key={j} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500" /> {b}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                  <span>{daysAgo(job.postedDays, lang)}</span>
                  <span>{lang === "sw" ? "Mwisho:" : "Deadline:"} {futureDate(job.deadlineDays)}</span>
                </div>
                <button className="w-full bg-primary text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  {t("jobs.apply")} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-[#0f1d35] via-[#1e3a5f] to-[#1a365d]">
        <div className="container mx-auto px-4 text-center text-white">
          <Stethoscope className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl font-bold mb-4">{lang === "sw" ? "Huna kazi bado?" : "No suitable job yet?"}</h2>
          <p className="text-lg text-white/70 mb-8 max-w-xl mx-auto">
            {lang === "sw"
              ? "Jiunge na Nuzia ili upate arifa za kazi mpya zinazolingana na ujuzi wako."
              : "Join Nuzia to receive alerts for new jobs matching your skills."}
          </p>
          <button className="bg-white text-primary font-bold px-8 py-3 rounded-xl hover:bg-white/90 transition">
            {t("nav.becomeNurse")}
          </button>
        </div>
      </section>
    </div>
  );
}
