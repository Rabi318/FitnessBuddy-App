// components/ChatWindow.jsx
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom"; // To get chatRoomId and otherUserId from URL
import {
  sendMessage,
  onMessagesChanged,
  fetchUserById,
} from "../services/authService";
import { UserCircle, Send } from "lucide-react";
import toast from "react-hot-toast";

const ChatWindow = () => {
  const { chatRoomId, otherUserId } = useParams(); // Get params from URL
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user); // Firebase Auth user object
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null); // Ref for auto-scrolling to latest message

  // Scroll to bottom whenever messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!currentUser || !currentUser.uid || !chatRoomId || !otherUserId) {
      navigate("/"); // Redirect if essential data is missing
      return;
    }

    setLoading(true);
    setError(null);

    // Fetch other user's profile details
    const getOtherUserDetails = async () => {
      try {
        const user = await fetchUserById(otherUserId);
        setOtherUser(user);
      } catch (err) {
        console.error("Error fetching other user details:", err);
        setError("Failed to fetch other user details.");
      }
    };

    getOtherUserDetails();

    // Set up real-time listener for messages
    const unsubscribe = onMessagesChanged(chatRoomId, (fetchedMessages) => {
      setMessages(fetchedMessages);
      setLoading(false);
    });

    // Clean up listener on component unmount
    return () => {
      unsubscribe();
    };
  }, [currentUser, chatRoomId, otherUserId, navigate]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    if (!currentUser || !currentUser.uid || !otherUser || !otherUser.username) {
      toast.error("Cannot send message: sender or recipient data missing.");
      return;
    }

    try {
      // Use the username from the current user's profile stored in Realtime DB
      // We assume `currentUser` (from Redux) has `uid` and we can fetch `username` from `users` node.
      // For simplicity here, we can fetch it if needed, but for now we'll rely on a complete profile.
      // A more robust app might pass the current user's full RTDB profile down.
      // For now, let's assume `currentUser.username` might exist if the user has updated their profile.
      // If not, fall back to email or a generic name.
      const senderUsername = otherUser.username; // This is a placeholder logic.
      // In a real app, `senderUsername` should be `currentUserProfile.username`.
      // For demonstration, let's use a simple fallback.
      const currentSenderProfile = await fetchUserById(currentUser.uid);
      const actualSenderUsername =
        currentSenderProfile?.username || currentUser.email || "Anonymous";

      await sendMessage(
        chatRoomId,
        currentUser.uid,
        actualSenderUsername,
        newMessage
      );
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <p className="text-lg">Loading chat...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-gray-100 dark:bg-gray-900 text-red-600 dark:text-red-400">
        <p className="text-lg">Error: {error}</p>
      </div>
    );
  }

  if (!otherUser) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <p className="text-lg">Could not load chat partner details.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[80vh] max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden my-8">
      {/* Chat Header */}
      <div className="flex items-center p-4 bg-blue-600 text-white shadow-md">
        <button
          onClick={() => navigate(-1)}
          className="mr-3 p-1 rounded-full hover:bg-blue-700 transition"
        >
          {/* Back Arrow */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
        {otherUser.photoURL ? (
          <img
            src={otherUser.photoURL}
            alt="Buddy Avatar"
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
        ) : (
          <UserCircle size={40} className="text-blue-200 mr-3" />
        )}
        <h2 className="text-xl font-semibold">
          {otherUser.username || "Buddy"}
        </h2>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 dark:bg-gray-900">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
            Say hello!
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.senderId === currentUser.uid
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-lg shadow ${
                  msg.senderId === currentUser.uid
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none"
                }`}
              >
                <p className="font-semibold text-sm mb-1">
                  {msg.senderId === currentUser.uid
                    ? "You"
                    : otherUser.username || "Buddy"}
                </p>
                <p>{msg.text}</p>
                <p className="text-xs text-right opacity-75 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} /> {/* For auto-scrolling */}
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <button
            type="submit"
            className="ml-3 p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50"
            disabled={newMessage.trim() === ""}
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
