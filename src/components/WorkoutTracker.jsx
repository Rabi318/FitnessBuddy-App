import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addWorkout,
  deleteWorkout,
  onWorkoutsChanged,
  updateWorkout,
} from "../services/authService";
import toast from "react-hot-toast";
import { List, PlusCircle, ArrowLeft } from "lucide-react";

const workoutTypes = [
  "Running",
  "Weightlifting",
  "Cycling",
  "Swimming",
  "Yoga",
  "HIIT",
  "Walking",
  "Other",
];

const WorkoutTracker = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const [workoutType, setWorkoutType] = useState("");
  const [duration, setDuration] = useState("");
  const [distance, setDistance] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [sets, setSets] = useState("");
  const [notes, setNotes] = useState("");
  const [workoutDate, setWorkoutDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [loggingLoading, setLoggingLoading] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const [fetchingWorkoutsLoading, setFetchingWorkoutsLoading] = useState(true);
  const [fetchingWorkoutsError, setFetchingWorkoutsError] = useState(null);
  const [editingWorkoutId, setEditingWorkoutId] = useState(null);
  const [editingWorkoutData, setEditingWorkoutData] = useState(null);

  useEffect(() => {
    if (!currentUser || !currentUser.uid) {
      setWorkouts([]);
      setFetchingWorkoutsLoading(false);
      return;
    }

    setFetchingWorkoutsLoading(true);
    setFetchingWorkoutsError(null);

    const unsubscribe = onWorkoutsChanged(
      currentUser.uid,
      (fetchedWorkouts) => {
        setWorkouts(fetchedWorkouts);
        setFetchingWorkoutsLoading(false);
      },
      (err) => {
        console.error("Error fetching workouts:", err);
        setFetchingWorkoutsError("Failed to load workouts: " + err.message);
        setFetchingWorkoutsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // const handleLogWorkout = async (e) => {
  //   e.preventDefault();
  //   if (!currentUser || !currentUser.uid) {
  //     toast.error("Please log in to track workouts.");
  //     return;
  //   }
  //   if (!workoutType || !workoutDate) {
  //     toast.error("Please fill in workout type and date.");
  //     return;
  //   }

  //   setLoggingLoading(true);
  //   const workoutData = {
  //     type: workoutType,
  //     date: workoutDate,
  //     notes: notes.trim(),
  //   };

  //   // --- Strict validation and parsing for duration ---
  //   const parsedDuration = parseFloat(duration);
  //   if (isNaN(parsedDuration) || parsedDuration <= 0) {
  //     toast.error("Duration must be a valid positive number.");
  //     setLoggingLoading(false);
  //     return;
  //   }
  //   workoutData.duration = parsedDuration;

  //   // Add specific fields based on workout type, ensuring they are valid numbers
  //   if (["Running", "Cycling", "Swimming", "Walking"].includes(workoutType)) {
  //     const parsedDistance = parseFloat(distance);
  //     if (!isNaN(parsedDistance)) {
  //       workoutData.distance = parsedDistance;
  //     }
  //   } else if (workoutType === "Weightlifting") {
  //     const parsedWeight = parseFloat(weight);
  //     if (!isNaN(parsedWeight)) {
  //       workoutData.weight = parsedWeight;
  //     }
  //     const parsedReps = parseInt(reps);
  //     if (!isNaN(parsedReps)) {
  //       workoutData.reps = parsedReps;
  //     }
  //     const parsedSets = parseInt(sets);
  //     if (!isNaN(parsedSets)) {
  //       workoutData.sets = parsedSets;
  //     }
  //   }

  //   // --- FINAL SANITIZATION: Filter out any undefined values before sending to Firebase ---
  //   const cleanWorkoutData = {};
  //   for (const key in workoutData) {
  //     // Ensure the value is not undefined. null is allowed, but undefined is not.
  //     if (workoutData[key] !== undefined && workoutData[key] !== "") {
  //       cleanWorkoutData[key] = workoutData[key];
  //     }
  //   }

  //   try {
  //     // Send the cleaned data to Firebase
  //     await addWorkout(currentUser.uid, cleanWorkoutData);
  //     toast.success("Workout logged successfully!");
  //     // Reset form fields
  //     setWorkoutType("");
  //     setDuration("");
  //     setDistance("");
  //     setWeight("");
  //     setReps("");
  //     setSets("");
  //     setNotes("");
  //     setWorkoutDate(new Date().toISOString().slice(0, 10));
  //   } catch (err) {
  //     console.error("Error logging workout:", err);
  //     toast.error("Failed to log workout: " + err.message);
  //   } finally {
  //     setLoggingLoading(false);
  //   }
  // };

  const handleLogWorkout = async (e) => {
    e.preventDefault();
    if (!currentUser?.uid) return;

    const workoutData = {
      type: workoutType,
      date: workoutDate,
      duration: parseFloat(duration),
      notes: notes.trim(),
    };

    // Add conditional fields
    if (["Running", "Cycling", "Swimming", "Walking"].includes(workoutType)) {
      workoutData.distance = parseFloat(distance) || null;
    } else if (workoutType === "Weightlifting") {
      workoutData.weight = parseFloat(weight) || null;
      workoutData.reps = parseInt(reps) || null;
      workoutData.sets = parseInt(sets) || null;
    }

    try {
      if (editingWorkoutId) {
        await updateWorkout(currentUser.uid, editingWorkoutId, workoutData);
        toast.success("Workout updated successfully!");
      } else {
        await addWorkout(currentUser.uid, workoutData);
        toast.success("Workout logged successfully!");
      }
      resetForm();
      setEditingWorkoutId(null);
    } catch (err) {
      console.error("Error saving workout:", err);
      toast.error("Failed to save workout.");
    }
  };
  const handleGoBackToProfile = () => {
    navigate("/profile");
  };

  // Handle Edit Workout
  const handleEditWorkout = (workout) => {
    setEditingWorkoutId(workout.id);
    setEditingWorkoutData(workout);

    // Pre-fill form with workout data
    setWorkoutType(workout.type);
    setDuration(workout.duration.toString());
    setDistance(workout.distance?.toString() || "");
    setWeight(workout.weight?.toString() || "");
    setReps(workout.reps?.toString() || "");
    setSets(workout.sets?.toString() || "");
    setNotes(workout.notes || "");
    setWorkoutDate(workout.date);
  };

  // Handle Delete Workout
  const handleDeleteWorkout = async (workoutId) => {
    if (!currentUser?.uid || !workoutId) return;

    try {
      await deleteWorkout(currentUser.uid, workoutId);
      toast.success("Workout deleted successfully!");
    } catch (err) {
      console.error("Error deleting workout:", err);
      toast.error("Failed to delete workout.");
    }
  };

  // Handle Update Workout (called when submitting an edited workout)
  const handleUpdateWorkout = async (e) => {
    e.preventDefault();
    if (!currentUser?.uid || !editingWorkoutId) return;

    const updatedData = {
      type: workoutType,
      date: workoutDate,
      duration: parseFloat(duration),
      notes: notes.trim(),
    };

    // Add conditional fields
    if (["Running", "Cycling", "Swimming", "Walking"].includes(workoutType)) {
      updatedData.distance = parseFloat(distance) || null;
    } else if (workoutType === "Weightlifting") {
      updatedData.weight = parseFloat(weight) || null;
      updatedData.reps = parseInt(reps) || null;
      updatedData.sets = parseInt(sets) || null;
    }

    try {
      await updateWorkout(currentUser.uid, editingWorkoutId, updatedData);
      toast.success("Workout updated successfully!");

      // Reset form and editing state
      setEditingWorkoutId(null);
      setEditingWorkoutData(null);
      resetForm();
    } catch (err) {
      console.error("Error updating workout:", err);
      toast.error("Failed to update workout.");
    }
  };

  // Reset form fields
  const resetForm = () => {
    setWorkoutType("");
    setDuration("");
    setDistance("");
    setWeight("");
    setReps("");
    setSets("");
    setNotes("");
    setWorkoutDate(new Date().toISOString().slice(0, 10));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          Workout Tracker
        </h3>
        <button
          onClick={handleGoBackToProfile}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition duration-300 shadow-md"
          aria-label="Go back to profile"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Log New Workout Form */}
      <div className="mb-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700">
        <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <PlusCircle size={20} className="mr-2 text-blue-500" /> Log New
          Workout
        </h4>
        <form onSubmit={handleLogWorkout} className="space-y-3">
          <div>
            <label
              htmlFor="workoutType"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Workout Type
            </label>
            <select
              id="workoutType"
              value={workoutType}
              onChange={(e) => setWorkoutType(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              required
            >
              <option value="">Select type</option>
              {workoutTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Duration (minutes)
            </label>
            <input
              type="number"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 60"
              min="1"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              required
            />
          </div>

          <div>
            <label
              htmlFor="workoutDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Date
            </label>
            <input
              type="date"
              id="workoutDate"
              value={workoutDate}
              onChange={(e) => setWorkoutDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              required
            />
          </div>

          {["Running", "Cycling", "Swimming", "Walking"].includes(
            workoutType
          ) && (
            <div>
              <label
                htmlFor="distance"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Distance (km/miles)
              </label>
              <input
                type="number"
                id="distance"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="e.g., 5.0"
                step="0.1"
                min="0"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              />
            </div>
          )}

          {workoutType === "Weightlifting" && (
            <>
              <div>
                <label
                  htmlFor="weight"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Weight (kg/lbs)
                </label>
                <input
                  type="number"
                  id="weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g., 50"
                  step="0.1"
                  min="0"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                />
              </div>
              <div>
                <label
                  htmlFor="reps"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Reps
                </label>
                <input
                  type="number"
                  id="reps"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  placeholder="e.g., 10"
                  min="1"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                />
              </div>
              <div>
                <label
                  htmlFor="sets"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Sets
                </label>
                <input
                  type="number"
                  id="sets"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  placeholder="e.g., 3"
                  min="1"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                />
              </div>
            </>
          )}

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="2"
              placeholder="Any additional notes about this workout..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed font-semibold"
            disabled={loggingLoading || !currentUser}
          >
            {loggingLoading
              ? editingWorkoutId
                ? "Updating..."
                : "Logging..."
              : editingWorkoutId
              ? "Update Workout"
              : "Log Workout"}
          </button>
          {!currentUser && (
            <p className="text-red-500 text-sm text-center mt-2">
              You must be logged in to log workouts.
            </p>
          )}
          {editingWorkoutId && (
            <button
              type="button"
              onClick={() => {
                setEditingWorkoutId(null);
                resetForm();
              }}
              className="w-full mt-2 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition duration-300"
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      {/* Past Workouts List */}
      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700">
        <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <List size={20} className="mr-2 text-blue-500" /> Your Workouts
        </h4>
        {fetchingWorkoutsLoading ? (
          <p className="text-center text-gray-700 dark:text-gray-300">
            Loading workouts...
          </p>
        ) : fetchingWorkoutsError ? (
          <p className="text-center text-red-600 dark:text-red-400">
            Error: {fetchingWorkoutsError}
          </p>
        ) : workouts.length === 0 ? (
          <p className="text-center text-gray-700 dark:text-gray-300">
            No workouts logged yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {workouts.map((workout) => (
              <li
                key={workout.id}
                className="p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm relative"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {workout.type} - {workout.duration} mins
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Date: {new Date(workout.date).toLocaleDateString()}{" "}
                      (Logged: {new Date(workout.loggedAt).toLocaleDateString()}
                      )
                    </p>

                    {/* Conditionally rendered workout details */}
                    {workout.distance !== undefined &&
                      workout.distance !== null && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Distance: {workout.distance} km
                        </p>
                      )}
                    {workout.weight !== undefined &&
                      workout.weight !== null && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Weight: {workout.weight} kg
                        </p>
                      )}
                    {workout.reps !== undefined && workout.reps !== null && (
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Reps: {workout.reps}
                      </p>
                    )}
                    {workout.sets !== undefined && workout.sets !== null && (
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Sets: {workout.sets}
                      </p>
                    )}
                    {workout.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Notes: {workout.notes}
                      </p>
                    )}
                  </div>

                  {/* Edit/Delete Buttons */}
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEditWorkout(workout)}
                      className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      aria-label="Edit workout"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteWorkout(workout.id)}
                      className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      aria-label="Delete workout"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default WorkoutTracker;
