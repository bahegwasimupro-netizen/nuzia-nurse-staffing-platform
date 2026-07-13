#!/usr/bin/env node
/**
 * Nuzia Firestore Seed Script
 * 
 * Usage:
 *   1. Make sure you're logged into Firebase CLI: `firebase login`
 *   2. Run: `node scripts/seed.js`
 *   
 * This script uses the Google Cloud Admin SDK via Application Default Credentials.
 * It will use whatever account you're logged in with via `firebase login`.
 */

const admin = require("firebase-admin");

// Initialize with application default credentials (uses firebase login)
admin.initializeApp({
  projectId: "nuzia-3b9c0",
});

const db = admin.firestore();

const nurses = [
  { uid: "nurse_001", name: "Fatuma Mwalimu", specialty: "Home Care", experience: "8 years", tnmcNumber: "TNMC-2019-001", phone: "+255712345001", hourlyRate: 45000, available: true, verificationStatus: "verified", location: "Kinondoni", locationCoords: "-6.7924,39.2083" },
  { uid: "nurse_002", name: "John Massawe", specialty: "ICU", experience: "12 years", tnmcNumber: "TNMC-2017-002", phone: "+255712345002", hourlyRate: 75000, available: true, verificationStatus: "verified", location: "Ilala", locationCoords: "-6.8200,39.2700" },
  { uid: "nurse_003", name: "Amina Juma", specialty: "Pediatric", experience: "5 years", tnmcNumber: "TNMC-2021-003", phone: "+255712345003", hourlyRate: 55000, available: true, verificationStatus: "verified", location: "Temeke", locationCoords: "-6.8800,39.2800" },
  { uid: "nurse_004", name: "Hassan Mwinyi", specialty: "Cardiac", experience: "10 years", tnmcNumber: "TNMC-2018-004", phone: "+255712345004", hourlyRate: 65000, available: false, verificationStatus: "verified", location: "Kinondoni", locationCoords: "-6.7800,39.2400" },
  { uid: "nurse_005", name: "Neema Kimaro", specialty: "Home Care", experience: "3 years", tnmcNumber: "TNMC-2023-005", phone: "+255712345005", hourlyRate: 45000, available: true, verificationStatus: "pending", location: "Ubungo", locationCoords: "-6.8100,39.2400" },
  { uid: "nurse_006", name: "David Shirima", specialty: "ICU", experience: "15 years", tnmcNumber: "TNMC-2015-006", phone: "+255712345006", hourlyRate: 75000, available: true, verificationStatus: "verified", location: "Ilala", locationCoords: "-6.8300,39.2900" },
  { uid: "nurse_007", name: "Grace Mwamba", specialty: "Home Care", experience: "6 years", tnmcNumber: "TNMC-2020-007", phone: "+255712345007", hourlyRate: 45000, available: true, verificationStatus: "verified", location: "Temeke", locationCoords: "-6.8700,39.2700" },
  { uid: "nurse_008", name: "Joseph Kipondo", specialty: "Cardiac", experience: "7 years", tnmcNumber: "TNMC-2019-008", phone: "+255712345008", hourlyRate: 65000, available: true, verificationStatus: "verified", location: "Kinondoni", locationCoords: "-6.7950,39.2150" },
  { uid: "nurse_009", name: "Asha Bakari", specialty: "Pediatric", experience: "4 years", tnmcNumber: "TNMC-2022-009", phone: "+255712345009", hourlyRate: 55000, available: false, verificationStatus: "verified", location: "Ilala", locationCoords: "-6.8150,39.2650" },
  { uid: "nurse_010", name: "Emmanuel Mushi", specialty: "ICU", experience: "9 years", tnmcNumber: "TNMC-2018-010", phone: "+255712345010", hourlyRate: 75000, available: true, verificationStatus: "verified", location: "Ubungo", locationCoords: "-6.8050,39.2350" },
  { uid: "nurse_011", name: "Rehema Salim", specialty: "Home Care", experience: "2 years", tnmcNumber: "TNMC-2024-011", phone: "+255712345011", hourlyRate: 45000, available: true, verificationStatus: "pending", location: "Temeke", locationCoords: "-6.8850,39.2850" },
  { uid: "nurse_012", name: "Ibrahim Mweta", specialty: "Cardiac", experience: "11 years", tnmcNumber: "TNMC-2016-012", phone: "+255712345012", hourlyRate: 65000, available: true, verificationStatus: "verified", location: "Kinondoni", locationCoords: "-6.7880,39.2200" },
  { uid: "nurse_013", name: "Zainabu Hamisi", specialty: "Pediatric", experience: "6 years", tnmcNumber: "TNMC-2020-013", phone: "+255712345013", hourlyRate: 55000, available: true, verificationStatus: "verified", location: "Ilala", locationCoords: "-6.8250,39.2750" },
  { uid: "nurse_014", name: "Samuel Lwanga", specialty: "Home Care", experience: "4 years", tnmcNumber: "TNMC-2022-014", phone: "+255712345014", hourlyRate: 45000, available: true, verificationStatus: "verified", location: "Ubungo", locationCoords: "-6.7980,39.2420" },
  { uid: "nurse_015", name: "Martha Nkwama", specialty: "ICU", experience: "13 years", tnmcNumber: "TNMC-2015-015", phone: "+255712345015", hourlyRate: 75000, available: false, verificationStatus: "verified", location: "Temeke", locationCoords: "-6.8750,39.2780" },
];

const clients = [
  { uid: "client_001", name: "Asha Bongwa", role: "client", phone: "+255722000001", location: "Oysterbay" },
  { uid: "client_002", name: "Michael Temu", role: "client", phone: "+255722000002", location: "Masaki" },
  { uid: "client_003", name: "Fatima Hassan", role: "client", phone: "+255722000003", location: "Upanga" },
  { uid: "client_004", name: "Peter Kimambo", role: "client", phone: "+255722000004", location: "Sinza" },
  { uid: "client_005", name: "John Mwangwa", role: "client", phone: "+255722000005", location: "Kigamboni" },
  { uid: "client_006", name: "Neema Swai", role: "client", phone: "+255722000006", location: "Mikocheni" },
  { uid: "client_007", name: "David Mkwanga", role: "client", phone: "+255722000007", location: "Tabata" },
];

const jobs = [
  { id: "job_001", clientId: "client_001", clientName: "Asha Bongwa", type: "Home Care", nurseId: "nurse_001", nurseName: "Fatuma Mwalimu", status: "Completed", paymentStatus: "Paid", amount: 45000, location: "Oysterbay, Dar es Salaam", locationCoords: "-6.7700,39.2900", description: "Post-surgery home care for elderly mother", datetime: new Date("2026-06-15T09:00:00").toISOString(), createdAt: new Date("2026-06-14").toISOString() },
  { id: "job_002", clientId: "client_002", clientName: "Michael Temu", type: "ICU", nurseId: "nurse_002", nurseName: "John Massawe", status: "Care in Progress", paymentStatus: "Unpaid", amount: 75000, location: "Masaki, Dar es Salaam", locationCoords: "-6.7800,39.2950", description: "ICU support for father in critical condition", datetime: new Date("2026-07-10T08:00:00").toISOString(), createdAt: new Date("2026-07-09").toISOString() },
  { id: "job_003", clientId: "client_003", clientName: "Fatima Hassan", type: "Pediatric", nurseId: "nurse_003", nurseName: "Amina Juma", status: "Nurse Assigned", paymentStatus: "Unpaid", amount: 55000, location: "Upanga, Dar es Salaam", locationCoords: "-6.8100,39.2800", description: "Pediatric care for child with malaria", datetime: new Date("2026-07-13T10:00:00").toISOString(), createdAt: new Date("2026-07-12").toISOString() },
  { id: "job_004", clientId: "client_004", clientName: "Peter Kimambo", type: "Home Care", nurseId: "", nurseName: "", status: "Pending Assignment", paymentStatus: "Unpaid", amount: 45000, location: "Sinza, Dar es Salaam", locationCoords: "-6.7750,39.2450", description: "Daily home care visit for recovering patient", datetime: new Date("2026-07-14T09:00:00").toISOString(), createdAt: new Date("2026-07-12").toISOString() },
  { id: "job_005", clientId: "client_001", clientName: "Asha Bongwa", type: "Cardiac", nurseId: "nurse_004", nurseName: "Hassan Mwinyi", status: "Completed", paymentStatus: "Paid", amount: 65000, location: "Oysterbay, Dar es Salaam", locationCoords: "-6.7700,39.2900", description: "Cardiac monitoring for father", datetime: new Date("2026-06-20T14:00:00").toISOString(), createdAt: new Date("2026-06-19").toISOString() },
  { id: "job_006", clientId: "client_005", clientName: "John Mwangwa", type: "Home Care", nurseId: "nurse_007", nurseName: "Grace Mwamba", status: "Completed", paymentStatus: "Paid", amount: 45000, location: "Kigamboni, Dar es Salaam", locationCoords: "-6.8300,39.3000", description: "Post-natal home care for wife", datetime: new Date("2026-06-25T10:00:00").toISOString(), createdAt: new Date("2026-06-24").toISOString() },
  { id: "job_007", clientId: "client_006", clientName: "Neema Swai", type: "Pediatric", nurseId: "nurse_013", nurseName: "Zainabu Hamisi", status: "Care in Progress", paymentStatus: "Unpaid", amount: 55000, location: "Mikocheni, Dar es Salaam", locationCoords: "-6.7800,39.2600", description: "Pediatric care for twins with respiratory infection", datetime: new Date("2026-07-11T07:00:00").toISOString(), createdAt: new Date("2026-07-10").toISOString() },
  { id: "job_008", clientId: "client_007", clientName: "David Mkwanga", type: "ICU", nurseId: "", nurseName: "", status: "Pending Assignment", paymentStatus: "Unpaid", amount: 75000, location: "Tabata, Dar es Salaam", locationCoords: "-6.8400,39.2700", description: "Emergency ICU support needed urgently", datetime: new Date("2026-07-13T16:00:00").toISOString(), createdAt: new Date("2026-07-13").toISOString() },
];

const reviews = [
  { id: "rev_001", jobId: "job_001", clientId: "client_001", clientName: "Asha Bongwa", nurseId: "nurse_001", nurseName: "Fatuma Mwalimu", rating: 5, comment: "Fatuma was excellent! Very professional and caring. My mother received outstanding home care.", createdAt: new Date("2026-06-16").toISOString() },
  { id: "rev_002", jobId: "job_005", clientId: "client_001", clientName: "Asha Bongwa", nurseId: "nurse_004", nurseName: "Hassan Mwinyi", rating: 4, comment: "Hassan was very knowledgeable about cardiac care. Good service overall.", createdAt: new Date("2026-06-21").toISOString() },
  { id: "rev_003", jobId: "job_006", clientId: "client_005", clientName: "John Mwangwa", nurseId: "nurse_007", nurseName: "Grace Mwamba", rating: 5, comment: "Grace went above and beyond. Highly recommended for home care services.", createdAt: new Date("2026-06-26").toISOString() },
  { id: "rev_004", jobId: "job_002", clientId: "client_002", clientName: "Michael Temu", nurseId: "nurse_002", nurseName: "John Massawe", rating: 5, comment: "John is an ICU specialist who handled my father's critical care with utmost professionalism.", createdAt: new Date("2026-07-02").toISOString() },
  { id: "rev_005", jobId: "job_007", clientId: "client_006", clientName: "Neema Swai", nurseId: "nurse_006", nurseName: "David Shirima", rating: 4, comment: "David was punctual and very skilled. The care at home was managed perfectly.", createdAt: new Date("2026-07-05").toISOString() },
];

async function seedFirestore() {
  console.log("Seeding Firestore for project nuzia-3b9c0...\n");

  // Seed nurses
  console.log("Creating nurses...");
  for (const nurse of nurses) {
    await db.collection("users").doc(nurse.uid).set({
      ...nurse,
      role: "nurse",
      createdAt: new Date().toISOString(),
    });
    console.log(`  + ${nurse.name} (${nurse.specialty}, ${nurse.verificationStatus})`);
  }

  // Seed clients
  console.log("\nCreating clients...");
  for (const client of clients) {
    await db.collection("users").doc(client.uid).set({
      ...client,
      email: `${client.name.toLowerCase().replace(/\s/g, ".")}@demo.nuzia`,
      createdAt: new Date().toISOString(),
    });
    console.log(`  + ${client.name}`);
  }

  // Seed jobs
  console.log("\nCreating jobs...");
  for (const job of jobs) {
    await db.collection("jobs").doc(job.id).set({
      ...job,
      assignedNurseId: job.nurseId || undefined,
      assignedNurseName: job.nurseName || undefined,
    });
    console.log(`  + ${job.id}: ${job.clientName} -> ${job.nurseName || "Unassigned"} (${job.status})`);
  }

  // Seed reviews
  console.log("\nCreating reviews...");
  for (const review of reviews) {
    await db.collection("reviews").doc(review.id).set(review);
    console.log(`  + ${review.nurseName}: ${review.rating}/5 - "${review.comment.substring(0, 40)}..."`);
  }

  console.log("\n=============================");
  console.log("Seed complete!");
  console.log(`  ${nurses.length} nurses`);
  console.log(`  ${clients.length} clients`);
  console.log(`  ${jobs.length} jobs`);
  console.log(`  ${reviews.length} reviews`);
  console.log("=============================");
}

seedFirestore()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
