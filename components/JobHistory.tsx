import { useState, useMemo } from "react";
import { useLang } from "./language";
import { Calendar, Download, Filter, Search, ChevronDown } from "lucide-react";

interface JobRecord {
  id: string;
  type: string;
  description: string;
  locationName: string;
  status: string;
  paymentStatus: string;
  assignedNurseName?: string;
  clientName: string;
  createdAt: string;
  datetime: string;
}

interface JobHistoryProps {
  jobs: JobRecord[];
}

export function JobHistory({ jobs }: JobHistoryProps) {
  const { lang } = useLang();
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const t = (key: string) => {
    const map: Record<string, string> = {
      "history.title": lang === "sw" ? "Historia ya Kazi" : "Job History",
      "history.export": lang === "sw" ? "Hamisha CSV" : "Export CSV",
      "history.from": lang === "sw" ? "Kuanzia" : "From",
      "history.to": lang === "sw" ? "Hadi" : "To",
      "history.status": lang === "sw" ? "Hali" : "Status",
      "history.all": lang === "sw" ? "Zote" : "All",
      "history.search": lang === "sw" ? "Tafuta kwa jina, aina, eneo..." : "Search by name, type, location...",
      "history.total": lang === "sw" ? "Jumla" : "Total",
      "history.showing": lang === "sw" ? "Inaonyesha" : "Showing",
      "history.results": lang === "sw" ? "matokeo" : "results",
    };
    return map[key] || key;
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (dateFrom && new Date(job.createdAt) < new Date(dateFrom)) return false;
      if (dateTo && new Date(job.createdAt) > new Date(dateTo + "T23:59:59")) return false;
      if (statusFilter !== "all" && job.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          job.clientName.toLowerCase().includes(q) ||
          job.type.toLowerCase().includes(q) ||
          job.locationName.toLowerCase().includes(q) ||
          (job.assignedNurseName || "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [jobs, dateFrom, dateTo, statusFilter, searchQuery]);

  const exportCSV = () => {
    const headers = ["ID", lang === "sw" ? "Aina" : "Type", lang === "sw" ? "Mteja" : "Client", lang === "sw" ? "Muuguzi" : "Nurse", lang === "sw" ? "Eneo" : "Location", lang === "sw" ? "Hali" : "Status", lang === "sw" ? "Malipo" : "Payment", lang === "sw" ? "Tarehe" : "Date"];
    const rows = filteredJobs.map((j) => [j.id, j.type, j.clientName, j.assignedNurseName || "-", j.locationName, j.status, j.paymentStatus, new Date(j.createdAt).toLocaleDateString()]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nuzia-jobs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const statusColors: Record<string, string> = {
    "Pending Assignment": "bg-amber-100 text-amber-800",
    "Nurse Assigned": "bg-blue-100 text-blue-800",
    "Care in Progress": "bg-indigo-100 text-indigo-800",
    "Completed": "bg-emerald-100 text-emerald-800",
  };

  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
      <div className="p-5 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#1e3a5f]" />
            <h3 className="font-bold">{t("history.title")}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition ${showFilters ? "bg-[#1e3a5f] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
              <Filter className="w-3.5 h-3.5" />{t("history.status")}<ChevronDown className={`w-3 h-3 transition ${showFilters ? "rotate-180" : ""}`} />
            </button>
            <button onClick={exportCSV} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition">
              <Download className="w-3.5 h-3.5" />{t("history.export")}
            </button>
          </div>
        </div>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t("history.search")} className="w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] bg-slate-50" />
        </div>

        {showFilters && (
          <div className="grid grid-cols-3 gap-3 mt-3">
            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{t("history.from")}</label>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#1e3a5f] bg-slate-50 mt-1" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{t("history.to")}</label>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#1e3a5f] bg-slate-50 mt-1" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{t("history.status")}</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#1e3a5f] bg-slate-50 mt-1">
                <option value="all">{t("history.all")}</option>
                <option value="Pending Assignment">{lang === "sw" ? "Inasubiri" : "Pending"}</option>
                <option value="Nurse Assigned">{lang === "sw" ? "Imepangiwa" : "Assigned"}</option>
                <option value="Care in Progress">{lang === "sw" ? "Inaendelea" : "In Progress"}</option>
                <option value="Completed">{lang === "sw" ? "Imekamilika" : "Completed"}</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 uppercase tracking-wider bg-slate-50 border-b">
              <th className="text-left px-5 py-3 font-semibold">{lang === "sw" ? "Aina" : "Type"}</th>
              <th className="text-left px-5 py-3 font-semibold">{lang === "sw" ? "Mteja" : "Client"}</th>
              <th className="text-left px-5 py-3 font-semibold">{lang === "sw" ? "Muuguzi" : "Nurse"}</th>
              <th className="text-left px-5 py-3 font-semibold">{lang === "sw" ? "Eneo" : "Location"}</th>
              <th className="text-center px-5 py-3 font-semibold">{lang === "sw" ? "Hali" : "Status"}</th>
              <th className="text-center px-5 py-3 font-semibold">{lang === "sw" ? "Malipo" : "Payment"}</th>
              <th className="text-left px-5 py-3 font-semibold">{lang === "sw" ? "Tarehe" : "Date"}</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8 text-slate-400 text-sm">{lang === "sw" ? "Hakuna kazi zilizopatikana" : "No jobs found"}</td></tr>
            ) : (
              filteredJobs.map((job) => (
                <tr key={job.id} className="border-b last:border-b-0 hover:bg-slate-50 transition">
                  <td className="px-5 py-3 font-medium text-xs">{job.type}</td>
                  <td className="px-5 py-3 text-xs">{job.clientName}</td>
                  <td className="px-5 py-3 text-xs">{job.assignedNurseName || <span className="text-slate-400">—</span>}</td>
                  <td className="px-5 py-3 text-xs">{job.locationName}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColors[job.status] || "bg-slate-100 text-slate-600"}`}>
                      {job.status === "Pending Assignment" ? (lang === "sw" ? "Inasubiri" : "Pending") : job.status === "Nurse Assigned" ? (lang === "sw" ? "Imepangiwa" : "Assigned") : job.status === "Care in Progress" ? (lang === "sw" ? "Inaendelea" : "In Progress") : (lang === "sw" ? "Imekamilika" : "Completed")}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${job.paymentStatus === "Paid" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
                      {job.paymentStatus === "Paid" ? (lang === "sw" ? "Imelipwa" : "Paid") : (lang === "sw" ? "Haijalipwa" : "Unpaid")}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-slate-500">{new Date(job.createdAt).toLocaleDateString(lang === "sw" ? "sw-TZ" : "en-US")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-3 border-t bg-slate-50 text-xs text-slate-400 flex justify-between">
        <span>{t("history.showing")} {filteredJobs.length}/{jobs.length} {t("history.results")}</span>
        <span>{t("history.total")}: TSh {filteredJobs.length.toLocaleString()}</span>
      </div>
    </div>
  );
}
