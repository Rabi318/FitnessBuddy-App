import React, { useState, useEffect } from "react";

const Rating = () => {
  const quotes = [
    {
      text: '"Friendly, easy-to-use app that keeps me accountable."',
      author: "Dinah L.",
    },
    {
      text: '"Absolutely transformed my daily routine. Highly recommend!"',
      author: "Marcus S.",
    },
    {
      text: '"The best tool for staying organized and motivated."',
      author: "Sarah P.",
    },
    {
      text: '"Simple yet powerful, it helps me achieve my goals."',
      author: "John D.",
    },
    {
      text: '"An essential app for anyone looking to improve their productivity."',
      author: "Emily R.",
    },
  ];

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [quotes.length]);

  return (
    <div className="bg-gray-900 flex flex-col items-center justify-center py-4 px-4 sm:px-6 lg:px-8 mb-2">
      <div className="flex space-x-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Path data for the star shape */}
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.927 8.71c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-2">
        3.5 Million 5-Star Ratings
      </h2>

      <p className="text-gray-300 text-lg sm:text-xl text-center italic mb-1 max-w-xl">
        {quotes[currentQuoteIndex].text}
      </p>

      <p className="text-gray-400 text-md sm:text-lg text-center mb-4">
        {quotes[currentQuoteIndex].author}
      </p>

      <div className="flex space-x-2">
        {quotes.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${
              index === currentQuoteIndex ? "bg-white" : "bg-gray-600"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Rating;
