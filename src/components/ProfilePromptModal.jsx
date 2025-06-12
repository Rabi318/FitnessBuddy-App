// components/ProfilePromptModal.jsx
import React from "react";

const ProfilePromptModal = ({
  isOpen,
  onClose,
  onUpdateProfile,
  percentage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-sm text-center transform transition-all scale-100 opacity-100">
        <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">
          Complete Your Profile!
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Your profile is{" "}
          <strong className="text-blue-600 dark:text-blue-400">
            {percentage}% complete
          </strong>
          .
          <br />
          Update it for the best buddy matches!
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-6">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={onUpdateProfile}
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 font-semibold shadow-md cursor-pointer"
          >
            Update Profile
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition duration-300 cursor-pointer"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePromptModal;
