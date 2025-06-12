import { set } from "firebase/database";
import React, { use, useEffect, useState } from "react";

const EditProfileForm = ({
  currentUserDetails,
  onSave,
  onCancel,
  isLoading,
}) => {
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [preferredWorkouts, setPreferredWorkouts] = useState("");
  const [fitnessGoals, setFitnessGoals] = useState("");

  useEffect(() => {
    if (currentUserDetails) {
      setUsername(currentUserDetails.username || "");
      setAge(currentUserDetails.age || "");
      setLocation(currentUserDetails.location || "");
      setPreferredWorkouts(
        currentUserDetails.preferredWorkouts?.join(",") || ""
      );
      setFitnessGoals(currentUserDetails.fitnessGoals?.join(",") || "");
    }
  }, [currentUserDetails]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = {
      username: username,
      age: parseInt(age),
      location: location,
      preferredWorkouts: preferredWorkouts
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== ""),
      fitnessGoals: fitnessGoals
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== ""),
    };
    onSave(updatedData);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Username */}
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
      </div>

      {/* Age */}
      <div>
        <label
          htmlFor="age"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Age
        </label>
        <input
          type="number"
          id="age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      {/* Location */}
      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Location
        </label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      {/* Preferred Workouts */}
      <div>
        <label
          htmlFor="preferredWorkouts"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Preferred Workouts (comma-separated)
        </label>
        <textarea
          id="preferredWorkouts"
          value={preferredWorkouts}
          onChange={(e) => setPreferredWorkouts(e.target.value)}
          rows="3"
          placeholder="e.g., Running, Cycling, Yoga"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        ></textarea>
      </div>

      {/* Fitness Goals */}
      <div>
        <label
          htmlFor="fitnessGoals"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Fitness Goals (comma-separated)
        </label>
        <textarea
          id="fitnessGoals"
          value={fitnessGoals}
          onChange={(e) => setFitnessGoals(e.target.value)}
          rows="3"
          placeholder="e.g., Lose weight, Build muscle"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        ></textarea>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

export default EditProfileForm;
