// components/Navbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout as logoutAction } from "../features/auth/authSlice";
import { logoutUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Moon, Sun, UserCircle } from "lucide-react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    dispatch(logoutAction()); // resets slice to initial state
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-white  dark:bg-gray-900 shadow-md p-4 flex justify-between items-center ">
        <img
          src={theme === "dark" ? "/lightlogo.png" : "/darklogo.png"}
          alt="FitnessBuddy Logo"
          className="h-10 w-auto object-contain transition duration-300"
        />

        <div className="flex items-center gap-4">
          {/* Dark-mode toggle */}
          <button
            onClick={toggleTheme}
            className="text-xl text-gray-800 dark:text-white hover:text-blue-500 transition"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
          </button>

          {/*  **** Auth area ****  */}
          {user ? (
            // Avatar and dropdown
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700"
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

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded shadow-lg z-50">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setMenuOpen(false);
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
            // Plain old Login button
            <button
              onClick={() => {
                setAuthMode("login");
                setIsModalOpen(true);
              }}
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {/* Auth modal (unchanged) */}
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
