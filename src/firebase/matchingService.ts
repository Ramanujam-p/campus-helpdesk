import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "../fireconnection";

/* =====================================================
   TYPES
===================================================== */

export type SkillLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced"
  | "Expert";

export interface UserProfile {
  name?: string;
  interests?: string[];
  skillLevel?: SkillLevel;
}

export interface UserActivityStats {
  questionsAsked: number;
  answersGiven: number;
}

export interface MatchedPeer {
  id: string;
  name: string;
  interests: string[];
  skillLevel: SkillLevel;
  matchScore: number;
  stats: UserActivityStats;
}

/* =====================================================
   MATCH SCORE CALCULATION (0–100)
===================================================== */

function calculateMatchScore(
  currentProfile: UserProfile,
  otherProfile: UserProfile,
  stats: UserActivityStats
): number {
  let score = 0;

  /* ---------- 1. Shared Interests (40) ---------- */
  const currentInterests: string[] = currentProfile.interests || [];
  const otherInterests: string[] = otherProfile.interests || [];

  const shared = currentInterests.filter((i) =>
    otherInterests.includes(i)
  ).length;

  const interestScore =
    currentInterests.length === 0
      ? 0
      : (shared / currentInterests.length) * 40;

  score += interestScore;

  /* ---------- 2. Skill Level Similarity (30) ---------- */
  const levels: SkillLevel[] = [
    "Beginner",
    "Intermediate",
    "Advanced",
    "Expert",
  ];

  const cIndex = levels.indexOf(
    currentProfile.skillLevel || "Intermediate"
  );
  const oIndex = levels.indexOf(
    otherProfile.skillLevel || "Intermediate"
  );

  const diff = Math.abs(cIndex - oIndex);
  score += Math.max(0, 30 - diff * 10);

  /* ---------- 3. Activity Level (20) ---------- */
  const activity =
    (stats.questionsAsked || 0) + (stats.answersGiven || 0);

  score += Math.min(20, activity * 2);

  /* ---------- 4. Complementary Skills (10) ---------- */
  const complementary = otherInterests.filter(
    (i) => !currentInterests.includes(i)
  ).length;

  score += Math.min(10, complementary * 2);

  return Math.round(score);
}

/* =====================================================
   GET USER ACTIVITY STATS
===================================================== */

async function getUserActivityStats(
  userId: string
): Promise<UserActivityStats> {
  try {
    const questionsSnap = await getDocs(
      query(collection(db, "questions"), where("userId", "==", userId))
    );

    const answersSnap = await getDocs(
      query(collection(db, "answers"), where("userId", "==", userId))
    );

    return {
      questionsAsked: questionsSnap.size,
      answersGiven: answersSnap.size,
    };
  } catch (err) {
    console.error("❌ Stats error:", err);
    return { questionsAsked: 0, answersGiven: 0 };
  }
}

/* =====================================================
   MAIN MATCHING FUNCTION
===================================================== */

export async function getMatchedPeers(
  currentUserId: string,
  limit: number = 10
): Promise<MatchedPeer[]> {
  try {
    /* ---------- Current User ---------- */
    const currentSnap = await getDoc(
      doc(db, "users", currentUserId)
    );

    if (!currentSnap.exists()) {
      throw new Error("Current user not found");
    }

    const currentProfile =
      currentSnap.data() as UserProfile;

    /* ---------- All Users ---------- */
    const usersSnap = await getDocs(collection(db, "users"));
    const matches: MatchedPeer[] = [];

    for (const userDoc of usersSnap.docs) {
      if (userDoc.id === currentUserId) continue;

      const otherProfile =
        userDoc.data() as UserProfile;

      const stats = await getUserActivityStats(userDoc.id);

      const score = calculateMatchScore(
        currentProfile,
        otherProfile,
        stats
      );

      matches.push({
        id: userDoc.id,
        name: otherProfile.name || "",
        interests: otherProfile.interests || [],
        skillLevel:
          otherProfile.skillLevel || "Intermediate",
        matchScore: score,
        stats,
      });
    }

    return matches
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);
  } catch (err) {
    console.error("❌ Matching failed:", err);
    throw err;
  }
}
