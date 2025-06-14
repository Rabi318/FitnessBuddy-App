import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import { setUser } from "./features/auth/authSlice";
import Footer from "./components/Footer";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ChatWindow from "./components/ChatWindow";
import WorkoutTrackerPage from "./pages/WorkoutTrackerPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import Challenges from "./pages/Challenges";
import MyChallenges from "./pages/MyChallenges";
import AboutUs from "./pages/AboutUs";
import Careers from "./pages/Careers";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      dispatch(setUser(firebaseUser ?? null));
    });
    return () => unsubscribe();
  }, [dispatch]);
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <Toaster position="top-right" reverseOrder={true} />
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      <main className="flex-grow pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/chat/:chatRoomId/:otherUserId"
            element={<ChatWindow />}
          />
          <Route path="/workout-tracker" element={<WorkoutTrackerPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/my-challenges" element={<MyChallenges />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/careers" element={<Careers />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
