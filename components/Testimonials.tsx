import { useState } from "react";
import { useLang } from "./language";
import { Star, ChevronLeft, ChevronRight, Quote, BadgeCheck } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Asha Mwakasege",
    location: "Oysterbay, Dar es Salaam",
    role: "client" as const,
    rating: 5,
    textSw: "Mwanangu alikuwa anahitaji utunzaji wa kila baada ya upasuaji. NUZIA ilimpatia muuguzi wa kushangaza — Fatuma alikuwa na huruma na maarifa. Sasa anapona haraka.",
    textEn: "My son needed daily care after surgery. NUZIA found us an amazing nurse — Fatuma was compassionate and skilled. He's recovering quickly now.",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=120&h=120&fit=crop&crop=face",
    verified: true,
  },
  {
    id: 2,
    name: "James Kapinga",
    location: "Masaki, Dar es Salaam",
    role: "client" as const,
    rating: 5,
    textSw: "Babu yangu anahitaji msaada wa kila siku. NUZIA imetusaidia kupata muuguzi wa kuaminika ambaye anamjali sana. Huduma ya M-Pesa inafanya malipo kuwa rahisi sana.",
    textEn: "My father needs daily assistance. NUZIA helped us find a reliable nurse who truly cares about him. M-Pesa payments make everything so simple.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
    verified: true,
  },
  {
    id: 3,
    name: "Fatuma Mwalimu, RN",
    location: "Kinondoni, Dar es Salaam",
    role: "nurse" as const,
    rating: 5,
    textSw: "Kama muuguzi, NUZIA imenibadilisha maisha. Nimepata wateja wengi zaidi kupitia jukwaa hili na malipo yamekuwa ya wakati. Ninashauri kila muuguzi kujiunga.",
    textEn: "As a nurse, NUZIA has changed my life. I've found more clients through this platform and payments are always on time. I recommend every nurse join.",
    avatar: "https://images.unsplash.com/photo-1676552055618-22ec8cde399a?w=120&h=120&fit=crop&crop=face",
    verified: true,
  },
  {
    id: 4,
    name: "Maria Seni",
    location: "Msasani, Dar es Salaam",
    role: "client" as const,
    rating: 5,
    textSw: "Nilikuwa na wasiwasi kumtafuta muuguzi wa mtoto wangu mdogo. NUZIA ilinipa Grace ambaye alikuwa na uzoefu mkubwa na watoto. Mtoto wangu anapenda kuwa naye!",
    textEn: "I was worried about finding a nurse for my toddler. NUZIA matched me with Grace who has huge experience with children. My little one loves her!",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face",
    verified: true,
  },
  {
    id: 5,
    name: "Hassan Ally",
    location: "Garden City, Dar es Salaam",
    role: "client" as const,
    rating: 4,
    textSw: "Mkeangu alikuwa amebeba mtoto na alihitaji msaada wa baada ya kujifungua. NUZIA ilimpanga muuguzi wa utunzaji wa baada ya kujifungua ndani ya saa 2. Huduma ya haraka sana!",
    textEn: "My wife had just given birth and needed postnatal care. NUZIA arranged a postnatal nurse within 2 hours. Extremely fast service!",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face",
    verified: true,
  },
];

export function Testimonials() {
  const { lang } = useLang();
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  const t = testimonials[current];

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-1.5 rounded-full mb-4">
            <Star className="w-4 h-4 text-amber-500 fill-current" />
            <span className="text-sm font-semibold text-amber-700">
              {lang === "sw" ? "Maoni ya Wateja Wetu" : "What Our Clients Say"}
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">
            {lang === "sw" ? "Wateja Wetu Wanapenda NUZIA" : "Our Clients Love NUZIA"}
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            {lang === "sw"
              ? "Sikiliza wateja wetu wanaozungumzia uzoefu wao na NUZIA"
              : "Hear from our clients about their experience with NUZIA"}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg border p-8 lg:p-10 relative">
            <Quote className="absolute top-6 left-6 w-10 h-10 text-slate-100" />

            <div className="flex items-center gap-4 mb-6 relative z-10">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-lg">{t.name}</h4>
                  {t.verified && <BadgeCheck className="w-5 h-5 text-[#2563eb]" />}
                </div>
                <p className="text-sm text-slate-500">{t.location}</p>
                <div className="flex gap-0.5 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < t.rating ? "text-amber-400 fill-current" : "text-slate-200"}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <p className="text-slate-700 leading-relaxed text-base lg:text-lg relative z-10 italic">
              "{lang === "sw" ? t.textSw : t.textEn}"
            </p>

            <div className="mt-4 flex items-center gap-2 relative z-10">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                t.role === "nurse"
                  ? "bg-[#2563eb]/10 text-[#2563eb]"
                  : "bg-emerald-50 text-emerald-700"
              }`}>
                {t.role === "nurse"
                  ? (lang === "sw" ? "Muuguzi" : "Nurse")
                  : (lang === "sw" ? "Mteja" : "Client")}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full bg-white border shadow-sm flex items-center justify-center hover:bg-slate-50 transition"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === current ? "bg-[#1e3a5f] w-6" : "bg-slate-300"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full bg-white border shadow-sm flex items-center justify-center hover:bg-slate-50 transition"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
