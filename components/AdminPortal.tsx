import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, UserProfile, getMockUsers } from "./auth";
import { db } from "./firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { Users, Activity, DollarSign, MapPin, CheckCircle, Clock, RefreshCw, Layers, Award, LogOut, Sparkles, Settings } from "lucide-react";
import { useLang } from "./language";
import { ProfileModal } from "./ProfileModal";
import { NotificationBell } from "./NotificationBell";
import { useNotifications } from "./notifications";
import { AnalyticsDashboard } from "./AnalyticsDashboard";
import { JobHistory } from "./JobHistory";
import { sendVerificationEmail } from "./emailService";
import { BottomNav } from "./BottomNav";
import L from "leaflet";

interface Job {
  id: string;
  clientId: string;
  clientName: string;
  type: string;
  location: string;
  locationName: string;
  datetime: string;
  description: string;
  status: "Pending Assignment" | "Nurse Assigned" | "Care in Progress" | "Completed";
  paymentStatus: "Unpaid" | "Paid";
  assignedNurseId?: string;
  assignedNurseName?: string;
  assignedNursePhone?: string;
  amount?: number;
  createdAt: string;
}

const LOCAL_JOBS_KEY = "nuzia_mock_jobs";
const LOCAL_USERS_KEY = "nuzia_mock_users";

export function AdminPortal() {
  const { logout, isMock, updateUserByUid } = useAuth();
  const { t, lang } = useLang();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [nurses, setNurses] = useState<UserProfile[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [assigningJobId, setAssigningJobId] = useState<string | null>(null);
  const [selectedNurseId, setSelectedNurseId] = useState<string>("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const mapContainer = useRef<HTMLDivElement>(null);
  const adminMap = useRef<L.Map | null>(null);
  const markersGroup = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (isMock) {
      const loadMockData = () => {
        const localJobs = localStorage.getItem(LOCAL_JOBS_KEY);
        setJobs(localJobs ? JSON.parse(localJobs) : []);
        const localUsers = localStorage.getItem(LOCAL_USERS_KEY);
        if (localUsers) { const parsed: UserProfile[] = JSON.parse(localUsers); setNurses(parsed.filter(u => u.role === "nurse")); }
        else { setNurses(getMockUsers().filter(u => u.role === "nurse")); }
        const localReviews = localStorage.getItem("nuzia_mock_reviews");
        setReviews(localReviews ? JSON.parse(localReviews) : []);
      };
      loadMockData();
      const interval = setInterval(loadMockData, 3000);
      return () => clearInterval(interval);
    } else {
      const unsubJobs = onSnapshot(collection(db, "jobs"), (snapshot) => {
        const loadedJobs: Job[] = [];
        snapshot.forEach((doc) => loadedJobs.push({ id: doc.id, ...doc.data() } as Job));
        setJobs(loadedJobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      });
      const unsubNurses = onSnapshot(collection(db, "users"), (snapshot) => {
        const loadedNurses: UserProfile[] = [];
        snapshot.forEach((doc) => { const profile = doc.data() as UserProfile; if (profile.role === "nurse") loadedNurses.push(profile); });
        setNurses(loadedNurses);
      });
      const unsubReviews = onSnapshot(collection(db, "reviews"), (snapshot) => {
        const loadedReviews: any[] = [];
        snapshot.forEach((doc) => loadedReviews.push({ id: doc.id, ...doc.data() }));
        setReviews(loadedReviews);
      });
      return () => { unsubJobs(); unsubNurses(); unsubReviews(); };
    }
  }, [isMock]);

  useEffect(() => {
    if (mapContainer.current && !adminMap.current) {
      const map = L.map(mapContainer.current).setView([-6.8200, 39.2800], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
      adminMap.current = map;
      markersGroup.current = L.layerGroup().addTo(map);
    }
    if (adminMap.current && markersGroup.current) {
      markersGroup.current.clearLayers();
      const redIcon = L.divIcon({ className: 'custom-div-icon', html: `<div style="background-color:#dc2626; width:16px; height:16px; border-radius:50%; border:3px solid white; box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>`, iconSize: [16, 16], iconAnchor: [8, 8] });
      const blueIcon = L.divIcon({ className: 'custom-div-icon', html: `<div style="background-color:#2563eb; width:16px; height:16px; border-radius:50%; border:3px solid white; box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>`, iconSize: [16, 16], iconAnchor: [8, 8] });
      const greenIcon = L.divIcon({ className: 'custom-div-icon', html: `<div style="background-color:#059669; width:20px; height:20px; border-radius:50%; border:3px solid white; box-shadow:0 2px 4px rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; color:white; font-size:10px; font-weight:bold;">&#129657;</div>`, iconSize: [20, 20], iconAnchor: [10, 10] });
      const clientLabel = lang === "sw" ? "Mteja:" : "Client:";
      const statusLabel = lang === "sw" ? "Hali:" : "Status:";
      const pendingLabel = t("admin.pending");
      const assignedLabel = lang === "sw" ? "Iliyopangwa" : "Assigned";
      const descLabel = lang === "sw" ? "Maelezo:" : "Description:";
      const skillLabel = lang === "sw" ? "Ujuzi:" : "Specialty:";
      const priceLabel = lang === "sw" ? "Bei:" : "Price:";
      const readyLabel = t("admin.readyNurses");
      jobs.forEach((job) => {
        if (!job.location) return;
        const [lat, lng] = job.location.split(",").map(Number);
        if (isNaN(lat) || isNaN(lng)) return;
        const isPending = job.status === "Pending Assignment";
        const marker = L.marker([lat, lng], { icon: isPending ? redIcon : blueIcon }).bindPopup(`<div style="font-family:sans-serif; font-size:12px;"><b style="color:${isPending ? '#dc2626' : '#2563eb'}">${job.type}</b><br/><b>${clientLabel}</b> ${job.clientName}<br/><b>${statusLabel}</b> ${isPending ? pendingLabel : assignedLabel}<br/><b>${descLabel}</b> ${job.description.slice(0, 50)}...</div>`);
        if (markersGroup.current) marker.addTo(markersGroup.current);
      });
      const nurseCoords: Record<string, [number, number]> = {};
      nurses.forEach((nurse) => {
        if (!nurse.available) return;
        let lat = -6.8200, lng = 39.2800;
        if (nurse.locationCoords) {
          const parts = nurse.locationCoords.split(",").map(Number);
          if (!isNaN(parts[0]) && !isNaN(parts[1])) { lat = parts[0]; lng = parts[1]; }
        } else if (nurseCoords[nurse.uid]) {
          [lat, lng] = nurseCoords[nurse.uid];
        } else { lat += (Math.random() - 0.5) * 0.05; lng += (Math.random() - 0.5) * 0.05; }
        const marker = L.marker([lat, lng], { icon: greenIcon }).bindPopup(`<div style="font-family:sans-serif; font-size:12px;"><b style="color:#059669">${nurse.name}</b><br/><b>${skillLabel}</b> ${nurse.specialty}<br/><b>${priceLabel}</b> TSh ${nurse.hourlyRate?.toLocaleString()}${t("common.perHour")}<br/><span style="color:#059669; font-weight:bold;">${readyLabel}</span></div>`);
        if (markersGroup.current) marker.addTo(markersGroup.current);
      });
    }
  }, [jobs, nurses, lang, t]);

  const handleAssignNurse = async (jobId: string) => {
    if (!selectedNurseId) { alert(t("admin.selectNurseFirst")); return; }
    setLoading(true);
    const matchedNurse = nurses.find(n => n.uid === selectedNurseId);
    if (!matchedNurse) return;
    if (isMock) {
      const current = localStorage.getItem(LOCAL_JOBS_KEY);
      if (current) { const all = JSON.parse(current); const idx = all.findIndex((j: Job) => j.id === jobId); if (idx !== -1) { all[idx].status = "Nurse Assigned"; all[idx].assignedNurseId = matchedNurse.uid; all[idx].assignedNurseName = matchedNurse.name; all[idx].assignedNursePhone = matchedNurse.phone || "+255 754 000 000"; localStorage.setItem(LOCAL_JOBS_KEY, JSON.stringify(all)); } }
      const currentUsers = localStorage.getItem(LOCAL_USERS_KEY);
      if (currentUsers) { const allUsers = JSON.parse(currentUsers); const uIdx = allUsers.findIndex((u: UserProfile) => u.uid === matchedNurse.uid); if (uIdx !== -1) { allUsers[uIdx].available = false; localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(allUsers)); } }
      setJobs(JSON.parse(localStorage.getItem(LOCAL_JOBS_KEY) || "[]"));
      setNurses(JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || "[]").filter((u: any) => u.role === "nurse"));
    } else {
      try {
        await updateDoc(doc(db, "jobs", jobId), { status: "Nurse Assigned", assignedNurseId: matchedNurse.uid, assignedNurseName: matchedNurse.name, assignedNursePhone: matchedNurse.phone || "+255 754 000 000" });
        await updateDoc(doc(db, "users", matchedNurse.uid), { available: false });
      } catch (e) { console.error("Firestore update failed", e); }
    }
    setLoading(false); setAssigningJobId(null); setSelectedNurseId(""); alert(t("admin.nurseAssigned"));
  };

  const handleLogout = () => { logout(); navigate("/"); };
  const pendingJobs = jobs.filter(j => j.status === "Pending Assignment");
  const activeJobs = jobs.filter(j => j.status === "Nurse Assigned" || j.status === "Care in Progress");
  const availableNurses = nurses.filter(n => n.available);
  const totalEarnings = jobs.filter(j => j.paymentStatus === "Paid").reduce((sum, j) => { const rate = j.type.includes("ICU") ? 75000 : j.type.includes("Moyo") ? 65000 : 45000; return sum + rate; }, 0);
  const completedJobs = jobs.filter(j => j.status === "Completed");
  const dateLocale = lang === "sw" ? "sw-TZ" : "en-US";

  const dayLabels = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString(dateLocale, { weekday: "short" });
  });

  const revenueData = dayLabels.map((label, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
    const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).toISOString();
    const dayRevenue = jobs
      .filter(j => j.paymentStatus === "Paid" && j.createdAt >= dayStart && j.createdAt < dayEnd)
      .reduce((sum, j) => sum + (j.amount || 45000), 0);
    return { label, value: dayRevenue };
  });

  const jobsData = dayLabels.map((label, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
    const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).toISOString();
    const dayJobs = jobs.filter(j => j.createdAt >= dayStart && j.createdAt < dayEnd).length;
    return { label, value: dayJobs };
  });

  const topNurses = nurses.filter(n => n.verificationStatus === "verified").slice(0, 5).map(n => {
    const nurseJobs = jobs.filter(j => j.nurseName === n.name);
    const nurseReviews = reviews.filter(r => r.nurseName === n.name);
    const avgRat = nurseReviews.length > 0 ? nurseReviews.reduce((s, r) => s + r.rating, 0) / nurseReviews.length : 0;
    return { name: n.name, jobs: nurseJobs.length, rating: Math.round(avgRat * 10) / 10 || 0 };
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1e3a5f] to-[#2563eb] rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <div>
              <span className="font-bold text-xl tracking-wide">NUZIA</span>
              <span className="text-xs text-slate-400 block">{t("admin.adminCenter")}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <button onClick={() => setIsProfileOpen(true)} className="flex items-center gap-2 px-3 py-2 text-sm text-[#1e3a5f] bg-[#1e3a5f]/5 hover:bg-[#1e3a5f]/10 rounded-lg transition">
              <Settings className="w-4 h-4" />
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition">
              <LogOut className="w-4 h-4" /><span>{t("common.logout")}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 pb-24 md:pb-8 max-w-6xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold">{t("admin.dashboard")}</h1>
          <p className="text-slate-500">{t("admin.subtitle")}</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>{lang === "sw" ? "Uchanganyaji wa wauguzi sasa unafanywa kiotomatiki. Maombi mapya yanapangwa muuguzi bora mara moja." : "Nurse matching is now automated. New requests are assigned the best nurse instantly."}</span>
        </div>

        <AnalyticsDashboard
          revenueData={revenueData}
          jobsData={jobsData}
          totalRevenue={totalEarnings}
          totalJobs={jobs.length}
          activeJobs={activeJobs.length}
          completedJobs={completedJobs.length}
          activeNurses={nurses.filter(n => n.available).length}
          avgRating={4.8}
          topNurses={topNurses}
        />

        <JobHistory jobs={jobs.map(j => ({ ...j, createdAt: j.createdAt || new Date().toISOString() }))} />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><Clock className="w-6 h-6" /></div>
            <div><p className="text-2xl font-bold">{pendingJobs.length}</p><p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{t("admin.pending")}</p></div>
          </div>
          <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center"><Activity className="w-6 h-6" /></div>
            <div><p className="text-2xl font-bold">{activeJobs.length}</p><p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{t("admin.active")}</p></div>
          </div>
          <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><Users className="w-6 h-6" /></div>
            <div><p className="text-2xl font-bold">{availableNurses.length}</p><p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{t("admin.readyNurses")}</p></div>
          </div>
          <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#1e3a5f]/10 text-[#1e3a5f] flex items-center justify-center"><DollarSign className="w-6 h-6" /></div>
            <div><p className="text-2xl font-bold">TSh {totalEarnings.toLocaleString()}</p><p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{t("admin.revenue")}</p></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><RefreshCw className="w-5 h-5 text-[#1e3a5f]" /><span>{t("admin.assignNurses")}</span></h2>
              {pendingJobs.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">
                  <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <span>{t("admin.allAssigned")}</span>
                </div>
              ) : (
                <div className="divide-y space-y-4">
                  {pendingJobs.map((job) => (
                    <div key={job.id} className="pt-4 first:pt-0">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-slate-100 rounded border border-slate-200">{job.type}</span>
                          <h4 className="font-bold mt-1">{job.description}</h4>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><MapPin className="w-3.5 h-3.5" /><span>{job.locationName} &bull; {new Date(job.datetime).toLocaleString(dateLocale)}</span></p>
                        </div>
                        {assigningJobId === job.id ? (
                          <div className="flex flex-col gap-2 w-48 shrink-0">
                            <select value={selectedNurseId} onChange={(e) => setSelectedNurseId(e.target.value)} className="border rounded-lg p-2 text-xs bg-slate-50 w-full">
                              <option value="">{t("admin.selectNurse")}</option>
                              {availableNurses.map((nurse) => (<option key={nurse.uid} value={nurse.uid}>{nurse.name} ({nurse.specialty})</option>))}
                            </select>
                            <div className="flex gap-2">
                              <button onClick={() => handleAssignNurse(job.id)} disabled={loading} className="w-1/2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 rounded text-[10px]">{t("admin.assign")}</button>
                              <button onClick={() => setAssigningJobId(null)} className="w-1/2 bg-slate-100 hover:bg-slate-200 py-1.5 rounded text-[10px]">{t("admin.cancel")}</button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => { setAssigningJobId(job.id); setSelectedNurseId(""); }} className="bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] text-white font-bold py-2 px-4 rounded-xl text-xs transition">{t("admin.findNurse")}</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Layers className="w-5 h-5 text-cyan-600" /><span>{t("admin.gisTracker")}</span></h2>
              <div className="flex gap-4 text-xs font-semibold text-slate-500 mb-3 bg-slate-50 p-2.5 rounded-lg border border-dashed">
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-600 block"></span><span>{t("admin.pending")}</span></div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#2563eb] block"></span><span>{t("admin.active")}</span></div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 block"></span><span>{lang === "sw" ? "Wauguzi" : "Nurses"}</span></div>
              </div>
              <div ref={mapContainer} className="h-[300px] w-full rounded-xl border bg-slate-100 shadow-inner" style={{ zIndex: 1 }}></div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-emerald-600" /><span>{t("admin.nurseList")} ({nurses.length})</span></h2>
              <div className="divide-y space-y-3.5">
                {nurses.map((nurse) => (
                  <div key={nurse.uid} className="pt-3.5 first:pt-0 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <img src={nurse.avatar || "https://images.unsplash.com/photo-1676552055618-22ec8cde399a?w=120"} alt={nurse.name} className="w-9 h-9 rounded-full object-cover border shadow-sm" />
                      <div>
                        <h4 className="font-bold">{nurse.name}</h4>
                        <p className="text-[10px] text-slate-400">{nurse.specialty}</p>
                        {nurse.tnmcNumber && <p className="text-[10px] text-slate-400 font-mono">TNMC: {nurse.tnmcNumber}</p>}
                        <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">TSh {nurse.hourlyRate?.toLocaleString()}{t("common.perHour")}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${nurse.available ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-400"}`}>
                        {nurse.available ? t("admin.active") : t("admin.busy")}
                      </span>
                      {nurse.verificationStatus === "verified" && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                          {lang === "sw" ? "Imethibitishwa" : "Verified"}
                        </span>
                      )}
                      {nurse.verificationStatus === "pending" && (
                        <div className="flex gap-1">
                          <button onClick={async () => { await updateUserByUid(nurse.uid, { verificationStatus: "verified" }); addNotification(lang === "sw" ? "Mhudumu Amethibitishwa" : "Nurse Verified", `${nurse.name} ${lang === "sw" ? "amethibitishwa" : "has been verified"}`, "verification_approved"); sendVerificationEmail(nurse.phone || "", nurse.name, "approved"); }} className="text-[10px] font-bold text-white bg-emerald-600 px-2 py-0.5 rounded hover:bg-emerald-700 transition">
                            {lang === "sw" ? "Idhinisha" : "Approve"}
                          </button>
                          <button onClick={async () => { await updateUserByUid(nurse.uid, { verificationStatus: "rejected" }); addNotification(lang === "sw" ? "Mhudumu Umekataliwa" : "Nurse Rejected", `${nurse.name} ${lang === "sw" ? "umekataliwa" : "has been rejected"}`, "verification_rejected"); sendVerificationEmail(nurse.phone || "", nurse.name, "rejected"); }} className="text-[10px] font-bold text-white bg-red-500 px-2 py-0.5 rounded hover:bg-red-600 transition">
                            {lang === "sw" ? "Kataa" : "Reject"}
                          </button>
                        </div>
                      )}
                      {nurse.verificationStatus === "rejected" && (
                        <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                          {lang === "sw" ? "Imekataliwa" : "Rejected"}
                        </span>
                      )}
                      {!nurse.verificationStatus && (
                        <span className="text-[10px] text-slate-400">{lang === "sw" ? "Haijathibitishwa" : "Unverified"}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0f1d35] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-white/5 rounded-full"></div>
              <h3 className="text-sm uppercase font-semibold text-slate-400 tracking-wider mb-2">{t("admin.systemSecurity")}</h3>
              <p className="text-xs leading-relaxed text-slate-300">{t("admin.securityDesc")}</p>
            </div>
          </div>
        </div>
      </main>

      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      <BottomNav role="admin" />
    </div>
  );
}
