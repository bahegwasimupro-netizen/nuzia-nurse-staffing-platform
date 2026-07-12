import { useMemo } from "react";
import { useLang } from "./language";

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface AnalyticsProps {
  revenueData: DataPoint[];
  jobsData: DataPoint[];
  totalRevenue: number;
  totalJobs: number;
  activeJobs: number;
  completedJobs: number;
  activeNurses: number;
  avgRating: number;
  topNurses: { name: string; jobs: number; rating: number }[];
}

export function AnalyticsDashboard(data: AnalyticsProps) {
  const { lang } = useLang();
  const t = (key: string) => {
    const map: Record<string, string> = {
      "analytics.revenue": lang === "sw" ? "Mapato" : "Revenue",
      "analytics.jobs": lang === "sw" ? "Kazi" : "Jobs",
      "analytics.active": lang === "sw" ? "Hatifutikani" : "Active",
      "analytics.completed": lang === "sw" ? "Zimekamilika" : "Completed",
      "analytics.nurses": lang === "sw" ? "Wauguzi" : "Nurses",
      "analytics.rating": lang === "sw" ? "Ukadiriaji" : "Avg Rating",
      "analytics.title": lang === "sw" ? "Dashibodi ya Uchambuzi" : "Analytics Dashboard",
      "analytics.revenueTrend": lang === "sw" ? "Mwenendo wa Mapato (Siku 7)" : "Revenue Trend (7 Days)",
      "analytics.jobsTrend": lang === "sw" ? "Mwenendo wa Kazi (Siku 7)" : "Jobs Trend (7 Days)",
      "analytics.topNurses": lang === "sw" ? "Wauguzi Bora" : "Top Nurses",
      "analytics.jobsLabel": lang === "sw" ? "kazi" : "jobs",
      "analytics.ratingLabel": lang === "sw" ? "ukadiriaji" : "rating",
    };
    return map[key] || key;
  };

  const maxRevenue = Math.max(...data.revenueData.map((d) => d.value), 1);
  const maxJobs = Math.max(...data.jobsData.map((d) => d.value), 1);

  const stats = [
    { label: t("analytics.revenue"), value: `TSh ${data.totalRevenue.toLocaleString()}`, color: "bg-emerald-500" },
    { label: t("analytics.active"), value: String(data.activeJobs), color: "bg-blue-500" },
    { label: t("analytics.completed"), value: String(data.completedJobs), color: "bg-purple-500" },
    { label: t("analytics.nurses"), value: String(data.activeNurses), color: "bg-amber-500" },
    { label: t("analytics.rating"), value: `${data.avgRating}/5`, color: "bg-rose-500" },
    { label: t("analytics.jobs"), value: String(data.totalJobs), color: "bg-slate-500" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <span className="w-8 h-8 bg-[#1e3a5f]/10 rounded-lg flex items-center justify-center text-sm font-bold text-[#1e3a5f]">A</span>
        {t("analytics.title")}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border p-4 shadow-sm">
            <div className={`w-2 h-2 rounded-full ${s.color} mb-2`} />
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{s.label}</p>
            <p className="text-lg font-bold mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border p-5 shadow-sm">
          <h3 className="font-bold text-sm mb-4">{t("analytics.revenueTrend")}</h3>
          <div className="flex items-end gap-2 h-40">
            {data.revenueData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] font-semibold text-slate-500">TSh {(d.value / 1000).toFixed(0)}k</span>
                <div className="w-full bg-gradient-to-t from-emerald-500 to-emerald-300 rounded-t-md transition-all duration-500" style={{ height: `${(d.value / maxRevenue) * 100}%`, minHeight: "4px" }} />
                <span className="text-[9px] text-slate-400 font-medium">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-5 shadow-sm">
          <h3 className="font-bold text-sm mb-4">{t("analytics.jobsTrend")}</h3>
          <div className="relative h-40">
            <svg viewBox="0 0 300 120" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="jobsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
              </defs>
              {data.jobsData.length > 1 && (
                <>
                  <path
                    d={`M0,${120 - (data.jobsData[0].value / maxJobs) * 100} ${data.jobsData.map((d, i) => `L${(i / (data.jobsData.length - 1)) * 300},${120 - (d.value / maxJobs) * 100}`).join(" ")} L300,120 L0,120 Z`}
                    fill="url(#jobsGrad)"
                  />
                  <polyline
                    points={data.jobsData.map((d, i) => `${(i / (data.jobsData.length - 1)) * 300},${120 - (d.value / maxJobs) * 100}`).join(" ")}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {data.jobsData.map((d, i) => (
                    <circle key={i} cx={(i / (data.jobsData.length - 1)) * 300} cy={120 - (d.value / maxJobs) * 100} r="4" fill="#3b82f6" stroke="white" strokeWidth="2" />
                  ))}
                </>
              )}
            </svg>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
              {data.jobsData.map((d, i) => (
                <span key={i} className="text-[9px] text-slate-400 font-medium">{d.label}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {data.topNurses.length > 0 && (
        <div className="bg-white rounded-2xl border p-5 shadow-sm">
          <h3 className="font-bold text-sm mb-4">{t("analytics.topNurses")}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-400 uppercase tracking-wider border-b">
                  <th className="text-left py-2 font-semibold">{lang === "sw" ? "Jina" : "Name"}</th>
                  <th className="text-center py-2 font-semibold">{t("analytics.jobsLabel")}</th>
                  <th className="text-center py-2 font-semibold">{t("analytics.ratingLabel")}</th>
                </tr>
              </thead>
              <tbody>
                {data.topNurses.map((n, i) => (
                  <tr key={i} className="border-b last:border-b-0 hover:bg-slate-50">
                    <td className="py-3 font-medium">{n.name}</td>
                    <td className="text-center py-3">
                      <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full">{n.jobs}</span>
                    </td>
                    <td className="text-center py-3">
                      <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">{n.rating}/5</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
