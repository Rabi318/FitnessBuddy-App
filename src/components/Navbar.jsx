import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout as logoutAction } from "../features/auth/authSlice";
import { logoutUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import {
  Moon,
  Sun,
  UserCircle,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Footprints,
  Bike,
  Mountain,
  Activity,
} from "lucide-react";
import Modal from "./Modal";
import AuthForm from "./AuthForm";
import useDarkMode from "../hooks/useDarkMode";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { theme, toggleTheme } = useDarkMode();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [menuOpen, setMenuOpen] = useState(false); // State for mobile sidebar visibility
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false); // State for desktop user dropdown
  const [isActivitiesDropdownOpen, setIsActivitiesDropdownOpen] =
    useState(false); // State for desktop Activities dropdown
  const [isActivitiesSidebarExpanded, setIsActivitiesSidebarExpanded] =
    useState(false); // State for mobile Activities expansion

  const sidebarRef = useRef(); // Ref for the mobile sidebar to detect clicks outside
  const desktopDropdownRef = useRef(); // Ref for the desktop user dropdown
  const activitiesDropdownRef = useRef(); // Ref for the desktop Activities dropdown

  // Effect to close mobile sidebar when clicking outside
  useEffect(() => {
    const handler = (e) => {
      // Close sidebar if open and click is outside sidebar and not on the hamburger button
      if (
        menuOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        if (!e.target.closest(".hamburger-button")) {
          setMenuOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  // Effect to close desktop user dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      // Close dropdown if open and click is outside dropdown and not on the avatar button
      if (
        isDesktopDropdownOpen &&
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(e.target)
      ) {
        if (!e.target.closest(".avatar-button")) {
          setIsDesktopDropdownOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isDesktopDropdownOpen]);

  // Effect to close desktop Activities dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (
        isActivitiesDropdownOpen &&
        activitiesDropdownRef.current &&
        !activitiesDropdownRef.current.contains(e.target)
      ) {
        // Ensure the click wasn't on the "Activities" button itself, which would handle its own toggle
        if (!e.target.closest(".activities-dropdown-button")) {
          setIsActivitiesDropdownOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isActivitiesDropdownOpen]);

  const handleLogout = async () => {
    await logoutUser();
    dispatch(logoutAction());
    setMenuOpen(false); // Close sidebar after logout
    setIsDesktopDropdownOpen(false); // Close desktop dropdown after logout
  };

  const handleAuthButtonClick = (mode) => {
    setAuthMode(mode);
    setIsModalOpen(true);
    setMenuOpen(false); // Close sidebar if auth modal is opened from it
    setIsDesktopDropdownOpen(false); // Close desktop dropdown if auth modal is opened from it
  };

  // Helper to close sidebar when a navigation link is clicked inside it
  const handleNavLinkClick = () => {
    setMenuOpen(false);
  };

  // Sub-menu items for Activities
  const activitiesSubMenu = [
    { name: "Running", path: "/activities/running", icon: Activity },
    { name: "Walking", path: "/activities/walking", icon: Footprints },
    { name: "Cycling", path: "/activities/cycling", icon: Bike },
    { name: "Hiking", path: "/activities/hiking", icon: Mountain },
  ];

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 shadow-md p-4 flex justify-between items-center relative z-20">
        {/* Hamburger Menu Button - Visible on small screens, hidden on large */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="lg:hidden text-gray-800 dark:text-white p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition hamburger-button"
          aria-label="Open menu"
        >
          <Menu size={28} />
        </button>

        {/* Logo - Always visible on large screens, only in sidebar for small screens */}
        <img
          src={theme === "dark" ? "/lightlogo.png" : "/darklogo.png"}
          alt="FitnessBuddy Logo"
          className="h-10 w-auto object-contain transition duration-300 hidden lg:block"
        />

        {/* Main Navbar Controls (Navigation Links, Theme Toggle & Auth) */}
        <div className="flex items-center gap-4">
          {" "}
          {/* This div now holds all right-side elements */}
          {/* Desktop Navigation Links - Hidden on small screens, flex on large */}
          <div className="hidden lg:flex items-center gap-6 text-gray-700 dark:text-gray-200">
            {/* Activities Dropdown for Desktop */}
            <div className="relative" ref={activitiesDropdownRef}>
              <button
                onClick={() => setIsActivitiesDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1 hover:text-blue-500 transition activities-dropdown-button"
              >
                Activities
                {isActivitiesDropdownOpen ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
              {isActivitiesDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded shadow-lg z-50">
                  {activitiesSubMenu.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.name}
                        onClick={() => {
                          navigate(item.path);
                          setIsActivitiesDropdownOpen(false);
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700"
                      >
                        {Icon && <Icon size={18} />}
                        {item.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <a href="#" className="hover:text-blue-500 transition">
              Features
            </a>
            <a href="#" className="hover:text-blue-500 transition">
              Challenges
            </a>
            <a href="#" className="hover:text-blue-500 transition">
              Subscription
            </a>
          </div>
          {/* Dark-mode toggle - Always visible on navbar */}
          <button
            onClick={toggleTheme}
            className="text-xl text-gray-800 dark:text-white hover:text-blue-500 transition cursor-pointer"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
          </button>
          {/* **** Auth area for Main Navbar **** */}
          {user ? (
            // Avatar and dropdown - Always visible on navbar
            <div className="relative" ref={desktopDropdownRef}>
              <button
                onClick={() => setIsDesktopDropdownOpen((prev) => !prev)}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 cursor-pointer avatar-button"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="User avatar"
                    className="w-9 h-9 rounded-full object-cover"
                  />
                ) : (
                  <UserCircle
                    size={28}
                    className="text-gray-600 dark:text-gray-200"
                  />
                )}
              </button>

              {isDesktopDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded shadow-lg z-50 ">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setIsDesktopDropdownOpen(false); // Close desktop dropdown
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Plain old Login button - Always visible on navbar
            <button
              onClick={() => handleAuthButtonClick("login")}
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {/* Sidebar for Mobile */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl transform z-40 transition-transform duration-300 ease-in-out
          ${menuOpen ? "translate-x-0" : "-translate-x-full"} lg:hidden`} // Visible only on small screens
      >
        <div className="p-4 flex flex-col h-full">
          {/* Sidebar Header: Logo and Close Button */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700 mb-4">
            {/* Logo inside sidebar - only visible when sidebar is open */}
            <img
              src={theme === "dark" ? "/lightlogo.png" : "/darklogo.png"}
              alt="FitnessBuddy Logo"
              className="h-10 w-auto object-contain"
            />
            {/* Close button */}
            <button
              onClick={() => setMenuOpen(false)}
              className="text-gray-800 dark:text-white p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              aria-label="Close menu"
            >
              <X size={28} />
            </button>
          </div>

          {/* Sidebar Content: Navigation Links and Auth/User options */}
          <div className="flex flex-col flex-grow space-y-4">
            {/* Dark-mode toggle with text for sidebar */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 text-xl text-gray-800 dark:text-white hover:text-blue-500 transition cursor-pointer p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
              <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </button>

            {/* Activities section for Sidebar with expand/collapse */}
            <div className="flex flex-col">
              <button
                onClick={() => setIsActivitiesSidebarExpanded((prev) => !prev)}
                className="flex items-center justify-between w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200"
              >
                <span>Activities</span>
                {isActivitiesSidebarExpanded ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
              {isActivitiesSidebarExpanded && (
                <div className="ml-4 mt-2 space-y-2">
                  {activitiesSubMenu.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.name}
                        onClick={() => {
                          navigate(item.path);
                          handleNavLinkClick();
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-gray-600 dark:text-gray-400 cursor-pointer"
                      >
                        {Icon && <Icon size={18} />}
                        {item.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Other Navigation Links for Sidebar */}
            <button
              onClick={() => {
                navigate("#features");
                handleNavLinkClick();
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200"
            >
              Features
            </button>
            <button
              onClick={() => {
                navigate("#challenges");
                handleNavLinkClick();
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200"
            >
              Challenges
            </button>
            <button
              onClick={() => {
                navigate("#subscription");
                handleNavLinkClick();
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200"
            >
              Subscription
            </button>

            {/* Auth area for Mobile Sidebar (kept for Profile/Logout) */}
            {user && (
              <>
                <button
                  onClick={() => {
                    navigate("/profile");
                    handleNavLinkClick();
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Auth modal  */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AuthForm
          mode={authMode}
          switchMode={() =>
            setAuthMode((prev) => (prev === "login" ? "register" : "login"))
          }
          closeModal={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
};

export default Navbar;
