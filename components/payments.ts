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

// Cloud Functions base URL (auto-detected)
const FUNCTIONS_BASE = import.meta.env.DEV
  ? "http://127.0.0.1:5001/nuzia-3b9c0/africa-south1"
  : "https://africa-south1-nuzia-3b9c0.cloudfunctions.net";

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

  // Production: call Cloud Function
  try {
    const response = await fetch(`${FUNCTIONS_BASE}/initiateStkPush`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: cleaned, amount, jobId, clientId, accountRef: jobId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Payment initiation failed");
    }

    return {
      checkoutRequestId: data.checkoutRequestId,
      status: data.status,
    };
  } catch (error: any) {
    console.error("STK Push failed:", error);
    throw error;
  }
}

export async function pollPaymentStatus(
  checkoutRequestId: string,
  isMock: boolean,
  maxAttempts = 15,
  intervalMs = 2000
): Promise<"completed" | "failed" | "timeout"> {
  if (isMock) {
    let attempts = 0;
    while (attempts < maxAttempts) {
      await new Promise((r) => setTimeout(r, intervalMs));
      attempts++;
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

  // Production: poll Cloud Function
  let attempts = 0;
  while (attempts < maxAttempts) {
    try {
      const response = await fetch(`${FUNCTIONS_BASE}/checkPaymentStatus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: checkoutRequestId }),
      });

      const data = await response.json();

      if (data.status === "completed") return "completed";
      if (data.status === "failed") return "failed";
    } catch (error) {
      console.error("Payment status check failed:", error);
    }

    await new Promise((r) => setTimeout(r, intervalMs));
    attempts++;
  }

  return "timeout";
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
