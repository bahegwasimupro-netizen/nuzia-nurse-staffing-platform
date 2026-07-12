import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth";
import { db } from "./firebase";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { CheckCircle, Clock, MapPin, Calendar, LogOut, Heart, Star } from "lucide-react";

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
  createdAt: string;
}

const LOCAL_JOBS_KEY = "nuzia_mock_jobs";

export function NursePortal() {
  const { userProfile, updateProfile, logout, isMock } = useAuth();
  const navigate = useNavigate();
  const [assignedJobs, setAssignedJobs] = useState<Job[]>([]);
  const [loadingJobId, setLoadingJobId] = useState<string | null>(null);

  useEffect(() => {
    if (!userProfile) return;
    if (isMock) {
      const getLocalJobs = () => {
        const local = localStorage.getItem(LOCAL_JOBS_KEY);
        if (!local) return [];
        return JSON.parse(local).filter((j: Job) => j.assignedNurseId === userProfile.uid);
      };
      setAssignedJobs(getLocalJobs());
      const interval = setInterval(() => {
        const local = localStorage.getItem(LOCAL_JOBS_KEY);
        if (local) setAssignedJobs(JSON.parse(local).filter((j: Job) => j.assignedNurseId === userProfile.uid));
      }, 3000);
      return () => clearInterval(interval);
    } else {
      try {
        const q = query(collection(db, "jobs"), where("assignedNurseId", "==", userProfile.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const loaded: Job[] = [];
          snapshot.forEach((doc) => loaded.push({ id: doc.id, ...doc.data() } as Job));
          setAssignedJobs(loaded.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        });
        return () => unsubscribe();
      } catch (e) { console.error(e); }
    }
  }, [userProfile, isMock]);

  const handleToggleAvailability = async () => {
    if (!userProfile) return;
    await updateProfile({ available: !userProfile.available });
  };

  const handleUpdateStatus = async (jobId: string, nextStatus: "Care in Progress" | "Completed") => {
    setLoadingJobId(jobId);
    setTimeout(async () => {
      if (isMock) {
        const current = localStorage.getItem(LOCAL_JOBS_KEY);
        if (current) { const all = JSON.parse(current); const idx = all.findIndex((j: Job) => j.id === jobId); if (idx !== -1) { all[idx].status = nextStatus; localStorage.setItem(LOCAL_JOBS_KEY, JSON.stringify(all)); } }
      } else {
        try { await updateDoc(doc(db, "jobs", jobId), { status: nextStatus }); } catch (e) { console.error("Firestore update failed", e); }
      }
      setLoadingJobId(null);
    }, 1000);
  };

  const handleLogout = () => { logout(); navigate("/"); };
  const activeTasks = assignedJobs.filter(j => j.status !== "Completed");
  const completedTasks = assignedJobs.filter(j => j.status === "Completed");

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
              <span className="text-xs text-slate-400 block">Nurse Practitioner Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="font-medium text-sm">{userProfile?.name}</p>
              <p className="text-xs text-emerald-600 font-semibold uppercase">TNMC Certified</p>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition">
              <LogOut className="w-4 h-4" /><span>Ondoka</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-white rounded-2xl border p-6 shadow-sm mb-8 grid md:grid-cols-3 gap-6 items-center">
          <div className="flex items-center gap-4 md:border-r border-slate-100 pr-6">
            <img src={userProfile?.avatar || "https://images.unsplash.com/photo-1676552055618-22ec8cde399a?w=180"} alt={userProfile?.name} className="w-16 h-16 rounded-full object-cover border-2 border-[#1e3a5f] shadow-sm" />
            <div>
              <h2 className="font-bold text-lg">{userProfile?.name}</h2>
              <p className="text-sm text-[#1e3a5f] font-medium">{userProfile?.specialty || "Huduma za Jumla"}</p>
              <div className="flex items-center gap-1 text-amber-500 mt-1">
                <Star className="w-3.5 h-3.5 fill-current" /><span className="text-xs font-bold text-slate-600">4.9 (Ukadiriaji)</span>
              </div>
            </div>
          </div>
          <div className="space-y-1 md:border-r border-slate-100 pr-6 md:pl-2">
            <div className="flex justify-between text-sm"><span className="text-slate-500">Mshahara:</span><span className="font-bold text-emerald-600">TSh {userProfile?.hourlyRate?.toLocaleString() || "45,000"}/saa</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Uzoefu:</span><span className="font-medium">{userProfile?.experience || "Miaka 8"}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Hali ya TNMC:</span><span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Kipitishwa</span></div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border flex flex-col justify-center items-center">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">Upatikanaji Wangu</span>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-bold ${userProfile?.available ? "text-emerald-600" : "text-slate-400"}`}>{userProfile?.available ? "Niko Tayari Kazi" : "Siko Kazini"}</span>
              <button onClick={handleToggleAvailability} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${userProfile?.available ? "bg-emerald-500" : "bg-slate-300"}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${userProfile?.available ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2"><Heart className="w-5 h-5 text-red-500 fill-current" /><span>Kazi Nilizopangiwa ({activeTasks.length})</span></h3>
            <p className="text-sm text-slate-500">Kazi zenye uhitaji wa utendaji wako kwa sasa</p>
          </div>

          {activeTasks.length === 0 ? (
            <div className="bg-white rounded-2xl border p-12 text-center shadow-sm">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3"><Clock className="w-6 h-6" /></div>
              <h4 className="font-semibold">Hakuna Kazi Bado</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Weka hali yako kama <b>"Niko Tayari Kazi"</b> ili msimamizi akupangie wagonjwa.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {activeTasks.map((job) => (
                <div key={job.id} className="bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4 pb-4 border-b border-slate-100">
                    <div>
                      <span className="inline-block text-xs font-semibold px-2 py-0.5 bg-[#1e3a5f]/5 text-[#1e3a5f] rounded border border-[#1e3a5f]/10 mb-2">{job.type}</span>
                      <h4 className="text-base font-bold">{job.description}</h4>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${job.status === "Nurse Assigned" ? "bg-amber-100 text-amber-800 border border-amber-200" : "bg-indigo-100 text-indigo-800 border border-indigo-200"}`}>
                      {job.status === "Nurse Assigned" ? "Imepangwa - Inasubiri Kusafiri" : "Huduma Inaendelea"}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6 text-sm">
                    <div className="space-y-2.5">
                      <h5 className="font-semibold text-xs text-slate-400 uppercase tracking-wider">Mteja / Mahali</h5>
                      <p className="font-bold">{job.clientName}</p>
                      <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400" /><span>{job.locationName}</span></div>
                    </div>
                    <div className="space-y-2.5">
                      <h5 className="font-semibold text-xs text-slate-400 uppercase tracking-wider">Muda</h5>
                      <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400" /><span>{new Date(job.datetime).toLocaleDateString("sw-TZ")}</span></div>
                      <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400" /><span>{new Date(job.datetime).toLocaleTimeString("sw-TZ", { hour: '2-digit', minute: '2-digit' })}</span></div>
                    </div>
                    <div className="flex flex-col justify-end">
                      {job.status === "Nurse Assigned" && (
                        <button disabled={loadingJobId === job.id} onClick={() => handleUpdateStatus(job.id, "Care in Progress")} className="w-full bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] text-white font-bold py-3 px-4 rounded-xl shadow-md transition text-center">
                          {loadingJobId === job.id ? "Inasajili..." : "Anza Safari"}
                        </button>
                      )}
                      {job.status === "Care in Progress" && (
                        <button disabled={loadingJobId === job.id} onClick={() => handleUpdateStatus(job.id, "Completed")} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition text-center">
                          {loadingJobId === job.id ? "Inasajili..." : "Kamilisha Huduma"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-6">
            <h3 className="text-lg font-bold mb-4">Kazi Zilizokamilika ({completedTasks.length})</h3>
            {completedTasks.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Bado hujakamilisha kazi yoyote.</p>
            ) : (
              <div className="bg-white rounded-xl border divide-y shadow-sm">
                {completedTasks.map((job) => (
                  <div key={job.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm">
                    <div>
                      <p className="font-bold">{job.type}</p>
                      <p className="text-xs text-slate-500">{job.clientName} &bull; {job.locationName}</p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${job.paymentStatus === "Paid" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"}`}>
                        {job.paymentStatus === "Paid" ? "Malipo Yamepokelewa" : "Inasubiri Malipo"}
                      </span>
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
