import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, UserProfile } from "./auth";
import { useLang } from "./language";
import { db } from "./firebase";
import { collection, addDoc, query, where, onSnapshot, doc, updateDoc, getDocs } from "firebase/firestore";
import { MapPin, Calendar, Clock, Clipboard, CheckCircle, CreditCard, Plus, LogOut, ArrowRight, User, Sparkles, Settings } from "lucide-react";
import L from "leaflet";
import { findBestNurse } from "./matching";
import { ProfileModal } from "./ProfileModal";

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
  createdAt: string;
}

const LOCAL_JOBS_KEY = "nuzia_mock_jobs";

export function ClientPortal() {
  const { userProfile, logout, isMock } = useAuth();
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [jobType, setJobType] = useState("Home Care Visit");
  const [locationCoords, setLocationCoords] = useState("-6.8200, 39.2800");
  const [locationName, setLocationName] = useState("Dar es Salaam");
  const [dateTime, setDateTime] = useState("");
  const [description, setDescription] = useState("");

  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [payingJob, setPayingJob] = useState<Job | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "airtel" | "card">("mpesa");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [matchResult, setMatchResult] = useState<{ nurseName: string; auto: boolean } | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const locale = lang === "sw" ? "sw-TZ" : "en-US";

  useEffect(() => {
    if (!userProfile) return;
    if (isMock) {
      const getLocalJobs = () => {
        const local = localStorage.getItem(LOCAL_JOBS_KEY);
        if (!local) {
          const initialJobs: Job[] = [
            {
              id: "job-mock-1",
              clientId: userProfile.uid,
              clientName: userProfile.name,
              type: "ICU Specialist",
              location: "-6.8150, 39.2780",
              locationName: "Upanga, Dar es Salaam",
              datetime: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
              description: "Mgonjwa anahitaji uangalizi wa ICU na mashine ya kupumulia nyumbani.",
              status: "Nurse Assigned",
              paymentStatus: "Unpaid",
              assignedNurseId: "nurse-mock-1",
              assignedNurseName: "Fatuma Mwalimu, RN",
              assignedNursePhone: "+255 754 987 654",
              createdAt: new Date().toISOString()
            }
          ];
          localStorage.setItem(LOCAL_JOBS_KEY, JSON.stringify(initialJobs));
          return initialJobs;
        }
        return JSON.parse(local).filter((j: Job) => j.clientId === userProfile.uid);
      };
      setJobs(getLocalJobs());
      const interval = setInterval(() => {
        const local = localStorage.getItem(LOCAL_JOBS_KEY);
        if (local) setJobs(JSON.parse(local).filter((j: Job) => j.clientId === userProfile.uid));
      }, 3000);
      return () => clearInterval(interval);
    } else {
      try {
        const q = query(collection(db, "jobs"), where("clientId", "==", userProfile.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const loadedJobs: Job[] = [];
          snapshot.forEach((doc) => loadedJobs.push({ id: doc.id, ...doc.data() } as Job));
          setJobs(loadedJobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        }, (err) => console.warn("Firestore listener failed:", err));
        return () => unsubscribe();
      } catch (e) { console.error(e); }
    }
  }, [userProfile, isMock]);

  useEffect(() => {
    if (isModalOpen && mapRef.current && !leafletMap.current) {
      setTimeout(() => {
        if (!mapRef.current) return;
        const map = L.map(mapRef.current).setView([-6.8200, 39.2800], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
        const marker = L.marker([-6.8200, 39.2800], { draggable: true }).addTo(map);
        markerRef.current = marker;
        leafletMap.current = map;
        marker.on("dragend", () => { const ll = marker.getLatLng(); setLocationCoords(`${ll.lat.toFixed(4)}, ${ll.lng.toFixed(4)}`); });
        map.on("click", (e) => { marker.setLatLng(e.latlng); setLocationCoords(`${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`); });
      }, 300);
    }
    return () => { if (leafletMap.current) { leafletMap.current.remove(); leafletMap.current = null; markerRef.current = null; } };
  }, [isModalOpen]);

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateTime || !description || !userProfile) { alert(t("client.fillAll")); return; }
    setLoading(true);
    const jobData = { clientId: userProfile.uid, clientName: userProfile.name, type: jobType, location: locationCoords, locationName, datetime: dateTime, description, status: "Pending Assignment" as const, paymentStatus: "Unpaid" as const, createdAt: new Date().toISOString() };
    let newJobId = "";
    if (isMock) {
      const current = localStorage.getItem(LOCAL_JOBS_KEY);
      const allJobs = current ? JSON.parse(current) : [];
      newJobId = "job-mock-" + Date.now();
      allJobs.push({ id: newJobId, ...jobData });
      localStorage.setItem(LOCAL_JOBS_KEY, JSON.stringify(allJobs));
      setJobs(allJobs.filter((j: Job) => j.clientId === userProfile.uid));
    } else {
      try {
        const docRef = await addDoc(collection(db, "jobs"), jobData);
        newJobId = docRef.id;
      } catch (err) {
        console.error("Firestore post failed:", err);
        const current = localStorage.getItem(LOCAL_JOBS_KEY);
        const allJobs = current ? JSON.parse(current) : [];
        newJobId = "job-mock-" + Date.now();
        allJobs.push({ id: newJobId, ...jobData });
        localStorage.setItem(LOCAL_JOBS_KEY, JSON.stringify(allJobs));
      }
    }

    // Auto-match: find best nurse
    try {
      let availableNurses: UserProfile[] = [];
      let activeJobCounts: Record<string, number> = {};
      if (isMock) {
        const usersRaw = localStorage.getItem("nuzia_mock_users");
        if (usersRaw) {
          const allUsers: UserProfile[] = JSON.parse(usersRaw);
          availableNurses = allUsers.filter((u) => u.role === "nurse" && u.available === true);
        }
        const jobsRaw = localStorage.getItem(LOCAL_JOBS_KEY);
        if (jobsRaw) {
          const allJobs: Job[] = JSON.parse(jobsRaw);
          allJobs.forEach((j) => {
            if (j.assignedNurseId && j.status !== "Completed") {
              activeJobCounts[j.assignedNurseId] = (activeJobCounts[j.assignedNurseId] || 0) + 1;
            }
          });
        }
      } else {
        const nurseSnap = await getDocs(query(collection(db, "users"), where("role", "==", "nurse"), where("available", "==", true)));
        nurseSnap.forEach((d) => availableNurses.push({ uid: d.id, ...d.data() } as UserProfile));
      }
      const best = findBestNurse({ type: jobType, location: locationCoords }, availableNurses, activeJobCounts);
      if (best) {
        const assignedJob = { status: "Nurse Assigned", assignedNurseId: best.uid, assignedNurseName: best.name, assignedNursePhone: best.phone || "" };
        if (isMock) {
          const current = localStorage.getItem(LOCAL_JOBS_KEY);
          if (current) {
            const all = JSON.parse(current);
            const idx = all.findIndex((j: Job) => j.id === newJobId);
            if (idx !== -1) { Object.assign(all[idx], assignedJob); localStorage.setItem(LOCAL_JOBS_KEY, JSON.stringify(all)); }
          }
          const usersRaw = localStorage.getItem("nuzia_mock_users");
          if (usersRaw) {
            const allUsers: UserProfile[] = JSON.parse(usersRaw);
            const nIdx = allUsers.findIndex((u) => u.uid === best.uid);
            if (nIdx !== -1) { allUsers[nIdx].available = false; localStorage.setItem("nuzia_mock_users", JSON.stringify(allUsers)); }
          }
        } else {
          await updateDoc(doc(db, "jobs", newJobId), assignedJob);
          await updateDoc(doc(db, "users", best.uid), { available: false });
        }
        setMatchResult({ nurseName: best.name, auto: true });
        setTimeout(() => setMatchResult(null), 5000);
      }
    } catch (e) {
      console.warn("Auto-match failed, job saved as pending:", e);
    }

    setLoading(false); setIsModalOpen(false); setDateTime(""); setDescription(""); setLocationCoords("-6.8200, 39.2800"); setLocationName("Dar es Salaam");
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingJob) return;
    setIsProcessingPayment(true);
    setTimeout(async () => {
      if (isMock) {
        const current = localStorage.getItem(LOCAL_JOBS_KEY);
        if (current) { const all = JSON.parse(current); const idx = all.findIndex((j: Job) => j.id === payingJob.id); if (idx !== -1) { all[idx].paymentStatus = "Paid"; localStorage.setItem(LOCAL_JOBS_KEY, JSON.stringify(all)); } }
      } else {
        try { await updateDoc(doc(db, "jobs", payingJob.id), { paymentStatus: "Paid" }); } catch (e) { console.error("Firestore update failed", e); }
      }
      setIsProcessingPayment(false); setPayingJob(null); setPhoneNumber(""); alert(t("client.paymentComplete"));
    }, 2000);
  };

  const handleLogout = () => { logout(); navigate("/"); };

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
              <span className="text-xs text-slate-400 block">{t("client.dashboard")}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="font-medium text-sm">{userProfile?.name}</p>
              <p className="text-xs text-emerald-600 font-semibold capitalize">{userProfile?.role} (Mteja)</p>
            </div>
            <button onClick={() => setIsProfileOpen(true)} className="flex items-center gap-2 px-3 py-2 text-sm text-[#1e3a5f] bg-[#1e3a5f]/5 hover:bg-[#1e3a5f]/10 rounded-lg transition">
              <Settings className="w-4 h-4" />
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition">
              <LogOut className="w-4 h-4" /><span>{t("common.logout")}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{t("client.myServices")}</h1>
            <p className="text-slate-500">{t("client.subtitle")}</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] text-white px-5 py-3 rounded-xl font-semibold shadow-lg transition-all hover:scale-105 active:scale-95">
            <Plus className="w-5 h-5" /><span>{t("client.requestNew")}</span>
          </button>
        </div>

        {isMock && (
          <div className="mb-6 bg-cyan-50 border border-cyan-200 text-cyan-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-ping"></span>
            <span>{t("client.mockMode")}</span>
          </div>
        )}

        {matchResult && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{lang === "sw" ? `Muuguzi ${matchResult.nurseName} amepangiwa kiotomatiki!` : `Nurse ${matchResult.nurseName} auto-assigned!`}</span>
          </div>
        )}

        {jobs.length === 0 ? (
          <div className="bg-white rounded-2xl border p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-[#1e3a5f]/5 text-[#1e3a5f] rounded-full flex items-center justify-center mx-auto mb-4"><Clipboard className="w-8 h-8" /></div>
            <h3 className="text-xl font-semibold mb-1">{t("client.noJobs")}</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">{t("client.noJobsDesc")}</p>
            <button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] text-white px-6 py-2.5 rounded-xl font-medium shadow-sm transition hover:opacity-90">{t("client.startFirst")}</button>
          </div>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition duration-200">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4 pb-4 border-b border-slate-100">
                  <div>
                    <span className="inline-block text-xs font-semibold px-2.5 py-1 bg-[#1e3a5f]/5 text-[#1e3a5f] rounded-full mb-2">{job.type}</span>
                    <h3 className="text-lg font-bold">{job.description.slice(0, 70)}...</h3>
                    <p className="text-xs text-slate-400 mt-1">{t("client.requestId")} {job.id}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${job.status === "Pending Assignment" ? "bg-amber-100 text-amber-800 border border-amber-200" : job.status === "Nurse Assigned" ? "bg-blue-100 text-blue-800 border border-blue-200" : job.status === "Care in Progress" ? "bg-indigo-100 text-indigo-800 border border-indigo-200" : "bg-emerald-100 text-emerald-800 border border-emerald-200"}`}>
                      {job.status === "Pending Assignment" ? t("common.pending") : job.status === "Nurse Assigned" ? t("common.assigned") : job.status === "Care in Progress" ? t("common.inProgress") : t("common.completed")}
                    </span>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${job.paymentStatus === "Paid" ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-700"}`}>
                      {job.paymentStatus === "Paid" ? t("common.paid") : t("common.unpaid")}
                    </span>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6 text-sm">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400" /><span>{new Date(job.datetime).toLocaleDateString(locale)}</span></div>
                    <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400" /><span>{new Date(job.datetime).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}</span></div>
                    <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400" /><span>{job.locationName}</span></div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h4 className="font-semibold text-xs text-slate-400 uppercase tracking-wider mb-2">{t("client.yourNurse")}</h4>
                    {job.assignedNurseName ? (
                      <div className="space-y-1">
                        <p className="font-bold flex items-center gap-1.5"><User className="w-4 h-4 text-[#1e3a5f]" />{job.assignedNurseName}</p>
                        <p className="text-xs text-slate-500">{job.assignedNursePhone}</p>
                        <div className="mt-2 text-xs flex items-center gap-1 text-emerald-600 font-semibold"><CheckCircle className="w-3.5 h-3.5" /><span>{t("client.certified")}</span></div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic pt-2">{t("client.notAssigned")}</p>
                    )}
                  </div>
                  <div className="flex flex-col justify-end">
                    {job.status === "Completed" && job.paymentStatus === "Unpaid" && (
                      <button onClick={() => setPayingJob(job)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition">
                        <CreditCard className="w-5 h-5" /><span>{t("client.payNow")}</span>
                      </button>
                    )}
                    {job.paymentStatus === "Paid" && (
                      <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-center text-emerald-700 text-xs font-semibold flex items-center justify-center gap-1.5"><CheckCircle className="w-4 h-4" /><span>{t("client.paymentReceived")}</span></div>
                    )}
                    {job.status !== "Completed" && job.paymentStatus === "Unpaid" && (
                      <div className="text-xs text-slate-400 bg-slate-50 p-4 rounded-xl border border-dashed text-center">{t("client.paymentPending")}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 min-h-[250px] bg-slate-100 relative rounded-t-2xl md:rounded-l-2xl md:rounded-t-none">
              <div className="absolute inset-0 z-0" ref={mapRef} style={{ height: "100%", width: "100%" }}></div>
              <div className="absolute top-4 left-4 bg-white/95 border px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm z-[1000] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-red-500 animate-bounce" /><span>{t("client.dragMarker")}</span>
              </div>
            </div>
            <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">{t("client.newRequestTitle")}</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-2xl font-semibold">&times;</button>
                </div>
                <form onSubmit={handlePostJob} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">{t("client.serviceType")}</label>
                    <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] bg-slate-50">
                      <option>{t("services.homeCare")} (TSh 45,000/saa)</option>
                      <option>{t("services.icu")} (TSh 75,000/saa)</option>
                      <option>{t("services.heart")} (TSh 65,000/saa)</option>
                      <option>{t("services.child")} (TSh 55,000/saa)</option>
                      <option>{t("services.general")} (TSh 50,000/saa)</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-semibold mb-1">{t("client.locationName")}</label><input type="text" required value={locationName} onChange={(e) => setLocationName(e.target.value)} placeholder="e.g. Mikocheni" className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] bg-slate-50" /></div>
                    <div><label className="block text-sm font-semibold mb-1">{t("client.mapCoords")}</label><input type="text" readOnly value={locationCoords} className="w-full border rounded-xl p-3 bg-slate-100 cursor-not-allowed font-mono text-xs" /></div>
                  </div>
                  <div><label className="block text-sm font-semibold mb-1">{t("client.dateTime")}</label><input type="datetime-local" required value={dateTime} onChange={(e) => setDateTime(e.target.value)} className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] bg-slate-50" /></div>
                  <div><label className="block text-sm font-semibold mb-1">{t("client.description")}</label><textarea rows={3} required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Mgonjwa ni mzee, anahitaji huduma ya kusafisha vidonda..." className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] bg-slate-50"></textarea></div>
                  <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="w-1/2 bg-slate-100 hover:bg-slate-200 font-bold py-3 px-4 rounded-xl transition">{t("client.cancel")}</button>
                    <button type="submit" disabled={loading} className="w-1/2 bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2">{loading ? t("client.submitting") : t("client.submitRequest")}<ArrowRight className="w-4 h-4" /></button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {payingJob && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{t("client.payTitle")}</h2>
              <button onClick={() => setPayingJob(null)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border mb-6 text-sm space-y-2">
              <div className="flex justify-between"><span>{t("client.serviceTypeLabel")}</span><span className="font-semibold">{payingJob.type}</span></div>
              <div className="flex justify-between"><span>{t("client.locationLabel")}</span><span className="font-semibold">{payingJob.locationName}</span></div>
              <div className="flex justify-between"><span>{t("client.nurseLabel")}</span><span className="font-semibold">{payingJob.assignedNurseName}</span></div>
              <div className="border-t pt-2 flex justify-between font-bold"><span>{t("client.amountLabel")}</span><span className="text-emerald-600">TSh {payingJob.type.includes("ICU") ? "75,000" : "45,000"}/saa</span></div>
            </div>
            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">{t("client.choosePayment")}</label>
                <div className="grid grid-cols-3 gap-3">
                  <button type="button" onClick={() => setPaymentMethod("mpesa")} className={`py-2 px-3 border rounded-lg text-xs font-bold transition-all ${paymentMethod === "mpesa" ? "border-emerald-600 bg-emerald-50 text-emerald-800" : "bg-slate-50"}`}>M-Pesa</button>
                  <button type="button" onClick={() => setPaymentMethod("airtel")} className={`py-2 px-3 border rounded-lg text-xs font-bold transition-all ${paymentMethod === "airtel" ? "border-red-600 bg-red-50 text-red-800" : "bg-slate-50"}`}>Airtel Money</button>
                  <button type="button" onClick={() => setPaymentMethod("card")} className={`py-2 px-3 border rounded-lg text-xs font-bold transition-all ${paymentMethod === "card" ? "border-[#1e3a5f] bg-[#1e3a5f]/5 text-[#1e3a5f]" : "bg-slate-50"}`}>Kadi</button>
                </div>
              </div>
              {paymentMethod !== "card" ? (
                <div>
                  <label className="block text-sm font-semibold mb-1">{t("client.phoneNumber")}</label>
                  <input type="tel" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="0754 123 456" className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-slate-50" />
                </div>
              ) : (
                <div className="space-y-3">
                  <div><label className="block text-sm font-semibold mb-1">{t("client.cardNumber")}</label><input type="text" required placeholder="4000 1234 5678 9010" className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] bg-slate-50 font-mono text-sm" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-semibold mb-1">MM/YY</label><input type="text" required placeholder="12/28" className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] bg-slate-50 font-mono text-sm text-center" /></div>
                    <div><label className="block text-sm font-semibold mb-1">CVV</label><input type="password" maxLength={3} required placeholder="123" className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] bg-slate-50 font-mono text-sm text-center" /></div>
                  </div>
                </div>
              )}
              <button type="submit" disabled={isProcessingPayment} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 mt-4">
                {isProcessingPayment ? t("client.processing") : t("client.payNowBtn")}
              </button>
            </form>
          </div>
        </div>
      )}

      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
}
