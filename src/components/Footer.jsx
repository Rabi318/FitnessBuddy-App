import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-900 dark:bg-[#212738] dark:text-white py-12 px-4 md:px-8 font-inter border-t-4 border-red-500 rounded-t-4xl  shadow-2xl">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Brand Section */}
        <div className="col-span-1 lg:col-span-2 flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="text-3xl font-bold mb-2 tracking-widest italic">
            IGNITE
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Nutrition tracking for real life.
          </p>
          <button className="bg-white text-blue-700 font-bold py-3 px-6 rounded-full shadow-lg hover:bg-gray-100 transition duration-300 flex items-center justify-center">
            START TODAY
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <div className="col-span-1">
          <h3 className="font-bold text-lg mb-4">Products</h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li>
              <a
                href="#"
                className="hover:text-gray-800 dark:hover:text-white transition duration-200"
              >
                Exercise
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-800 dark:hover:text-white transition duration-200"
              >
                Apps
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-800 dark:hover:text-white transition duration-200"
              >
                Premium
              </a>
            </li>
          </ul>
        </div>

        <div className="col-span-1">
          <h3 className="font-bold text-lg mb-4">Resources</h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li>
              <a
                href="#"
                className="hover:text-gray-800 dark:hover:text-white transition duration-200"
              >
                Blog
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-800 dark:hover:text-white transition duration-200"
              >
                Community
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-800 dark:hover:text-white transition duration-200"
              >
                Contact Us
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-800 dark:hover:text-white transition duration-200"
              >
                Support Center
              </a>
            </li>
          </ul>
        </div>

        <div className="col-span-1">
          <h3 className="font-bold text-lg mb-4">Company</h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li>
              <a
                href="#"
                className="hover:text-gray-800 dark:hover:text-white transition duration-200"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-800 dark:hover:text-white transition duration-200"
              >
                Careers
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-800 dark:hover:text-white transition duration-200"
              >
                Press
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-800 dark:hover:text-white transition duration-200"
              >
                Advertise With Us
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-12 pt-8 border-t border-gray-300 dark:border-gray-700 text-center text-gray-600 dark:text-gray-400 text-sm">
        <p className="mb-4">
          &copy; {new Date().getFullYear()} MyFitnessPal, Inc. Community
          Guidelines Feedback Terms Privacy API Cookie Preferences
        </p>
        <div className="flex justify-center space-x-6">
          {/* Social Media Icons (using Phosphor Icons or similar visual placeholders) */}
          <a
            href="#"
            aria-label="Instagram"
            className="hover:text-gray-800 dark:hover:text-white transition duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,0-12,12A12,12,0,0,0,192,76Z"></path>
            </svg>
          </a>
          <a
            href="#"
            aria-label="Facebook"
            className="hover:text-gray-800 dark:hover:text-white transition duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Zm-26.27,47.88a8,8,0,0,0-11.45-1.12L159.2,166.4H144a8,8,0,0,1-8-8V136a8,8,0,0,1,8-8h16a8,8,0,0,0,0-16H144a8,8,0,0,1-8-8V96a8,8,0,0,1,8-8h16a8,8,0,0,0,0-16H144a24,24,0,0,0-24,24v16H104a8,8,0,0,0,0,16h16v16a8,8,0,0,0,8,8h16v26.28a8,8,0,0,0,4.89,7.43l13.56,3.61a8,8,0,0,0,9.15-5.31l1.79-6.72Z"></path>
            </svg>
          </a>
          <a
            href="#"
            aria-label="YouTube"
            className="hover:text-gray-800 dark:hover:text-white transition duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M229.66,80.12a28.84,28.84,0,0,0-20.31-20.31C200.58,56,128,56,128,56S55.42,56,46.65,59.81A28.84,28.84,0,0,0,26.34,80.12C22.5,89,22.5,128,22.5,128s0,39,3.84,47.88a28.84,28.84,0,0,0,20.31,20.31C55.42,200,128,200,128,200s72.58,0,81.35-3.81a28.84,28.84,0,0,0,20.31-20.31C233.5,167,233.5,128,233.5,128S233.5,89,229.66,80.12ZM104,158.74V97.26L160,128Z"></path>
            </svg>
          </a>
          <a
            href="#"
            aria-label="LinkedIn"
            className="hover:text-gray-800 dark:hover:text-white transition duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24ZM88,200H56V104H88ZM72,88a16,16,0,1,1,16-16A16,16,0,0,1,72,88Zm120,112H168V144c0-12.8,1.6-24,17.6-24,16,0,16,15.2,16,24v56H136V144c0-12.8,1.6-24,17.6-24,16,0,16,15.2,16,24v56H104V104h32v16h.8C140,116.8,144,112,152,112c24,0,40,16,40,48v56Z"></path>
            </svg>
          </a>
          <a
            href="#"
            aria-label="TikTok"
            className="hover:text-gray-800 dark:hover:text-white transition duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M224,122.38V104a8,8,0,0,0-16,0v18.38C208,82.47,175.53,56,144,56H128a8,8,0,0,0-8,8V180a8,8,0,0,0,16,0V112h16c31.53,0,64,26.47,64,66.38v18.24a8,8,0,0,0,16,0V178.38C240,138.47,207.53,112,176,112H160V80.09A100.22,100.22,100.22,0,0,1,96,24a8,8,0,0,0,0,16c33,0,61.76,20.4,73.5,49.88a8,8,0,0,0,7.85,6.13H208a8,8,0,0,0,8-8V80.09Z"></path>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
