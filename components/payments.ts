import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export interface PaymentRecord {
  id: string;
  jobId: string;
  clientId: string;
  nurseId: string;
  amount: number;
  method: "mpesa" | "airtel" | "card";
  phone?: string;
  status: "pending" | "processing" | "completed" | "failed";
  checkoutRequestId?: string;
  merchantRequestId?: string;
  createdAt: string;
  completedAt?: string;
}

const RATE_MAP: Record<string, number> = {
  "ICU": 75000,
  "Moyo": 65000,
  "Watoto": 55000,
  "Jumla": 50000,
  default: 45000,
};

export function calculateAmount(jobType: string): number {
  for (const [key, rate] of Object.entries(RATE_MAP)) {
    if (key !== "default" && jobType.includes(key)) return rate;
  }
  return RATE_MAP.default;
}

export function formatAmount(amount: number): string {
  return `TSh ${amount.toLocaleString()}`;
}

export async function initiateStkPush(
  phone: string,
  amount: number,
  jobId: string,
  clientId: string,
  isMock: boolean
): Promise<{ checkoutRequestId: string; status: string }> {
  const cleaned = phone.replace(/\s/g, "").replace(/^0/, "255");

  if (isMock) {
    const mockId = `ws_CO_${Date.now()}`;
    const record: PaymentRecord = {
      id: mockId,
      jobId,
      clientId,
      nurseId: "",
      amount,
      method: "mpesa",
      phone: cleaned,
      status: "pending",
      checkoutRequestId: mockId,
      createdAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, "payments", mockId), { ...record, createdAt: serverTimestamp() });
    } catch { /* mock mode */ }
    return { checkoutRequestId: mockId, status: "pending" };
  }

  // Production: calls your Cloud Function endpoint
  // POST https://your-cloud-function/stkpush { phone: cleaned, amount, jobId, accountId: clientId }
  throw new Error("Production STK push requires Cloud Functions backend. Deploy firebase functions first.");
}

export async function pollPaymentStatus(
  checkoutRequestId: string,
  isMock: boolean,
  maxAttempts = 15,
  intervalMs = 2000
): Promise<"completed" | "failed" | "timeout"> {
  if (isMock) {
    // Simulate STK push flow: user gets prompt, enters PIN
    let attempts = 0;
    while (attempts < maxAttempts) {
      await new Promise((r) => setTimeout(r, intervalMs));
      attempts++;
      // After 3 attempts (~6s), simulate success
      if (attempts >= 3) {
        try {
          await updateDoc(doc(db, "payments", checkoutRequestId), {
            status: "completed",
            completedAt: new Date().toISOString(),
          });
        } catch { /* mock mode */ }
        return "completed";
      }
    }
    return "timeout";
  }

  // Production: poll your Cloud Function
  // GET https://your-cloud-function/checkstatus?id=checkoutRequestId
  throw new Error("Production polling requires Cloud Functions backend.");
}

export async function markJobPaid(jobId: string, paymentId: string, isMock: boolean): Promise<void> {
  if (isMock) {
    try {
      await updateDoc(doc(db, "jobs", jobId), { paymentStatus: "Paid", paymentId });
    } catch { /* mock mode */ }
    return;
  }
  await updateDoc(doc(db, "jobs", jobId), { paymentStatus: "Paid", paymentId, paidAt: serverTimestamp() });
}
