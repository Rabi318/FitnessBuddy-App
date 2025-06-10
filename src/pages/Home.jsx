import React from "react";
import phoneImage from "../assets/hero-phone-large.webp";
import Rating from "../components/Rating";
import Banner from "../components/Banner";

const Home = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-200 dark:bg-gray-800 p-6 md:p-12 transition-colors duration-300">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* Text Content */}
          <div className="flex-1 space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
              #1 fitness tracking app
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300">
              Fitness tracking for real life
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Make progress with the all-in-one food, exercise, and calorie
              tracker.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full text-lg transition duration-300">
              START TODAY &gt;
            </button>

            <div className="flex justify-center md:justify-start items-center gap-4 pt-4">
              <span className="text-gray-800 dark:text-gray-200 font-bold">
                ignite
              </span>
              <span className="text-gray-500 dark:text-gray-400">museum</span>
            </div>
          </div>

          {/* Phone Image */}
          <div className="flex-1 max-w-md flex justify-center">
            <img
              src={phoneImage}
              alt="MyFitnessPal app on phone"
              className="w-full h-auto max-w-[300px] md:max-w-[350px] object-contain"
            />
          </div>
        </div>
      </div>
      <Rating />
      <Banner />
    </>
  );
};

export default Home;
