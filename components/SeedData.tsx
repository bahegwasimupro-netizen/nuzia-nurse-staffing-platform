import { useState } from "react";
import { db } from "./firebase";
import { doc, setDoc, collection, writeBatch } from "firebase/firestore";
import { Database, CheckCircle, Loader2 } from "lucide-react";
import { useLang } from "./language";

const seedNurses = [
  { uid: "nurse_001", name: "Fatuma Mwalimu", role: "nurse", specialty: "Home Care", experience: "8 years", tnmcNumber: "TNMC-2019-001", phone: "+255712345001", hourlyRate: 45000, available: true, verificationStatus: "verified", location: "Kinondoni, Dar es Salaam", locationCoords: "-6.7924,39.2083", email: "fatuma@example.com" },
  { uid: "nurse_002", name: "John Massawe", role: "nurse", specialty: "ICU", experience: "12 years", tnmcNumber: "TNMC-2017-002", phone: "+255712345002", hourlyRate: 75000, available: true, verificationStatus: "verified", location: "Ilala, Dar es Salaam", locationCoords: "-6.8200,39.2700", email: "john@example.com" },
  { uid: "nurse_003", name: "Amina Juma", role: "nurse", specialty: "Pediatric", experience: "5 years", tnmcNumber: "TNMC-2021-003", phone: "+255712345003", hourlyRate: 55000, available: true, verificationStatus: "verified", location: "Temeke, Dar es Salaam", locationCoords: "-6.8800,39.2800", email: "amina@example.com" },
  { uid: "nurse_004", name: "Grace Kimaro", role: "nurse", specialty: "Maternity", experience: "10 years", tnmcNumber: "TNMC-2015-004", phone: "+255712345004", hourlyRate: 60000, available: true, verificationStatus: "verified", location: "Ubungo, Dar es Salaam", locationCoords: "-6.7700,39.2400", email: "grace@example.com" },
  { uid: "nurse_005", name: "Hassan Mwinyi", role: "nurse", specialty: "Emergency", experience: "7 years", tnmcNumber: "TNMC-2018-005", phone: "+255712345005", hourlyRate: 70000, available: true, verificationStatus: "verified", location: "Kigamboni, Dar es Salaam", locationCoords: "-6.8300,39.3000", email: "hassan@example.com" },
  { uid: "nurse_006", name: "Rehema Salum", role: "nurse", specialty: "Home Care", experience: "3 years", tnmcNumber: "TNMC-2022-006", phone: "+255712345006", hourlyRate: 40000, available: true, verificationStatus: "verified", location: "Kinondoni, Dar es Salaam", locationCoords: "-6.7850,39.2150", email: "rehema@example.com" },
  { uid: "nurse_007", name: "David Nkwera", role: "nurse", specialty: "ICU", experience: "15 years", tnmcNumber: "TNMC-2010-007", phone: "+255712345007", hourlyRate: 85000, available: true, verificationStatus: "verified", location: "Ilala, Dar es Salaam", locationCoords: "-6.8150,39.2650", email: "david@example.com" },
  { uid: "nurse_008", name: "Neema Kileo", role: "nurse", specialty: "Pediatric", experience: "4 years", tnmcNumber: "TNMC-2020-008", phone: "+255712345008", hourlyRate: 50000, available: true, verificationStatus: "verified", location: "Temeke, Dar es Salaam", locationCoords: "-6.8700,39.2900", email: "neema@example.com" },
  { uid: "nurse_009", name: "Ibrahim Mwangi", role: "nurse", specialty: "Maternity", experience: "9 years", tnmcNumber: "TNMC-2016-009", phone: "+255712345009", hourlyRate: 55000, available: true, verificationStatus: "verified", location: "Ubungo, Dar es Salaam", locationCoords: "-6.7750,39.2350", email: "ibrahim@example.com" },
  { uid: "nurse_010", name: "Zainab Bakari", role: "nurse", specialty: "Emergency", experience: "6 years", tnmcNumber: "TNMC-2019-010", phone: "+255712345010", hourlyRate: 65000, available: true, verificationStatus: "verified", location: "Kinondoni, Dar es Salaam", locationCoords: "-6.7900,39.2200", email: "zainab@example.com" },
  { uid: "nurse_011", name: "Charles Mwamba", role: "nurse", specialty: "Home Care", experience: "2 years", tnmcNumber: "TNMC-2023-011", phone: "+255712345011", hourlyRate: 35000, available: true, verificationStatus: "pending", location: "Ilala, Dar es Salaam", locationCoords: "-6.8250,39.2750", email: "charles@example.com" },
  { uid: "nurse_012", name: "Asha Omari", role: "nurse", specialty: "Pediatric", experience: "11 years", tnmcNumber: "TNMC-2014-012", phone: "+255712345012", hourlyRate: 62000, available: true, verificationStatus: "verified", location: "Kigamboni, Dar es Salaam", locationCoords: "-6.8350,39.3050", email: "asha@example.com" },
  { uid: "nurse_013", name: "Peter Shirima", role: "nurse", specialty: "ICU", experience: "13 years", tnmcNumber: "TNMC-2012-013", phone: "+255712345013", hourlyRate: 80000, available: true, verificationStatus: "verified", location: "Temeke, Dar es Salaam", locationCoords: "-6.8850,39.2850", email: "peter@example.com" },
  { uid: "nurse_014", name: "Sara Hamisi", role: "nurse", specialty: "Maternity", experience: "7 years", tnmcNumber: "TNMC-2018-014", phone: "+255712345014", hourlyRate: 52000, available: false, verificationStatus: "verified", location: "Ubungo, Dar es Salaam", locationCoords: "-6.7650,39.2450", email: "sara@example.com" },
  { uid: "nurse_015", name: "Emmanuel Kyara", role: "nurse", specialty: "Emergency", experience: "8 years", tnmcNumber: "TNMC-2017-015", phone: "+255712345015", hourlyRate: 68000, available: true, verificationStatus: "verified", location: "Kinondoni, Dar es Salaam", locationCoords: "-6.7950,39.2100", email: "emmanuel@example.com" },
];

const seedClients = [
  { uid: "client_001", name: "Asha Mwakasege", role: "client", phone: "+255713100001", email: "asha.m@example.com", location: "Oysterbay, Dar es Salaam" },
  { uid: "client_002", name: "James Kapinga", role: "client", phone: "+255713100002", email: "james.k@example.com", location: "Masaki, Dar es Salaam" },
  { uid: "client_003", name: "Maria Seni", role: "client", phone: "+255713100003", email: "maria.s@example.com", location: "Msasani, Dar es Salaam" },
  { uid: "client_004", name: "Hassan Ally", role: "client", phone: "+255713100004", email: "hassan.a@example.com", location: "Garden City, Dar es Salaam" },
  { uid: "client_005", name: "Fatima Mohamed", role: "client", phone: "+255713100005", email: "fatima.m@example.com", location: "Kivukoni, Dar es Salaam" },
  { uid: "client_006", name: "Peter Mwangoda", role: "client", phone: "+255713100006", email: "peter.m@example.com", location: "Upanga, Dar es Salaam" },
  { uid: "client_007", name: "Zulfa Juma", role: "client", phone: "+255713100007", email: "zulfa.j@example.com", location: "Tabata, Dar es Salaam" },
];

const now = new Date().toISOString();
const seedJobs = [
  { id: "job_seed_001", clientId: "client_001", clientName: "Asha Mwakasege", type: "Home Care", location: "-6.8200,39.2900", locationName: "Oysterbay", datetime: new Date(Date.now() + 86400000).toISOString(), description: "Elderly care for grandmother recovering from hip surgery", status: "Pending Assignment", paymentStatus: "Unpaid", createdAt: new Date(Date.now() - 172800000).toISOString(), amount: 45000 },
  { id: "job_seed_002", clientId: "client_002", clientName: "James Kapinga", type: "ICU", location: "-6.8300,39.2800", locationName: "Masaki", datetime: new Date(Date.now() + 172800000).toISOString(), description: "Post-surgery ICU monitoring for father", status: "Pending Assignment", paymentStatus: "Unpaid", createdAt: new Date(Date.now() - 86400000).toISOString(), amount: 75000 },
  { id: "job_seed_003", clientId: "client_003", clientName: "Maria Seni", type: "Pediatric", location: "-6.7900,39.2100", locationName: "Msasani", datetime: new Date(Date.now() - 259200000).toISOString(), description: "Night care for child with asthma", status: "Completed", paymentStatus: "Paid", assignedNurseId: "nurse_003", assignedNurseName: "Amina Juma", assignedNursePhone: "+255712345003", createdAt: new Date(Date.now() - 604800000).toISOString(), amount: 55000 },
  { id: "job_seed_004", clientId: "client_004", clientName: "Hassan Ally", type: "Maternity", location: "-6.7700,39.2400", locationName: "Garden City", datetime: new Date(Date.now() - 432000000).toISOString(), description: "Postnatal care for mother and newborn", status: "Completed", paymentStatus: "Paid", assignedNurseId: "nurse_004", assignedNurseName: "Grace Kimaro", assignedNursePhone: "+255712345004", createdAt: new Date(Date.now() - 864000000).toISOString(), amount: 60000 },
  { id: "job_seed_005", clientId: "client_005", clientName: "Fatima Mohamed", type: "Emergency", location: "-6.8100,39.2600", locationName: "Kivukoni", datetime: new Date(Date.now() - 345600000).toISOString(), description: "Emergency home care after fall injury", status: "Completed", paymentStatus: "Paid", assignedNurseId: "nurse_005", assignedNurseName: "Hassan Mwinyi", assignedNursePhone: "+255712345005", createdAt: new Date(Date.now() - 518400000).toISOString(), amount: 70000 },
  { id: "job_seed_006", clientId: "client_006", clientName: "Peter Mwangoda", type: "Home Care", location: "-6.8150,39.2700", locationName: "Upanga", datetime: new Date(Date.now() + 259200000).toISOString(), description: "Physiotherapy assistance for knee recovery", status: "Pending Assignment", paymentStatus: "Unpaid", createdAt: new Date(Date.now() - 43200000).toISOString(), amount: 45000 },
  { id: "job_seed_007", clientId: "client_007", clientName: "Zulfa Juma", type: "ICU", location: "-6.8400,39.2950", locationName: "Tabata", datetime: new Date(Date.now() + 345600000).toISOString(), description: "Ventilator monitoring for ICU patient", status: "Nurse Assigned", paymentStatus: "Unpaid", assignedNurseId: "nurse_002", assignedNurseName: "John Massawe", assignedNursePhone: "+255712345002", createdAt: new Date(Date.now() - 172800000).toISOString(), amount: 75000 },
  { id: "job_seed_008", clientId: "client_001", clientName: "Asha Mwakasege", type: "Pediatric", location: "-6.8200,39.2900", locationName: "Oysterbay", datetime: new Date(Date.now() - 604800000).toISOString(), description: "Daily pediatric visits for toddler", status: "Completed", paymentStatus: "Paid", assignedNurseId: "nurse_008", assignedNurseName: "Neema Kileo", assignedNursePhone: "+255712345008", createdAt: new Date(Date.now() - 1209600000).toISOString(), amount: 50000 },
];

const seedReviews = [
  { id: "review_001", jobId: "job_seed_003", nurseId: "nurse_003", nurseName: "Amina Juma", clientName: "Maria Seni", clientId: "client_003", rating: 5, comment: "Amina was excellent with my child. Very professional and caring.", createdAt: new Date(Date.now() - 259200000).toISOString() },
  { id: "review_002", jobId: "job_seed_004", nurseId: "nurse_004", nurseName: "Grace Kimaro", clientName: "Hassan Ally", clientId: "client_004", rating: 5, comment: "Grace provided outstanding postnatal care. Highly recommended.", createdAt: new Date(Date.now() - 345600000).toISOString() },
  { id: "review_003", jobId: "job_seed_005", nurseId: "nurse_005", nurseName: "Hassan Mwinyi", clientName: "Fatima Mohamed", clientId: "client_005", rating: 4, comment: "Hassan was very skilled and responsive during the emergency.", createdAt: new Date(Date.now() - 432000000).toISOString() },
  { id: "review_004", jobId: "job_seed_008", nurseId: "nurse_008", nurseName: "Neema Kileo", clientName: "Asha Mwakasege", clientId: "client_001", rating: 5, comment: "Neema was wonderful with my toddler. Very patient and gentle.", createdAt: new Date(Date.now() - 1036800000).toISOString() },
  { id: "review_005", jobId: "job_seed_004", nurseId: "nurse_009", nurseName: "Ibrahim Mwangi", clientName: "Hassan Ally", clientId: "client_004", rating: 4, comment: "Good care, arrived on time. Would use again.", createdAt: new Date(Date.now() - 864000000).toISOString() },
];

export function SeedData({ onComplete }: { onComplete?: () => void }) {
  const { lang } = useLang();
  const [seeding, setSeeding] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState("");

  const handleSeed = async () => {
    setSeeding(true);
    setError(null);
    try {
      setProgress(lang === "sw" ? "Inaweka wauguzi..." : "Writing nurses...");
      const batch1 = writeBatch(db);
      seedNurses.forEach((nurse) => {
        batch1.set(doc(collection(db, "users"), nurse.uid), nurse);
      });
      await batch1.commit();

      setProgress(lang === "sw" ? "Inaweka wateja..." : "Writing clients...");
      const batch2 = writeBatch(db);
      seedClients.forEach((client) => {
        batch2.set(doc(collection(db, "users"), client.uid), client);
      });
      await batch2.commit();

      setProgress(lang === "sw" ? "Inaweka kazi..." : "Writing jobs...");
      const batch3 = writeBatch(db);
      seedJobs.forEach((job) => {
        batch3.set(doc(collection(db, "jobs"), job.id), job);
      });
      await batch3.commit();

      setProgress(lang === "sw" ? "Inaweka maoni..." : "Writing reviews...");
      const batch4 = writeBatch(db);
      seedReviews.forEach((review) => {
        batch4.set(doc(collection(db, "reviews"), review.id), review);
      });
      await batch4.commit();

      setDone(true);
      onComplete?.();
    } catch (e: any) {
      setError(e.message || "Seed failed");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border p-6 shadow-sm">
      <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
        <Database className="w-5 h-5 text-[#1e3a5f]" />
        <span>{lang === "sw" ? "Weka Data ya Maonyesho" : "Seed Demo Data"}</span>
      </h2>
      <p className="text-xs text-slate-500 mb-4">
        {lang === "sw"
          ? "Ongeza wauguzi 15, wateja 7, kazi 8, na maoni 5 ya mfano kwenye Firestore."
          : "Add 15 nurses, 7 clients, 8 jobs, and 5 sample reviews to Firestore."}
      </p>

      {done ? (
        <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
          <CheckCircle className="w-5 h-5" />
          <span>{lang === "sw" ? "Data imewekwa kwa mafanikio!" : "Data seeded successfully!"}</span>
        </div>
      ) : (
        <button
          onClick={handleSeed}
          disabled={seeding}
          className="flex items-center gap-2 bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] text-white font-bold py-2 px-6 rounded-xl text-sm transition disabled:opacity-50"
        >
          {seeding ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{progress}</span>
            </>
          ) : (
            <>
              <Database className="w-4 h-4" />
              <span>{lang === "sw" ? "Weka Data" : "Seed Data"}</span>
            </>
          )}
        </button>
      )}

      {error && (
        <p className="text-xs text-red-600 mt-2">{error}</p>
      )}
    </div>
  );
}
