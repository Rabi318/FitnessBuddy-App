import React from "react";
import { Link } from "react-router-dom";

const jobOpenings = [
  {
    id: 1,
    title: "Frontend Developer (React)",
    location: "Remote · Full Time",
    description:
      "We’re looking for a React developer passionate about clean UI, animations, and building fitness experiences people love.",
  },
  {
    id: 2,
    title: "Fitness Content Creator",
    location: "Remote · Part Time",
    description:
      "Help us inspire users with engaging workout routines, fitness blogs, and wellness tips tailored to all levels.",
  },
  {
    id: 3,
    title: "Community Manager",
    location: "Remote · Full Time",
    description:
      "Lead and grow our community of fitness enthusiasts, organize virtual events, and ensure everyone feels supported.",
  },
];

const Careers = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-6">
          Join <span className="text-indigo-600">IGNITE</span>
        </h1>
        <p className="text-lg sm:text-xl text-center mb-10 text-gray-700 dark:text-gray-300">
          We’re on a mission to make fitness fun, accessible, and social. Join
          our passionate team and build the future of fitness with us.
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          {jobOpenings.map((job) => (
            <div
              key={job.id}
              className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-2xl font-bold mb-2">{job.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                📍 {job.location}
              </p>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                {job.description}
              </p>
              <a
                href={`mailto:careers@fitnessbuddy.app?subject=Application for ${encodeURIComponent(
                  job.title
                )}`}
                className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
              >
                Apply Now
              </a>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-lg mb-4">
            Don’t see the right role? We're always open to great talent.
          </p>
          <a
            href="mailto:careers@ignite.app"
            className="text-indigo-600 hover:underline"
          >
            Email us at careers@ignite.app
          </a>
        </div>
      </div>
    </div>
  );
};

export default Careers;
