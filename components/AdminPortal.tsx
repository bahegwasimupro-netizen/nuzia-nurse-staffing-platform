import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, UserProfile, getMockUsers } from "./auth";
import { db } from "./firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { Users, Activity, DollarSign, MapPin, CheckCircle, Clock, RefreshCw, Layers, Award, LogOut } from "lucide-react";
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
  createdAt: string;
}

const LOCAL_JOBS_KEY = "nuzia_mock_jobs";
const LOCAL_USERS_KEY = "nuzia_mock_users";

export function AdminPortal() {
  const { logout, isMock } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [nurses, setNurses] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [assigningJobId, setAssigningJobId] = useState<string | null>(null);
  const [selectedNurseId, setSelectedNurseId] = useState<string>("");

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
      return () => { unsubJobs(); unsubNurses(); };
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
      jobs.forEach((job) => {
        if (!job.location) return;
        const [lat, lng] = job.location.split(",").map(Number);
        if (isNaN(lat) || isNaN(lng)) return;
        const isPending = job.status === "Pending Assignment";
        const marker = L.marker([lat, lng], { icon: isPending ? redIcon : blueIcon }).bindPopup(`<div style="font-family:sans-serif; font-size:12px;"><b style="color:${isPending ? '#dc2626' : '#2563eb'}">${job.type}</b><br/><b>Mteja:</b> ${job.clientName}<br/><b>Hali:</b> ${isPending ? "Inasubiri" : "Iliyopangwa"}<br/><b>Maelezo:</b> ${job.description.slice(0, 50)}...</div>`);
        if (markersGroup.current) marker.addTo(markersGroup.current);
      });
      const nurseCoords: Record<string, [number, number]> = { "nurse-mock-1": [-6.8150, 39.2780], "nurse-mock-2": [-6.8280, 39.2950] };
      nurses.forEach((nurse) => {
        if (!nurse.available) return;
        let lat = -6.8200, lng = 39.2800;
        if (nurseCoords[nurse.uid]) { [lat, lng] = nurseCoords[nurse.uid]; }
        else { lat += (Math.random() - 0.5) * 0.05; lng += (Math.random() - 0.5) * 0.05; }
        const marker = L.marker([lat, lng], { icon: greenIcon }).bindPopup(`<div style="font-family:sans-serif; font-size:12px;"><b style="color:#059669">${nurse.name}</b><br/><b>Ujuzi:</b> ${nurse.specialty}<br/><b>Bei:</b> TSh ${nurse.hourlyRate?.toLocaleString()}/saa<br/><span style="color:#059669; font-weight:bold;">Muuguzi Tayari</span></div>`);
        if (markersGroup.current) marker.addTo(markersGroup.current);
      });
    }
  }, [jobs, nurses]);

  const handleAssignNurse = async (jobId: string) => {
    if (!selectedNurseId) { alert("Tafadhali chagua muuguzi!"); return; }
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
    setLoading(false); setAssigningJobId(null); setSelectedNurseId(""); alert("Muuguzi Amepangiwa Kazi!");
  };

  const handleLogout = () => { logout(); navigate("/"); };
  const pendingJobs = jobs.filter(j => j.status === "Pending Assignment");
  const activeJobs = jobs.filter(j => j.status === "Nurse Assigned" || j.status === "Care in Progress");
  const availableNurses = nurses.filter(n => n.available);
  const totalEarnings = jobs.filter(j => j.paymentStatus === "Paid").reduce((sum, j) => { const rate = j.type.includes("ICU") ? 75000 : j.type.includes("Moyo") ? 65000 : 45000; return sum + rate; }, 0);

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
              <span className="text-xs text-slate-400 block">Administrative Center</span>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition">
            <LogOut className="w-4 h-4" /><span>Ondoka</span>
          </button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-slate-500">Udhibiti na mgawanyo wa huduma za afya Nuzia</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><Clock className="w-6 h-6" /></div>
            <div><p className="text-2xl font-bold">{pendingJobs.length}</p><p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Inasubiri</p></div>
          </div>
          <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center"><Activity className="w-6 h-6" /></div>
            <div><p className="text-2xl font-bold">{activeJobs.length}</p><p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Active</p></div>
          </div>
          <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><Users className="w-6 h-6" /></div>
            <div><p className="text-2xl font-bold">{availableNurses.length}</p><p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Wauguzi Tayari</p></div>
          </div>
          <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#1e3a5f]/10 text-[#1e3a5f] flex items-center justify-center"><DollarSign className="w-6 h-6" /></div>
            <div><p className="text-2xl font-bold">TSh {totalEarnings.toLocaleString()}</p><p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Mapato</p></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><RefreshCw className="w-5 h-5 text-[#1e3a5f]" /><span>Panga Wauguzi</span></h2>
              {pendingJobs.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">
                  <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <span>Maombi yote yameshapangiwa wauguzi!</span>
                </div>
              ) : (
                <div className="divide-y space-y-4">
                  {pendingJobs.map((job) => (
                    <div key={job.id} className="pt-4 first:pt-0">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-slate-100 rounded border border-slate-200">{job.type}</span>
                          <h4 className="font-bold mt-1">{job.description}</h4>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><MapPin className="w-3.5 h-3.5" /><span>{job.locationName} &bull; {new Date(job.datetime).toLocaleString("sw-TZ")}</span></p>
                        </div>
                        {assigningJobId === job.id ? (
                          <div className="flex flex-col gap-2 w-48 shrink-0">
                            <select value={selectedNurseId} onChange={(e) => setSelectedNurseId(e.target.value)} className="border rounded-lg p-2 text-xs bg-slate-50 w-full">
                              <option value="">-- Chagua Muuguzi --</option>
                              {availableNurses.map((nurse) => (<option key={nurse.uid} value={nurse.uid}>{nurse.name} ({nurse.specialty})</option>))}
                            </select>
                            <div className="flex gap-2">
                              <button onClick={() => handleAssignNurse(job.id)} disabled={loading} className="w-1/2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 rounded text-[10px]">Panga</button>
                              <button onClick={() => setAssigningJobId(null)} className="w-1/2 bg-slate-100 hover:bg-slate-200 py-1.5 rounded text-[10px]">Ghairi</button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => { setAssigningJobId(job.id); setSelectedNurseId(""); }} className="bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] text-white font-bold py-2 px-4 rounded-xl text-xs transition">Tafuta Muuguzi</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Layers className="w-5 h-5 text-cyan-600" /><span>Nuzia Live GIS Tracker</span></h2>
              <div className="flex gap-4 text-xs font-semibold text-slate-500 mb-3 bg-slate-50 p-2.5 rounded-lg border border-dashed">
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-600 block"></span><span>Inasubiri</span></div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#2563eb] block"></span><span>Active</span></div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 block"></span><span>Wauguzi</span></div>
              </div>
              <div ref={mapContainer} className="h-[300px] w-full rounded-xl border bg-slate-100 shadow-inner" style={{ zIndex: 1 }}></div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-emerald-600" /><span>Orodha ya Wauguzi ({nurses.length})</span></h2>
              <div className="divide-y space-y-3.5">
                {nurses.map((nurse) => (
                  <div key={nurse.uid} className="pt-3.5 first:pt-0 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <img src={nurse.avatar || "https://images.unsplash.com/photo-1676552055618-22ec8cde399a?w=120"} alt={nurse.name} className="w-9 h-9 rounded-full object-cover border shadow-sm" />
                      <div>
                        <h4 className="font-bold">{nurse.name}</h4>
                        <p className="text-[10px] text-slate-400">{nurse.specialty}</p>
                        <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">TSh {nurse.hourlyRate?.toLocaleString()}/saa</p>
                      </div>
                    </div>
                    <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${nurse.available ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-400"}`}>
                      {nurse.available ? "Active" : "Busy"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0f1d35] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-white/5 rounded-full"></div>
              <h3 className="text-sm uppercase font-semibold text-slate-400 tracking-wider mb-2">Mfumo na Ulinzi</h3>
              <p className="text-xs leading-relaxed text-slate-300">Wauguzi wote wanasajiliwa na namba zao za <b>TNMC</b>. Hakikisha unapiga simu au kufanya uhakiki wa leseni kabla ya kumpitisha muuguzi kuwa active.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
