// Profile.jsx
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import { get, ref } from "firebase/database";
import { Edit, UserCircle, Activity } from "lucide-react"; // Import Activity icon
import { updateUserProfile } from "../services/authService";
import toast from "react-hot-toast";
import EditProfileForm from "../components/EditProfileForm";
import BuddyMatcher from "../components/BuddyMatcher";
import ProfilePromptModal from "../components/ProfilePromptModal";
import NotificationsDisplay from "../components/NotificationsDisplay";
import MyBuddiesList from "../components/MyBuddiesList";

const Profile = () => {
  const navigate = useNavigate();
  const firebaseUser = useSelector((state) => state.auth.user);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const [profileCompletionPercentage, setProfileCompletionPercentage] =
    useState(0);
  const [userChats, setUserChats] = useState({});

  //!function to calculate profile completion percentage
  const calculateProfileCompletness = useCallback((profile) => {
    const requiredFields = [
      "username",
      "age",
      "location",
      "preferredWorkouts",
      "fitnessGoals",
      "email",
    ];
    let completedFields = 0;
    if (!profile) return 0;

    if (profile.username && profile.username.trim() !== "") completedFields++;
    if (profile.age && typeof profile.age === "number" && profile.age > 0)
      completedFields++;
    if (profile.location && profile.location.trim() !== "") completedFields++;

    if (
      Array.isArray(profile.preferredWorkouts) &&
      profile.preferredWorkouts.some((w) => w.trim() !== "")
    )
      completedFields++;
    if (
      Array.isArray(profile.fitnessGoals) &&
      profile.fitnessGoals.some((g) => g.trim() !== "")
    )
      completedFields++;

    if (profile.email && profile.email.trim() !== "") completedFields++;

    return Math.round((completedFields / requiredFields.length) * 100);
  }, []);

  useEffect(() => {
    if (!firebaseUser) {
      navigate("/");
      return;
    }

    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const userRef = ref(db, `users/${firebaseUser.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const fetchedDetails = snapshot.val();
          setUserDetails(fetchedDetails);
          setUserChats(fetchedDetails.chats || {});

          const percentage = calculateProfileCompletness(fetchedDetails);
          setProfileCompletionPercentage(percentage);

          const dismissed = sessionStorage.getItem("profilePromptDismissed");
          if (percentage < 100 && dismissed !== "true") {
            setShowProfilePrompt(true);
          }
        } else {
          setError("User Data not found in database.");
          setUserDetails(null);
          setUserChats({});
          const dismissed = sessionStorage.getItem("profilePromptDismissed");
          if (dismissed !== "true") {
            setShowProfilePrompt(true);
          }
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError("Failed to load user details: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [firebaseUser, navigate, calculateProfileCompletness]);

  const handleSaveProfile = async (updatedData) => {
    setLoading(true);
    try {
      if (firebaseUser && firebaseUser.uid) {
        await updateUserProfile(firebaseUser.uid, updatedData);
        const newDetails = { ...userDetails, ...updatedData };
        setUserDetails(newDetails);
        toast.success("Profile updated successfully!");
        setIsEditing(false);

        const newPercentage = calculateProfileCompletness(newDetails);
        setProfileCompletionPercentage(newPercentage);
        if (newPercentage === 100) {
          setShowProfilePrompt(false);
          sessionStorage.removeItem("profilePromptDismissed");
        }
      } else {
        toast.error("User not authenticated. Please log in.");
      }
    } catch (error) {
      console.log("Error saving profile:", error);
      toast.error("Failed to update profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDismissPrompt = () => {
    setShowProfilePrompt(false);
    sessionStorage.setItem("profilePromptDismissed", "true");
  };

  const handleUpdateFromPrompt = () => {
    setShowProfilePrompt(false);
    setIsEditing(true);
    sessionStorage.setItem("profilePromptDismissed", "true");
  };

  const handleGoToWorkoutTracker = () => {
    navigate("/workout-tracker"); // Navigate to the new workout tracker page
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <p className="text-lg">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 text-red-600 dark:text-red-400">
        <p className="text-lg">Error: {error}</p>
      </div>
    );
  }

  if (!userDetails && !isEditing) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <p className="text-lg">
          No user data available. Please log in or register.
          <br />
          <button
            onClick={() => handleUpdateFromPrompt()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition mt-4"
          >
            Create Profile
          </button>
        </p>
        <ProfilePromptModal
          isOpen={showProfilePrompt}
          onClose={handleDismissPrompt}
          onUpdateProfile={handleUpdateFromPrompt}
          percentage={profileCompletionPercentage}
        />
      </div>
    );
  }

  const formattedCreationDate = userDetails.createdAt
    ? new Date(userDetails.createdAt).toLocaleDateString()
    : "N/A";

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8 xl:flex-row xl:items-start xl:justify-center xl:space-x-8 space-y-8 xl:space-y-0">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 lg:p-10 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            User Profile
          </h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition duration-300 shadow-md"
              aria-label="Edit Profile"
            >
              <Edit size={20} />
            </button>
          )}
        </div>

        {isEditing ? (
          <EditProfileForm
            currentUserDetails={userDetails}
            onSave={handleSaveProfile}
            onCancel={() => setIsEditing(false)}
            isLoading={loading}
          />
        ) : (
          <>
            {userDetails.photoURL ? (
              <div className="flex justify-center mb-6">
                <img
                  src={userDetails.photoURL}
                  alt="User Avatar"
                  className="w-28 h-28 rounded-full object-cover border-4 border-blue-400 dark:border-blue-600 shadow-md"
                />
              </div>
            ) : (
              <div className="flex justify-center mb-6">
                <UserCircle
                  size={96}
                  className="text-gray-400 dark:text-gray-500"
                />
              </div>
            )}

            <div className="space-y-4 text-gray-800 dark:text-gray-200">
              <p>
                <strong className="font-semibold text-gray-900 dark:text-white">
                  Email:
                </strong>{" "}
                {userDetails.email}
              </p>
              <p>
                <strong className="font-semibold text-gray-900 dark:text-white">
                  Username:
                </strong>{" "}
                {userDetails.username || "N/A"}
              </p>
              <p>
                <strong className="font-semibold text-gray-900 dark:text-white">
                  Age:
                </strong>{" "}
                {userDetails.age || "N/A"}
              </p>
              <p>
                <strong className="font-semibold text-gray-900 dark:text-white">
                  Location:
                </strong>{" "}
                {userDetails.location || "N/A"}
              </p>
              <p>
                <strong className="font-semibold text-gray-900 dark:text-white">
                  Preferred Workouts:
                </strong>{" "}
                {userDetails.preferredWorkouts &&
                userDetails.preferredWorkouts.length > 0
                  ? userDetails.preferredWorkouts.join(", ")
                  : "N/A"}
              </p>
              <p>
                <strong className="font-semibold text-gray-900 dark:text-white">
                  Fitness Goals:
                </strong>{" "}
                {userDetails.fitnessGoals && userDetails.fitnessGoals.length > 0
                  ? userDetails.fitnessGoals.join(", ")
                  : "N/A"}
              </p>
              <p>
                <strong className="font-semibold text-gray-900 dark:text-white">
                  Member Since:
                </strong>{" "}
                {formattedCreationDate}
              </p>
              <p>
                <strong className="font-semibold text-gray-900 dark:text-white">
                  User ID:
                </strong>{" "}
                <span className="break-all">{userDetails.uid}</span>
              </p>
              <p>
                <strong className="font-semibold text-gray-900 dark:text-white">
                  Last Updated:
                </strong>{" "}
                {userDetails.updatedAt
                  ? new Date(userDetails.updatedAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>

            <div className="mt-8 text-center space-y-3">
              <button
                onClick={handleGoToWorkoutTracker}
                className="w-full px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 font-semibold shadow-md flex items-center justify-center"
              >
                <Activity size={20} className="mr-2" />
                Track My Workouts
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 font-semibold shadow-md"
              >
                Go Back
              </button>
              <button
                onClick={() => navigate("/recommendations")}
                className="w-full px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-300 font-semibold shadow-md"
              >
                🎥 View Fitness Recommendations
              </button>
            </div>
          </>
        )}
      </div>

      {/* Responsive layout for the rest of the sections */}
      <div className="flex flex-col space-y-8 w-full max-w-md xl:flex-row xl:space-y-0 xl:space-x-8 xl:max-w-none xl:justify-center">
        {/* Buddy Matcher Section */}
        <div className="w-full xl:w-1/3">
          <BuddyMatcher />
        </div>

        {/* Notifications Display Section */}
        {firebaseUser && (
          <div className="w-full xl:w-1/3">
            <NotificationsDisplay />
          </div>
        )}

        {/* My Buddies List Section */}
        {firebaseUser &&
          userDetails &&
          userDetails.chats &&
          Object.keys(userDetails.chats).length > 0 && (
            <div className="w-full xl:w-1/3">
              <MyBuddiesList
                userId={firebaseUser.uid}
                chatRooms={userDetails.chats}
              />
            </div>
          )}
      </div>

      {/* Workout Tracker is now on its own page */}

      {/* Profile Completion Prompt Modal */}
      <ProfilePromptModal
        isOpen={showProfilePrompt && !isEditing && !loading && !error}
        onClose={handleDismissPrompt}
        onUpdateProfile={handleUpdateFromPrompt}
        percentage={profileCompletionPercentage}
      />
    </div>
  );
};

export default Profile;
