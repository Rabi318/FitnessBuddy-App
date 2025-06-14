import React, { use, useEffect, useState } from "react";
import {
  addDefaultChallenges,
  fetchAllChallenges,
  fetchUserChallenges,
  joinChallenge,
} from "../services/challengesService";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);
  const [userChallenges, setUserChallenges] = useState([]);
  const [filter, setFilter] = useState("all");

  const handleJoin = async (challengeId) => {
    if (!user?.uid) {
      alert("Please login to join a challenge.");
      return;
    }
    await joinChallenge(user.uid, challengeId);
    toast.success("Challenge joined successfully!");
  };
  const uniqueTypes = [
    ...new Set(Object.values(challenges).map((c) => c.exerciseType)),
  ];
  const filteredChallenges =
    filter === "all"
      ? challenges
      : Object.fromEntries(
          Object.entries(challenges).filter(
            ([_, c]) => c.exerciseType === filter
          )
        );
  useEffect(() => {
    const loadChallenges = async () => {
      const data = await fetchAllChallenges();
      setChallenges(data);

      if (user?.uid) {
        const joined = await fetchUserChallenges(user.uid);
        setUserChallenges(joined || {});
      }
      setLoading(false);
    };
    loadChallenges();
  }, [user]);

  if (loading) {
    return (
      <div className="p-4 text-center dark:text-white">
        Loading challenges...
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">🏆 Challenges</h2>

      {user?.uid && (
        <div className="mb-4 flex justify-end">
          <Link
            to="/my-challenges"
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
          >
            My Challenges
          </Link>
        </div>
      )}
      <div className="mb-6 flex justify-center">
        <select
          onChange={(e) => setFilter(e.target.value)}
          value={filter}
          className="p-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
        >
          <option value="all">All Types</option>
          {uniqueTypes.map((type) => (
            <option key={type} value={type}>
              {type[0].toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 
        {Object.entries(filteredChallenges).map(([id, challenge]) => (
          <div
            key={id}
            className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-xl transition"
          >
            <img
              src={challenge.imageUrl}
              alt={challenge.title}
              className="w-full h-48 object-cover rounded-md mb-3"
            />
            <h3 className="text-xl font-bold mb-2">{challenge.title}</h3>
            <p className="text-sm mb-2">{challenge.description}</p>
            <p className="text-sm">
              🎯 Goal: {challenge.goalValue} ({challenge.goalType})
            </p>
            <p className="text-sm">
              📅 Duration: {challenge.durationDays} days
            </p>
            <p className="text-sm mt-2">🎁 Reward: {challenge.reward}</p>
            <button
              onClick={() => canJoin && handleJoin(id)}
              className={`mt-4 w-full py-2 rounded transition ${
                canJoin
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-400 text-white cursor-not-allowed"
              }`}
              disabled={!canJoin}
            >
              {isJoined && !isExpired ? "Already Joined" : "Join Now"}
            </button>
          </div>
        ))} */}
        {Object.entries(filteredChallenges).map(([id, challenge]) => {
          const isJoined = userChallenges[id];
          const isExpired =
            isJoined &&
            new Date().getTime() >
              new Date(isJoined.joinedAt).getTime() +
                challenge.durationDays * 24 * 60 * 60 * 1000;

          const isCompleted =
            isJoined && userChallenges[id].progress >= challenge.goalValue;

          const canJoin = !isJoined || isExpired || isCompleted;

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
              <h3 className="text-xl font-bold mb-2">{challenge.title}</h3>
              <p className="text-sm mb-2">{challenge.description}</p>
              <p className="text-sm">
                🎯 Goal: {challenge.goalValue} ({challenge.goalType})
              </p>
              <p className="text-sm">
                📅 Duration: {challenge.durationDays} days
              </p>
              <p className="text-sm mt-2">🎁 Reward: {challenge.reward}</p>
              <button
                onClick={() => canJoin && handleJoin(id)}
                className={`mt-4 w-full py-2 rounded transition ${
                  canJoin
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-400 text-white cursor-not-allowed"
                }`}
                disabled={!canJoin}
              >
                {!canJoin ? "Already Joined" : "Join Now"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Challenges;
