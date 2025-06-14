import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  fetchUserChallenges,
  fetchAllChallenges,
  updateChallengeProgress,
} from "../services/challengesService";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const MyChallenges = () => {
  const user = useSelector((state) => state.auth.user);
  const [userChallenges, setUserChallenges] = useState({});
  const [allChallenges, setAllChallenges] = useState({});
  const [loading, setLoading] = useState(true);
  const [showInputId, setShowInputId] = useState(null);
  const [newProgress, setNewProgress] = useState("");
  const [updating, setUpdating] = useState(false);
  const [dailyLogs, setDailyLogs] = useState({});

  const handleUpdateProgress = async (challengeId) => {
    if (!user?.uid) return;

    const challenge = allChallenges[challengeId];
    const currentProgress = userChallenges[challengeId]?.progress || 0;
    const addedProgress = Number(newProgress);

    if (isNaN(addedProgress) || addedProgress <= 0) {
      toast.error("Please enter a valid progress number.");
      return;
    }

    const newTotalProgress = Math.min(
      currentProgress + addedProgress,
      challenge.goalValue
    );

    const today = new Date().toISOString().split("T")[0];
    const existingLogs = userChallenges[challengeId]?.logs || {};
    const todayLog = existingLogs[today] || 0;
    const updatedLogs = {
      ...existingLogs,
      [today]: todayLog + addedProgress,
    };

    setUpdating(true);
    try {
      await updateChallengeProgress(
        user.uid,
        challengeId,
        newTotalProgress,
        updatedLogs
      );
      toast.success("Progress updated!");
      const updated = await fetchUserChallenges(user.uid);
      setUserChallenges(updated || {});
      setShowInputId(null);
      setNewProgress("");
    } catch (err) {
      toast.error("Failed to update progress");
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      if (!user?.uid) return;

      const [userData, allData] = await Promise.all([
        fetchUserChallenges(user.uid),
        fetchAllChallenges(),
      ]);
      setUserChallenges(userData || {});
      setAllChallenges(allData || {});
      setLoading(false);
    };

    load();
  }, [user]);

  const getRemainingDays = (joinedAt, durationDays) => {
    const joinedDate = new Date(joinedAt);
    const endDate = new Date(
      joinedDate.getTime() + durationDays * 24 * 60 * 60 * 1000
    );
    const diff = Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24));
    return diff <= 0 ? 0 : diff;
  };

  if (loading) {
    return (
      <div className="p-4 text-center dark:text-white">
        Loading your challenges...
      </div>
    );
  }

  const joinedChallengeIds = Object.keys(userChallenges);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">🔥 My Challenges</h2>
      {/* Completed Rewards Showcase */}
      {joinedChallengeIds.some((id) => {
        const ch = userChallenges[id];
        const challenge = allChallenges[id];
        return ch?.progress >= challenge?.goalValue;
      }) && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">🏆 Earned Rewards</h3>
          <div className="flex flex-wrap gap-2">
            {joinedChallengeIds.map((id) => {
              const challenge = allChallenges[id];
              const userData = userChallenges[id];
              const isCompleted = userData?.progress >= challenge?.goalValue;
              return (
                isCompleted && (
                  <span
                    key={id}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm shadow"
                  >
                    {challenge.reward}
                  </span>
                )
              );
            })}
          </div>
        </div>
      )}

      <div className="mb-4">
        <Link
          to="/challenges"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          ← Back to Challenges
        </Link>
      </div>

      {joinedChallengeIds.length === 0 ? (
        <p className="text-center text-lg mt-10">
          You haven't joined any challenges yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {joinedChallengeIds.map((id) => {
            const challenge = allChallenges[id];
            const joinedData = userChallenges[id];
            const joinedAt = joinedData?.joinedAt;
            const progress = joinedData?.progress || 0;
            const logs = joinedData?.logs || {};
            const daysLeft = getRemainingDays(joinedAt, challenge.durationDays);
            const isExpired = daysLeft === 0;

            const progressPercent = Math.min(
              (progress / challenge.goalValue) * 100,
              100
            ).toFixed(1);

            const isCompleted = Number(progressPercent) >= 100;

            return (
              <div
                key={id}
                className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-xl transition"
              >
                <img
                  src={challenge.imageUrl}
                  alt={challenge.title}
                  className="w-full h-48 object-cover rounded-md mb-3"
                />
                <h3 className="text-xl font-bold mb-2 flex justify-between items-center">
                  {challenge.title}
                  {isCompleted && (
                    <span className="ml-2 text-sm bg-green-600 text-white px-2 py-1 rounded-full">
                      Completed
                    </span>
                  )}
                </h3>
                <p className="text-sm mb-2">{challenge.description}</p>
                <p className="text-sm">
                  🕒 Joined: {new Date(joinedAt).toLocaleDateString()}
                </p>
                <p className="text-sm">
                  📅 Days Left:{" "}
                  {isExpired ? (
                    <span className="text-red-400">Expired</span>
                  ) : (
                    <span className="text-green-400">{daysLeft} days</span>
                  )}
                </p>
                <p className="text-sm mt-1">🎁 Reward: {challenge.reward}</p>

                <div className="mt-4">
                  <p className="text-sm font-medium mb-1">
                    Progress: {progress}/{challenge.goalValue}{" "}
                    {challenge.goalType}
                  </p>
                  <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-4">
                    <div
                      className="bg-blue-600 h-4 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="text-right text-xs mt-1 text-gray-400">
                    {progressPercent}%
                  </p>
                </div>

                {Object.keys(logs).length > 0 && (
                  <div className="mt-3 text-sm">
                    <h4 className="font-semibold mb-1">📅 Daily Logs:</h4>
                    <ul className="max-h-32 overflow-y-auto">
                      {Object.entries(logs)
                        .sort()
                        .map(([date, value]) => (
                          <li key={date}>
                            {date}: {value} {challenge.goalType}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                {!isExpired && !isCompleted && (
                  <>
                    {showInputId === id ? (
                      <div className="mt-3">
                        <input
                          type="number"
                          min="1"
                          value={newProgress}
                          onChange={(e) => setNewProgress(e.target.value)}
                          className="w-full p-2 rounded mb-2 dark:bg-gray-700 dark:text-white bg-white border"
                          placeholder={`Enter progress (${challenge.goalType})`}
                        />
                        <button
                          onClick={() => handleUpdateProgress(id)}
                          disabled={updating}
                          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                        >
                          {updating ? "Updating..." : "Submit Progress"}
                        </button>
                        <button
                          onClick={() => setShowInputId(null)}
                          className="w-full mt-2 text-sm text-gray-400 hover:underline"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowInputId(id)}
                        className="mt-3 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                      >
                        Update Progress
                      </button>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyChallenges;
