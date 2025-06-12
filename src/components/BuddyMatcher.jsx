import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchAllUsers, sendBuddyRequest } from "../services/authService";
import { UserCircle } from "lucide-react";
import toast from "react-hot-toast";

const BuddyMatcher = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const [allUsers, setAllUsers] = useState({});
  const [matchedBuddies, setMatchedBuddies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchInitiated, setSearchInitiated] = useState(false);
  const [sentRequests, setSentRequests] = useState({});

  // Function to load users and perform matching
  const performBuddySearch = async () => {
    if (!currentUser) {
      setError("Please log in to find buddies.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setMatchedBuddies([]);

    try {
      const usersData = await fetchAllUsers();
      const usersObject = usersData || {};
      setAllUsers(usersObject);

      if (currentUser.uid && usersObject[currentUser.uid]) {
        const matches = calculateMatches(currentUser.uid, usersObject);
        setMatchedBuddies(matches);
      } else if (currentUser.uid && !usersObject[currentUser.uid]) {
        setError(
          "Your profile data is not complete. Please update your profile to find matches."
        );
      } else {
        setError("Could not retrieve user data for matching.");
      }
    } catch (err) {
      console.error("Error fetching users for buddy matching:", err);
      setError("Failed to load users: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  //!Matching Algorithm (remains the same)
  const calculateMatches = (currentUserId, allUsersData) => {
    const currentProfile = allUsersData[currentUserId];
    if (!currentProfile) return [];

    const potentialBuddies = Object.keys(allUsersData)
      .filter((uid) => uid !== currentUserId)
      .map((uid) => ({ uid, ...allUsersData[uid] }));

    const scoredBuddies = potentialBuddies.map((buddy) => {
      let score = 0;

      const currentUserWorkouts = (currentProfile.preferredWorkouts || []).map(
        (w) => w.toLowerCase()
      );
      const buddyWorkouts = (buddy.preferredWorkouts || []).map((w) =>
        w.toLowerCase()
      );
      const currentUserGoals = (currentProfile.fitnessGoals || []).map((g) =>
        g.toLowerCase()
      );
      const buddyGoals = (buddy.fitnessGoals || []).map((g) => g.toLowerCase());

      // 1. Match Preferred Workouts (Higher weight)
      const sharedWorkouts = currentUserWorkouts.filter((workout) =>
        buddyWorkouts.includes(workout)
      );
      score += sharedWorkouts.length * 5;

      // 2. Match Fitness Goals (Higher weight)
      const sharedGoals = currentUserGoals.filter((goal) =>
        buddyGoals.includes(goal)
      );
      score += sharedGoals.length * 5;

      // 3. Match Location (Bonus if exact match)
      if (
        currentProfile.location &&
        buddy.location &&
        currentProfile.location.toLowerCase() === buddy.location.toLowerCase()
      ) {
        score += 10;
      }

      return { ...buddy, score };
    });
    return scoredBuddies
      .filter((buddy) => buddy.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  };

  // Handle sending a connect request
  const handleConnect = async (buddyId, buddyUsername) => {
    // Get the current user's full profile from allUsers data
    const senderProfile = allUsers[currentUser.uid];

    if (
      !currentUser ||
      !currentUser.uid ||
      !senderProfile ||
      !senderProfile.username
    ) {
      toast.error(
        "You must be logged in and have a complete profile (username) to send requests."
      );
      return;
    }

    setLoading(true);
    try {
      // Use senderProfile.username which is fetched from Realtime DB
      await sendBuddyRequest(currentUser.uid, senderProfile.username, buddyId);
      setSentRequests((prev) => ({ ...prev, [buddyId]: true }));
      toast.success(`Request sent to ${buddyUsername}!`);
    } catch (err) {
      console.error("Error sending buddy request:", err);
      toast.error("Failed to send request: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!searchInitiated) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl mt-8 mx-auto max-w-2xl">
        <h3 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6">
          Find Your Workout Buddies!
        </h3>
        <p className="text-gray-700 dark:text-gray-300 text-center mb-6">
          Click the button below to search for other users who share your
          fitness goals and preferred workouts. Make sure your profile is
          updated for the best results!
        </p>
        <button
          onClick={() => {
            setSearchInitiated(true);
            performBuddySearch();
          }}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 font-semibold shadow-md"
          disabled={!currentUser}
        >
          {currentUser ? "Find Buddies" : "Login to Find Buddies"}
        </button>
        {!currentUser && (
          <p className="text-red-500 text-sm mt-2">
            You must be logged in to find buddies.
          </p>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-md mt-4">
        <p className="text-lg">Searching for Buddies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg shadow-md mt-4">
        <p className="text-lg text-center">Error: {error}</p>
        <button
          onClick={() => {
            setError(null);
            setSearchInitiated(false);
          }}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (matchedBuddies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg shadow-md mt-4">
        <p className="text-lg text-center mb-4">
          No perfect matches found yet!
          <br />
          Try updating your profile with more details or connect with someone
          who shares your interests.
        </p>
        <button
          onClick={() => setSearchInitiated(false)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
        >
          Back to Search
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl mt-8 mx-auto max-w-2xl">
      <h3 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6">
        Potential Workout Buddies
      </h3>
      <div className="space-y-6">
        {matchedBuddies.map((buddy) => (
          <div
            key={buddy.uid}
            className="flex flex-col items-center space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm
                       sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0"
          >
            {buddy.photoURL ? (
              <img
                src={buddy.photoURL}
                alt={`${buddy.username}'s avatar`}
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-400"
              />
            ) : (
              <UserCircle
                size={64}
                className="text-gray-400 dark:text-gray-500"
              />
            )}
            <div className="flex-grow text-center sm:text-left">
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {buddy.username || "Anonymous User"}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Location: {buddy.location || "N/A"}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Workouts:{" "}
                {buddy.preferredWorkouts && buddy.preferredWorkouts.length > 0
                  ? buddy.preferredWorkouts.join(", ")
                  : "N/A"}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Goals:{" "}
                {buddy.fitnessGoals && buddy.fitnessGoals.length > 0
                  ? buddy.fitnessGoals.join(", ")
                  : "N/A"}
              </p>
              <p className="text-blue-500 dark:text-blue-300 text-sm font-medium mt-1">
                Match Score: {buddy.score}
              </p>
            </div>
            <button
              onClick={() => handleConnect(buddy.uid, buddy.username)}
              disabled={loading || sentRequests[buddy.uid]}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 mt-4 sm:mt-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sentRequests[buddy.uid] ? "Request Sent!" : "Connect"}
            </button>
          </div>
        ))}
        <div className="text-center mt-6">
          <button
            onClick={() => setSearchInitiated(false)}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition duration-300"
          >
            Search Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuddyMatcher;
