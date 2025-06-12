import { get, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { db } from "../services/firebase";

const RecommendationsPage = () => {
  const user = useSelector((state) => state.auth.user);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      if (!user) return;

      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const { fitnessGoals = [], preferredWorkouts = [] } = snapshot.val();
        const searchTerms = [...fitnessGoals, ...preferredWorkouts].join(
          " OR "
        );

        const query = encodeURIComponent(searchTerms + " workout");
        const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&key=${apiKey}&maxResults=9`;
        // console.log("api key", apiKey);
        try {
          const res = await fetch(url);
          const data = await res.json();
          // console.log(data);
          setVideos(data.items || []);
        } catch (err) {
          console.error("Failed to fetch videos", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchVideos();
  }, [user]);

  if (loading) {
    return (
      <div className="text-center mt-10 text-white">Loading videos...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">
        🎥 Recommended Workouts
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div
            key={video.id.videoId}
            className="bg-gray-800 p-4 rounded-xl shadow-md"
          >
            <div className="w-full aspect-video">
              <iframe
                className="w-full h-full rounded-md"
                src={`https://www.youtube.com/embed/${video.id.videoId}`}
                title={video.snippet.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <p className="mt-3 font-semibold">{video.snippet.title}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <button
          onClick={() => navigate("/profile")}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          🔙 Back to Profile
        </button>
      </div>
    </div>
  );
};

export default RecommendationsPage;
