import { UserProfile } from "./auth";

interface MatchableJob {
  type: string;
  location: string;
}

interface MatchResult {
  nurse: UserProfile;
  score: number;
  specialtyScore: number;
  distanceScore: number;
  experienceScore: number;
  availabilityBonus: number;
}

const SPECIALTY_MAP: Record<string, string[]> = {
  "Home Care Visit": ["Huduma za Nyumbani", "Home Care", "General Care"],
  "ICU Specialist": ["ICU Specialist", "ICU", "Critical Care"],
  "Cardiac Care": ["Huduma za Moyo", "Cardiac Care", "Heart Care"],
  "Pediatric Care": ["Huduma za Watoto", "Pediatric Care", "Child Care"],
  "General Care": ["Huduma za Jumla", "General Care", "Huduma za Nyumbani"],
};

function parseExperience(exp?: string): number {
  if (!exp) return 0;
  const match = exp.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function haversineDistance(coord1: string, coord2: string): number {
  const [lat1, lon1] = coord1.split(",").map(Number);
  const [lat2, lon2] = coord2.split(",").map(Number);
  if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) return Infinity;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function scoreSpecialty(jobType: string, nurseSpecialty?: string): number {
  if (!nurseSpecialty) return 0;
  const accepted = SPECIALTY_MAP[jobType] || [jobType];
  const norm = nurseSpecialty.toLowerCase();
  for (const s of accepted) {
    if (norm.includes(s.toLowerCase()) || s.toLowerCase().includes(norm)) return 100;
  }
  if (norm.includes("general") || norm.includes("jumla")) return 40;
  return 0;
}

function scoreDistance(jobLocation: string, nurseLocationCoords?: string): number {
  if (!nurseLocationCoords) return 50;
  const dist = haversineDistance(jobLocation, nurseLocationCoords);
  if (dist <= 2) return 100;
  if (dist <= 5) return 80;
  if (dist <= 10) return 60;
  if (dist <= 20) return 40;
  return 20;
}

function scoreExperience(experience?: string): number {
  const years = parseExperience(experience);
  if (years >= 8) return 100;
  if (years >= 5) return 80;
  if (years >= 3) return 60;
  if (years >= 1) return 40;
  return 20;
}

export function matchNurses(
  job: MatchableJob,
  availableNurses: UserProfile[],
  activeJobCounts?: Record<string, number>
): MatchResult[] {
  const results: MatchResult[] = availableNurses
    .filter((nurse) => nurse.verificationStatus === "verified" || !nurse.verificationStatus)
    .map((nurse) => {
    const specialtyScore = scoreSpecialty(job.type, nurse.specialty);
    const distanceScore = scoreDistance(job.location, nurse.locationCoords);
    const experienceScore = scoreExperience(nurse.experience);
    const activeJobs = activeJobCounts?.[nurse.uid] || 0;
    const availabilityBonus = activeJobs === 0 ? 20 : activeJobs === 1 ? 10 : 0;
    const score =
      specialtyScore * 0.4 +
      distanceScore * 0.25 +
      experienceScore * 0.25 +
      availabilityBonus * 0.1;
    return { nurse, score, specialtyScore, distanceScore, experienceScore, availabilityBonus };
  });
  return results
    .filter((r) => r.specialtyScore > 0)
    .sort((a, b) => b.score - a.score);
}

export function findBestNurse(
  job: MatchableJob,
  availableNurses: UserProfile[],
  activeJobCounts?: Record<string, number>
): UserProfile | null {
  const ranked = matchNurses(job, availableNurses, activeJobCounts);
  return ranked.length > 0 ? ranked[0].nurse : null;
}
