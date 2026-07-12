import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth";
import { db } from "./firebase";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { CheckCircle, Clock, MapPin, Calendar, LogOut, Heart, Star, Settings, Upload, MessageCircle } from "lucide-react";
import { useLang } from "./language";
import { ProfileModal } from "./ProfileModal";
import { NotificationBell } from "./NotificationBell";
import { uploadImage } from "./upload";
import { findOrCreateChat } from "./chat";
import { ChatPanel } from "./ChatPanel";
import { AvailabilitySchedule } from "./AvailabilitySchedule";

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
  const { t, lang } = useLang();
  const [assignedJobs, setAssignedJobs] = useState<Job[]>([]);
  const [loadingJobId, setLoadingJobId] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [uploadingLicense, setUploadingLicense] = useState(false);
  const [licenseProgress, setLicenseProgress] = useState(0);
  const licenseRef = useRef<HTMLInputElement>(null);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeChatName, setActiveChatName] = useState("");

  const handleLicenseUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userProfile) return;
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(lang === "sw" ? "Faili ni kubwa sana (max 10MB)" : "File too large (max 10MB)");
      return;
    }
    setUploadingLicense(true);
    setLicenseProgress(0);
    try {
      const ext = file.name.split(".").pop() || "doc";
      const url = await uploadImage(file, `licenses/${userProfile.uid}/${Date.now()}.${ext}`, setLicenseProgress);
      await updateProfile({ verificationStatus: "pending", tnmcNumber: userProfile.tnmcNumber || "" });
      setUploadingLicense(false);
    } catch {
      setUploadingLicense(false);
    }
  };

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
  const locale = lang === "sw" ? "sw-TZ" : "en-US";

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
              <span className="text-xs text-slate-400 block">{t("nurse.portal")}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="font-medium text-sm">{userProfile?.name}</p>
              <p className="text-xs text-emerald-600 font-semibold uppercase">{t("nurse.tnmcCert")}</p>
            </div>
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

      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-white rounded-2xl border p-6 shadow-sm mb-8 grid md:grid-cols-3 gap-6 items-center">
          <div className="flex items-center gap-4 md:border-r border-slate-100 pr-6">
            <img src={userProfile?.avatar || "https://images.unsplash.com/photo-1676552055618-22ec8cde399a?w=180"} alt={userProfile?.name} className="w-16 h-16 rounded-full object-cover border-2 border-[#1e3a5f] shadow-sm" />
            <div>
              <h2 className="font-bold text-lg">{userProfile?.name}</h2>
              <p className="text-sm text-[#1e3a5f] font-medium">{userProfile?.specialty || t("nurse.generalCare")}</p>
              <div className="flex items-center gap-1 text-amber-500 mt-1">
                <Star className="w-3.5 h-3.5 fill-current" /><span className="text-xs font-bold text-slate-600">4.9 ({t("nurse.rating")})</span>
              </div>
            </div>
          </div>
          <div className="space-y-1 md:border-r border-slate-100 pr-6 md:pl-2">
            <div className="flex justify-between text-sm"><span className="text-slate-500">{t("nurse.salary")}</span><span className="font-bold text-emerald-600">TSh {userProfile?.hourlyRate?.toLocaleString() || "45,000"}{t("common.perHour")}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">{t("nurse.experienceLabel")}</span><span className="font-medium">{userProfile?.experience || "Miaka 8"}</span></div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">{t("nurse.tnmcStatus")}</span>
              {userProfile?.verificationStatus === "verified" ? (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{t("nurse.approved")}</span>
              ) : userProfile?.verificationStatus === "rejected" ? (
                <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-100">{lang === "sw" ? "Imekataliwa" : "Rejected"}</span>
              ) : (
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">{lang === "sw" ? "Inasubiri" : "Pending"}</span>
              )}
            </div>
            {userProfile?.tnmcNumber && (
              <div className="flex justify-between text-sm"><span className="text-slate-500">TNMC</span><span className="font-mono text-xs">{userProfile.tnmcNumber}</span></div>
            )}
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border flex flex-col justify-center items-center">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">{t("nurse.availability")}</span>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-bold ${userProfile?.available ? "text-emerald-600" : "text-slate-400"}`}>{userProfile?.available ? t("nurse.availableStatus") : t("nurse.unavailableStatus")}</span>
              <button onClick={handleToggleAvailability} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${userProfile?.available ? "bg-emerald-500" : "bg-slate-300"}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${userProfile?.available ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          </div>
        </div>

        {userProfile?.verificationStatus !== "verified" && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center"><Upload className="w-5 h-5 text-amber-600" /></div>
              <div>
                <p className="text-sm font-bold text-amber-800">{lang === "sw" ? "Weka Leseni ya TNMC" : "Upload TNMC License"}</p>
                <p className="text-xs text-amber-600">{userProfile?.verificationStatus === "rejected" ? (lang === "sw" ? "Leseni yako imeshindikwa. Tafadhali weka upya." : "Your license was rejected. Please re-upload.") : (lang === "sw" ? "Weka leseni yako ya TNMC kupata uthibitisho" : "Upload your TNMC license for verification")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {uploadingLicense && <span className="text-xs text-amber-700 font-semibold">{licenseProgress}%</span>}
              <button onClick={() => licenseRef.current?.click()} disabled={uploadingLicense} className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition disabled:opacity-50 flex items-center gap-2">
                <Upload className="w-4 h-4" /><span>{uploadingLicense ? (lang === "sw" ? "Inapakia..." : "Uploading...") : (lang === "sw" ? "Weka Faili" : "Choose File")}</span>
              </button>
              <input ref={licenseRef} type="file" accept="image/*,.pdf" onChange={handleLicenseUpload} className="hidden" />
            </div>
          </div>
        )}

        <div className="mt-6">
          <AvailabilitySchedule />
        </div>

        <div className="space-y-6 mt-6">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2"><Heart className="w-5 h-5 text-red-500 fill-current" /><span>{t("nurse.assignedJobs")} ({activeTasks.length})</span></h3>
            <p className="text-sm text-slate-500">{t("nurse.jobDesc")}</p>
          </div>

          {activeTasks.length === 0 ? (
            <div className="bg-white rounded-2xl border p-12 text-center shadow-sm">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3"><Clock className="w-6 h-6" /></div>
              <h4 className="font-semibold">{t("nurse.noJobs")}</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">{t("nurse.noJobsDesc")}</p>
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
                      {job.status === "Nurse Assigned" ? t("nurse.assignedStatus") : t("nurse.inProgressStatus")}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6 text-sm">
                    <div className="space-y-2.5">
                      <h5 className="font-semibold text-xs text-slate-400 uppercase tracking-wider">{t("nurse.clientLocation")}</h5>
                      <p className="font-bold">{job.clientName}</p>
                      <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400" /><span>{job.locationName}</span></div>
                      <button onClick={async () => {
                        if (!userProfile) return;
                        const chatId = await findOrCreateChat(job.clientId, job.clientName, userProfile.uid, userProfile.name, job.id, isMock);
                        setActiveChatId(chatId);
                        setActiveChatName(job.clientName);
                      }} className="flex items-center gap-1.5 text-xs font-semibold text-[#1e3a5f] hover:text-[#2563eb] transition mt-2">
                        <MessageCircle className="w-3.5 h-3.5" />{lang === "sw" ? "Zungumza na Mteja" : "Chat with Client"}
                      </button>
                    </div>
                    <div className="space-y-2.5">
                      <h5 className="font-semibold text-xs text-slate-400 uppercase tracking-wider">{t("nurse.timeLabel")}</h5>
                      <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400" /><span>{new Date(job.datetime).toLocaleDateString(locale)}</span></div>
                      <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400" /><span>{new Date(job.datetime).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}</span></div>
                    </div>
                    <div className="flex flex-col justify-end">
                      {job.status === "Nurse Assigned" && (
                        <button disabled={loadingJobId === job.id} onClick={() => handleUpdateStatus(job.id, "Care in Progress")} className="w-full bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] text-white font-bold py-3 px-4 rounded-xl shadow-md transition text-center">
                          {loadingJobId === job.id ? t("nurse.registering") : t("nurse.startTravel")}
                        </button>
                      )}
                      {job.status === "Care in Progress" && (
                        <button disabled={loadingJobId === job.id} onClick={() => handleUpdateStatus(job.id, "Completed")} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition text-center">
                          {loadingJobId === job.id ? t("nurse.registering") : t("nurse.completeService")}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-6">
            <h3 className="text-lg font-bold mb-4">{t("nurse.completedJobs")} ({completedTasks.length})</h3>
            {completedTasks.length === 0 ? (
              <p className="text-xs text-slate-400 italic">{t("nurse.noCompleted")}</p>
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
                        {job.paymentStatus === "Paid" ? t("nurse.paymentReceived") : t("nurse.awaitingPayment")}
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

      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      {activeChatId && <ChatPanel chatId={activeChatId} otherName={activeChatName} isOpen={true} onClose={() => setActiveChatId(null)} />}
    </div>
  );
}
