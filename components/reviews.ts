import { collection, addDoc, query, where, onSnapshot, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

export interface Review {
  id: string;
  jobId: string;
  nurseId: string;
  clientId: string;
  clientName: string;
  rating: number;
  comment: string;
  serviceType: string;
  createdAt: Timestamp;
}

export async function submitReview(
  jobId: string,
  nurseId: string,
  clientId: string,
  clientName: string,
  rating: number,
  comment: string,
  serviceType: string,
  isMock: boolean
): Promise<void> {
  if (isMock) {
    const key = "nuzia_mock_reviews";
    const reviews = JSON.parse(localStorage.getItem(key) || "[]");
    reviews.push({
      id: `rev-${Date.now()}`,
      jobId,
      nurseId,
      clientId,
      clientName,
      rating,
      comment,
      serviceType,
      createdAt: { seconds: Date.now() / 1000 },
    });
    localStorage.setItem(key, JSON.stringify(reviews));
    window.dispatchEvent(new Event("reviews-updated"));
    return;
  }

  await addDoc(collection(db, "reviews"), {
    jobId,
    nurseId,
    clientId,
    clientName,
    rating,
    comment,
    serviceType,
    createdAt: serverTimestamp(),
  });
}

export function subscribeToNurseReviews(
  nurseId: string,
  isMock: boolean,
  callback: (reviews: Review[]) => void
): () => void {
  if (isMock) {
    const load = () => {
      const reviews = JSON.parse(localStorage.getItem("nuzia_mock_reviews") || "[]");
      callback(reviews.filter((r: Review) => r.nurseId === nurseId));
    };
    load();
    const handler = () => load();
    window.addEventListener("reviews-updated", handler);
    return () => window.removeEventListener("reviews-updated", handler);
  }

  const q = query(collection(db, "reviews"), where("nurseId", "==", nurseId));
  return onSnapshot(q, (snap) => {
    const reviews = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Review[];
    callback(reviews);
  });
}

export function subscribeToJobReview(
  jobId: string,
  isMock: boolean,
  callback: (review: Review | null) => void
): () => void {
  if (isMock) {
    const load = () => {
      const reviews = JSON.parse(localStorage.getItem("nuzia_mock_reviews") || "[]");
      const found = reviews.find((r: Review) => r.jobId === jobId);
      callback(found || null);
    };
    load();
    const handler = () => load();
    window.addEventListener("reviews-updated", handler);
    return () => window.removeEventListener("reviews-updated", handler);
  }

  const q = query(collection(db, "reviews"), where("jobId", "==", jobId));
  return onSnapshot(q, (snap) => {
    if (snap.empty) { callback(null); return; }
    callback({ id: snap.docs[0].id, ...snap.docs[0].data() } as Review);
  });
}

export function getAverageRating(reviews: Review[]): { average: number; count: number } {
  if (reviews.length === 0) return { average: 0, count: 0 };
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return { average: Math.round((sum / reviews.length) * 10) / 10, count: reviews.length };
}
