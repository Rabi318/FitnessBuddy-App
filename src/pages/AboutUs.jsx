import React from "react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-6">
          About <span className="text-indigo-600">Ignite</span>
        </h1>
        <p className="text-lg sm:text-xl text-center mb-8 max-w-3xl mx-auto text-gray-700 dark:text-gray-300">
          Ignite is your all-in-one fitness companion — helping you set goals,
          join challenges, track your progress, and stay motivated every step of
          the way.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div>
            <h2 className="text-2xl font-semibold mb-4">🌟 Our Mission</h2>
            <p className="text-gray-700 dark:text-gray-300">
              We aim to build a supportive fitness community where everyone can
              start their journey — whether you're walking your first mile or
              training for a marathon. Through virtual challenges, daily
              tracking, and smart progress tools, we keep you accountable and
              inspired.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">💪 Why Ignite?</h2>
            <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Personalized fitness goals</li>
              <li>Goal-based challenges with real rewards</li>
              <li>Daily progress tracking & streaks</li>
              <li>Friendly community support</li>
              <li>Always free, always motivating</li>
            </ul>
          </div>
        </div>

        <div className="bg-indigo-100 dark:bg-indigo-800 rounded-xl p-6 text-center">
          <h3 className="text-2xl font-bold mb-2 text-indigo-800 dark:text-white">
            Ready to start your journey?
          </h3>
          <p className="mb-4 text-gray-800 dark:text-gray-200">
            Join a challenge today and take your first step toward a healthier
            life!
          </p>
          <Link
            to="/challenges"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 transition"
          >
            View Challenges
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
