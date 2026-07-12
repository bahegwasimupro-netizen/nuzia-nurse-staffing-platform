import { useState } from "react";
import { useAuth } from "./auth";
import { useLang } from "./language";
import { Calendar, Save } from "lucide-react";

export interface WeeklySchedule {
  [day: string]: { start: string; end: string; enabled: boolean };
}

const DEFAULT_SCHEDULE: WeeklySchedule = {
  monday: { start: "08:00", end: "17:00", enabled: true },
  tuesday: { start: "08:00", end: "17:00", enabled: true },
  wednesday: { start: "08:00", end: "17:00", enabled: true },
  thursday: { start: "08:00", end: "17:00", enabled: true },
  friday: { start: "08:00", end: "17:00", enabled: true },
  saturday: { start: "09:00", end: "13:00", enabled: false },
  sunday: { start: "09:00", end: "13:00", enabled: false },
};

const DAY_KEYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const DAY_LABELS: Record<string, { sw: string; en: string }> = {
  monday: { sw: "Jumatatu", en: "Mon" },
  tuesday: { sw: "Jumanne", en: "Tue" },
  wednesday: { sw: "Jumatano", en: "Wed" },
  thursday: { sw: "Alhamisi", en: "Thu" },
  friday: { sw: "Ijumaa", en: "Fri" },
  saturday: { sw: "Jumamosi", en: "Sat" },
  sunday: { sw: "Jumapili", en: "Sun" },
};

interface AvailabilityScheduleProps {
  initialSchedule?: WeeklySchedule;
  onSave?: (schedule: WeeklySchedule) => void;
}

export function AvailabilitySchedule({ initialSchedule, onSave }: AvailabilityScheduleProps) {
  const { userProfile, updateProfile, isMock } = useAuth();
  const { lang } = useLang();
  const [schedule, setSchedule] = useState<WeeklySchedule>(initialSchedule || DEFAULT_SCHEDULE);
  const [saved, setSaved] = useState(false);

  const updateDay = (day: string, field: keyof WeeklySchedule[string], value: string | boolean) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const handleSave = async () => {
    if (isMock) {
      localStorage.setItem("nuzia_schedule_" + (userProfile?.uid || ""), JSON.stringify(schedule));
    } else {
      await updateProfile({ schedule } as any);
    }
    onSave?.(schedule);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const enabledDays = DAY_KEYS.filter((d) => schedule[d].enabled).length;

  return (
    <div className="bg-white rounded-2xl border p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#1e3a5f]" />
          <h3 className="font-bold text-sm">{lang === "sw" ? "Ratiba ya Upatikanaji" : "Availability Schedule"}</h3>
        </div>
        <span className="text-xs text-slate-400">{enabledDays}/7 {lang === "sw" ? "siku" : "days"}</span>
      </div>

      <div className="space-y-2">
        {DAY_KEYS.map((day) => {
          const dayData = schedule[day];
          return (
            <div key={day} className={`flex items-center gap-3 p-2.5 rounded-xl transition ${dayData.enabled ? "bg-slate-50 border border-slate-100" : "bg-slate-50/50 opacity-60"}`}>
              <button
                onClick={() => updateDay(day, "enabled", !dayData.enabled)}
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition ${dayData.enabled ? "bg-[#1e3a5f] text-white" : "bg-slate-200 text-slate-500"}`}
              >
                {DAY_LABELS[day][lang === "sw" ? "sw" : "en"]}
              </button>
              {dayData.enabled ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="time"
                    value={dayData.start}
                    onChange={(e) => updateDay(day, "start", e.target.value)}
                    className="border rounded-lg px-2 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#1e3a5f] bg-white"
                  />
                  <span className="text-xs text-slate-400 font-medium">→</span>
                  <input
                    type="time"
                    value={dayData.end}
                    onChange={(e) => updateDay(day, "end", e.target.value)}
                    className="border rounded-lg px-2 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#1e3a5f] bg-white"
                  />
                </div>
              ) : (
                <span className="text-xs text-slate-400 italic">{lang === "sw" ? "Haitumiki" : "Unavailable"}</span>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={handleSave}
        className={`w-full mt-4 py-2.5 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 ${saved ? "bg-emerald-500 text-white" : "bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] text-white hover:opacity-90"}`}
      >
        <Save className="w-4 h-4" />
        {saved ? (lang === "sw" ? "Imehifadhiwa!" : "Saved!") : (lang === "sw" ? "Hifadhi Ratiba" : "Save Schedule")}
      </button>
    </div>
  );
}
