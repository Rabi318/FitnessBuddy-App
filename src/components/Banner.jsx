import React from "react";

const Banner = () => {
  return (
    <div className="bg-gray-800 text-white py-8 px-4 flex flex-col items-center justify-center space-y-4 lg:flex-row lg:space-x-8 lg:space-y-0 dark:bg-gray-900 dark:text-white mb-1">
      <img
        src="https://web-assets.strava.com/assets/landing-pages/_next/static/media/DesktopWide-Col-1-en-US@2x.132923dc.webp"
        alt="Delicious Food 1"
        className="w-full max-w-md h-auto rounded-lg shadow-lg object-cover"
        // Fallback for image loading errors
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            "https://placehold.co/400x300/F0F0F0/2C2C2C?text=Image+Error";
        }}
      />

      <p className="text-3xl lg:text-4xl font-bold text-center px-4">
        If it’s edible, it’s in here
      </p>

      <img
        src="https://web-assets.strava.com/assets/landing-pages/_next/static/media/DesktopWide-Col-3-en-US@2x.2220d07a.webp"
        alt="Delicious Food 2"
        className="w-full max-w-md h-auto rounded-lg shadow-lg object-cover"
        // Fallback for image loading errors
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            "https://placehold.co/400x300/D0D0D0/2C2C2C?text=Image+Error";
        }}
      />
    </div>
  );
};

export default Banner;
