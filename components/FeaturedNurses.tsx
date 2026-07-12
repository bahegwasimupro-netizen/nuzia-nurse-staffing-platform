import { useLang } from "./language";
import { Star, MapPin, Clock, Award } from "lucide-react";

const featuredNurses = [
  {
    id: 1,
    name: "Fatuma Mwalimu, RN",
    specialty: "Huduma za Nyumbani",
    specialtyEn: "Home Care",
    rating: 4.9,
    reviews: 127,
    hourlyRate: 45000,
    location: "Dar es Salaam",
    experience: "Miaka 8",
    experienceEn: "8 Years",
    avatar: "https://images.unsplash.com/photo-1676552055618-22ec8cde399a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXJzZSUyMHBvcnRyYWl0JTIwcHJvZmVzc2lvbmFsJTIwaGVhbHRoY2FyZXxlbnwxfHx8fDE3NTU0MjkwMjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    badges: ["Kiwango cha Juu", "Mwitikio wa Haraka"],
    available: true,
    completedJobs: 156
  },
  {
    id: 2,
    name: "John Massawe, RN",
    specialty: "ICU Specialist",
    specialtyEn: "ICU Specialist",
    rating: 4.8,
    reviews: 89,
    hourlyRate: 75000,
    location: "Arusha",
    experience: "Miaka 6",
    experienceEn: "6 Years",
    avatar: "https://images.unsplash.com/photo-1753487050317-919a2b26a6ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBudXJzZSUyMG1lZGljYWwlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzU1MzM5MTUzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    badges: ["TNMC Certified", "Huduma 24/7"],
    available: true,
    completedJobs: 98
  },
  {
    id: 3,
    name: "Grace Mushi, RN",
    specialty: "Huduma za Watoto",
    specialtyEn: "Pediatric Care",
    rating: 5.0,
    reviews: 203,
    hourlyRate: 55000,
    location: "Mwanza",
    experience: "Miaka 10",
    experienceEn: "10 Years",
    avatar: "https://images.unsplash.com/photo-1676552055618-22ec8cde399a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwbnVyc2UlMjBoZWFsdGhjYXJlJTIwd29ya2VyfGVufDF8fHx8MTc1NTMzOTE1M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    badges: ["Kiwango cha Juu", "Mtaalamu"],
    available: false,
    completedJobs: 234
  },
  {
    id: 4,
    name: "Emmanuel Kileo, RN",
    specialty: "Huduma za Moyo",
    specialtyEn: "Cardiac Care",
    rating: 4.7,
    reviews: 156,
    hourlyRate: 65000,
    location: "Dodoma",
    experience: "Miaka 5",
    experienceEn: "5 Years",
    avatar: "https://images.unsplash.com/photo-1676552055618-22ec8cde399a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXJzZSUyMHBvcnRyYWl0JTIwcHJvZmVzc2lvbmFsJTIwaGVhbHRoY2FyZXxlbnwxfHx8fDE3NTU0MjkwMjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    badges: ["Mwenye Huruma", "Muaminfu"],
    available: true,
    completedJobs: 89
  }
];

export function FeaturedNurses() {
  const { t, lang } = useLang();

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl mb-4">{t("featured.title")}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("featured.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredNurses.map((nurse) => (
            <div key={nurse.id} className="bg-white rounded-2xl border p-6 hover:shadow-lg transition-all">
              <div className="relative mb-4">
                <img src={nurse.avatar} alt={nurse.name} className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-slate-100" />
                <div className={`absolute -top-1 right-[calc(50%-40px)] w-4 h-4 rounded-full border-2 border-white ${nurse.available ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              </div>

              <div className="text-center mb-4">
                <h3 className="font-bold mb-1">{nurse.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{lang === "sw" ? nurse.specialty : nurse.specialtyEn}</p>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{nurse.rating}</span>
                  <span className="text-sm text-muted-foreground">({nurse.reviews})</span>
                </div>
                <div className="flex flex-wrap gap-1 justify-center mb-3">
                  {nurse.badges.map((badge, index) => (
                    <span key={index} className="text-xs bg-primary/5 text-primary px-2 py-0.5 rounded-full font-medium">{badge}</span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{nurse.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{t("featured.experience")} {lang === "sw" ? nurse.experience : nurse.experienceEn}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>{nurse.completedJobs} {t("featured.completed")}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t("featured.starting")}</p>
                  <p className="font-semibold text-emerald-600">TSh {nurse.hourlyRate.toLocaleString()}{t("common.perHour")}</p>
                </div>
              </div>

              <button
                className={`w-full font-bold py-2.5 rounded-xl transition-all ${nurse.available ? "bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] text-white hover:shadow-lg" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
                disabled={!nurse.available}
              >
                {nurse.available ? t("featured.book") : t("featured.unavailable")}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="border-2 border-primary text-primary font-bold px-8 py-3 rounded-xl hover:bg-primary hover:text-white transition-all">
            {t("featured.viewAll")}
          </button>
        </div>
      </div>
    </section>
  );
}
