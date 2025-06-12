import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import WorkoutTracker from "../components/WorkoutTracker";

const WorkoutTrackerPage = () => {
  const firebaseUser = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!firebaseUser || !firebaseUser.uid) {
      navigate("/");
      return;
    }
    if (firebaseUser !== undefined) {
      setAuthChecked(true);
    }
  }, [firebaseUser, navigate, authChecked]);
  if (!firebaseUser && !authChecked) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <p className="text-lg">Loading Workout tracker...</p>
      </div>
    );
  }
  if (firebaseUser) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-800 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <WorkoutTracker />
        </div>
      </div>
    );
  }
  return null;
};

export default WorkoutTrackerPage;
