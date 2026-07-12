import { useLang } from "./language";
import { Heart, Activity, Baby, Home, Stethoscope, Brain, Plane, ShoppingBag } from "lucide-react";

const serviceKeys = [
  { icon: Home, titleKey: "services.homeCare", descKey: "services.homeCareDesc", price: "TSh 45,000/saa", color: "bg-emerald-100 text-emerald-600" },
  { icon: Activity, titleKey: "services.icu", descKey: "services.icuDesc", price: "TSh 75,000/saa", color: "bg-red-100 text-red-600" },
  { icon: Heart, titleKey: "services.heart", descKey: "services.heartDesc", price: "TSh 65,000/saa", color: "bg-pink-100 text-pink-600" },
  { icon: Baby, titleKey: "services.child", descKey: "services.childDesc", price: "TSh 55,000/saa", color: "bg-blue-100 text-blue-600" },
  { icon: Stethoscope, titleKey: "services.general", descKey: "services.generalDesc", price: "TSh 50,000/saa", color: "bg-purple-100 text-purple-600" },
  { icon: Brain, titleKey: "services.mental", descKey: "services.mentalDesc", price: "TSh 60,000/saa", color: "bg-indigo-100 text-indigo-600" },
  { icon: Plane, titleKey: "nav.elective", descKey: "elective.subtitle", price: "Kutoka $500", color: "bg-amber-100 text-amber-600" },
  { icon: ShoppingBag, titleKey: "nav.jobs", descKey: "jobs.subtitle", price: "Bure", color: "bg-orange-100 text-orange-600" },
];

export function ServiceCategories() {
  const { t } = useLang();

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl mb-4">{t("services.title")}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("services.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceKeys.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div key={index} className="border rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer group bg-white">
                <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">{t(category.titleKey)}</h3>
                <p className="text-muted-foreground text-sm mb-3">{t(category.descKey)}</p>
                <p className="font-semibold text-emerald-600 text-sm">{category.price}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-sm text-primary font-semibold">{t("services.tnmc")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
