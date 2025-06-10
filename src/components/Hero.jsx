import { Moon, Sun } from "lucide-react";
import React, { useEffect, useState } from "react";

const Hero = () => {
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPeferenceDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (systemPeferenceDark) {
      setTheme("dark");
    }
  }, []);
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };
  return (
    <div>
      <button
        onClick={toggleTheme}
        className="text-xl text-gray-800 dark:text-white hover:text-blue-500 transition"
        title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
      </button>
    </div>
  );
};

export default Hero;
