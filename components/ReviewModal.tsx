import { useState } from "react";
import { useAuth } from "./auth";
import { useLang } from "./language";
import { submitReview } from "./reviews";
import { Star, X } from "lucide-react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  nurseId: string;
  nurseName: string;
  serviceType: string;
}

export function ReviewModal({ isOpen, onClose, jobId, nurseId, nurseName, serviceType }: ReviewModalProps) {
  const { userProfile, isMock } = useAuth();
  const { lang } = useLang();
  const [rating, setRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !userProfile) return null;

  const labels = lang === "sw"
    ? ["", "Mbaya sana", "Mbaya", "Wastani", "Nzuri", "Bora sana"]
    : ["", "Terrible", "Poor", "Average", "Good", "Excellent"];

  const handleSubmit = async () => {
    setLoading(true);
    await submitReview(
      jobId,
      nurseId,
      userProfile.uid,
      userProfile.name,
      rating,
      comment,
      serviceType,
      isMock
    );
    setLoading(false);
    setSubmitted(true);
    setTimeout(() => { onClose(); setSubmitted(false); setRating(5); setComment(""); }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{lang === "sw" ? "Weka Ukadiriaji" : "Leave a Review"}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl font-semibold">&times;</button>
        </div>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"><Star className="w-8 h-8 text-emerald-600 fill-current" /></div>
            <h3 className="text-lg font-bold text-emerald-700 mb-2">{lang === "sw" ? "Asante!" : "Thank you!"}</h3>
            <p className="text-sm text-slate-500">{lang === "sw" ? "Ukadiriaji wako umewekwa." : "Your review has been submitted."}</p>
          </div>
        ) : (
          <>
            <div className="bg-slate-50 rounded-xl p-4 mb-6 text-center">
              <p className="text-sm text-slate-500 mb-1">{lang === "sw" ? "Ukadiriaji kwa" : "Rating for"}</p>
              <p className="font-bold text-lg">{nurseName}</p>
              <p className="text-xs text-slate-400">{serviceType}</p>
            </div>

            <div className="flex justify-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${(hoveredStar || rating) >= star ? "text-amber-400 fill-current" : "text-slate-200"}`}
                  />
                </button>
              ))}
            </div>
            <p className="text-center text-sm font-semibold text-slate-600 mb-6">{labels[hoveredStar || rating]}</p>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-1">{lang === "sw" ? "Maoni (hiari)" : "Comment (optional)"}</label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={lang === "sw" ? "Andika maoni yako kuhusu huduma..." : "Write about your experience..."}
                className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] bg-slate-50 text-sm"
              />
            </div>

            <div className="flex gap-4">
              <button onClick={onClose} className="w-1/2 bg-slate-100 hover:bg-slate-200 font-bold py-3 px-4 rounded-xl transition">{lang === "sw" ? "Ghairi" : "Cancel"}</button>
              <button onClick={handleSubmit} disabled={loading} className="w-1/2 bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? "..." : lang === "sw" ? "Weka Ukadiriaji" : "Submit Review"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
