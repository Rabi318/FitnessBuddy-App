import { get, ref, set, update } from "firebase/database";
import { db } from "./firebase";

const defaultChallenges = {
  run_50_miles: {
    title: "Run 50 Miles in a Month",
    description: "Complete 50 miles of running within 30 days",
    goalType: "distance",
    goalValue: 50,
    durationDays: 30,
    reward: "🏅 50-Mile Finisher Badge",
    exerciseType: "running",
    imageUrl:
      "https://images.unsplash.com/photo-1605301627799-9c9eb5f75574?auto=format&fit=crop&w=800&q=80",
  },
  pushup_30_day: {
    title: "30-Day Push-Up Challenge",
    description: "Do push-ups daily for 30 days",
    goalType: "consistency",
    goalValue: 30,
    durationDays: 30,
    reward: "💪 Push-Up Pro Badge",
    exerciseType: "bodyweight",
    imageUrl:
      "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=800&q=80",
  },
  morning_yoga: {
    title: "Morning Yoga Routine",
    description: "Do a 15-min morning yoga routine for 15 days",
    goalType: "consistency",
    goalValue: 15,
    durationDays: 20,
    reward: "🧘 Yoga Starter Badge",
    exerciseType: "yoga",
    imageUrl:
      "https://images.unsplash.com/photo-1540206395-68808572332f?auto=format&fit=crop&w=800&q=80",
  },
  climb_100_floors: {
    title: "Climb 100 Floors",
    description: "Use stairs or stair machine to climb 100 floors",
    goalType: "count",
    goalValue: 100,
    durationDays: 25,
    reward: "🏆 Stair Master Badge",
    exerciseType: "stair_climbing",
    imageUrl:
      "https://images.unsplash.com/photo-1571019613578-2b78e9126f6e?auto=format&fit=crop&w=800&q=80",
  },
  cycle_100_km: {
    title: "Cycle 100 KM in 2 Weeks",
    description: "Ride a total of 100 kilometers in 14 days",
    goalType: "distance",
    goalValue: 100,
    durationDays: 14,
    reward: "🚴‍♂️ Cycling Champ Badge",
    exerciseType: "cycling",
    imageUrl:
      "https://images.unsplash.com/photo-1518655048521-f130df041f66?auto=format&fit=crop&w=800&q=80",
  },
  squat_500: {
    title: "500 Squats in a Week",
    description: "Complete 500 squats in 7 days",
    goalType: "count",
    goalValue: 500,
    durationDays: 7,
    reward: "🏋️ Squat Beast Badge",
    exerciseType: "bodyweight",
    imageUrl:
      "https://images.unsplash.com/photo-1605296867422-28b4a41c7008?auto=format&fit=crop&w=800&q=80",
  },
  plank_master: {
    title: "Plank Master Challenge",
    description: "Hold a plank for 2 minutes daily for 10 days",
    goalType: "consistency",
    goalValue: 10,
    durationDays: 12,
    reward: "🧱 Core Crusher Badge",
    exerciseType: "core",
    imageUrl:
      "https://images.unsplash.com/photo-1612287230202-b80f8c3d1bba?auto=format&fit=crop&w=800&q=80",
  },
  evening_walks: {
    title: "Evening Walk Challenge",
    description: "Walk at least 2 km every evening for 20 days",
    goalType: "consistency",
    goalValue: 20,
    durationDays: 25,
    reward: "🚶‍♀️ Walk Warrior Badge",
    exerciseType: "walking",
    imageUrl:
      "https://images.unsplash.com/photo-1505236732316-920f94d52d71?auto=format&fit=crop&w=800&q=80",
  },
};

export const addDefaultChallenges = async () => {
  const challengesRef = ref(db, "challenges");
  await set(challengesRef, defaultChallenges);
  console.log("Default challenges added successfully");
};

export const fetchAllChallenges = async () => {
  const challengesRef = ref(db, "challenges");
  const snapshot = await get(challengesRef);
  return snapshot.exists() ? snapshot.val() : {};
};

//join a challenge
export const joinChallenge = async (uid, challengeId) => {
  const userChallengeRef = ref(
    db,
    `users/${uid}/joinedChallenges/${challengeId}`
  );
  await set(userChallengeRef, {
    joinedAt: new Date().toISOString(),
    progress: 0,
    status: "in_progress",
  });
};

// Update progress of a joined challenge
export const updateChallengeProgress = async (uid, challengeId, progress) => {
  const challengeRef = ref(db, `users/${uid}/joinedChallenges/${challengeId}`);
  await update(challengeRef, {
    progress,
    updatedAt: new Date().toISOString(),
  });
};

// Mark challenge as completed
export const completeChallenge = async (uid, challengeId) => {
  const challengeRef = ref(db, `users/${uid}/joinedChallenges/${challengeId}`);
  await update(challengeRef, {
    status: "completed",
    completedAt: new Date().toISOString(),
  });
};

// Fetch all challenges a user has joined
export const fetchUserChallenges = async (uid) => {
  const userChallengesRef = ref(db, `users/${uid}/joinedChallenges`);
  const snapshot = await get(userChallengesRef);
  return snapshot.exists() ? snapshot.val() : {};
};
