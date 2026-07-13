import { useEffect, useRef, useState } from "react";
import { useLang } from "./language";
import { Users, CheckCircle, Star, Clock } from "lucide-react";

function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = Date.now();
          const step = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <div ref={ref}>{count.toLocaleString()}{suffix}</div>;
}

export function StatsCounter() {
  const { lang } = useLang();

  const stats = [
    { icon: Users, value: 150, suffix: "+", labelSw: "Wauguzi Walioidhinishwa", labelEn: "Verified Nurses", color: "text-[#2563eb]" },
    { icon: CheckCircle, value: 500, suffix: "+", labelSw: "Huduma Zilizokamilika", labelEn: "Services Completed", color: "text-emerald-500" },
    { icon: Star, value: 98, suffix: "%", labelSw: "Kiwango cha Kuridhika", labelEn: "Satisfaction Rate", color: "text-amber-500" },
    { icon: Clock, value: 24, suffix: "/7", labelSw: "Msaada wa Moja kwa Moja", labelEn: "Live Support", color: "text-[#1e3a5f]" },
  ];

  return (
    <section className="py-14 bg-gradient-to-br from-[#0f1d35] via-[#1e3a5f] to-[#1a365d]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="text-center text-white">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className={`w-7 h-7 ${stat.color}`} />
                </div>
                <div className="text-3xl lg:text-4xl font-extrabold mb-1">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm text-white/60 font-medium">
                  {lang === "sw" ? stat.labelSw : stat.labelEn}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
