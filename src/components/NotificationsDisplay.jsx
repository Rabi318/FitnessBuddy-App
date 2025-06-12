// components/NotificationsDisplay.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ref, onValue, off } from "firebase/database";
import { db } from "../services/firebase";
import {
  updateBuddyRequestStatus,
  createChatRoom,
} from "../services/authService";
import { UserCircle, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const NotificationsDisplay = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const navigate = useNavigate(); // Initialize navigate hook
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser || !currentUser.uid) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const notificationsRef = ref(db, `notifications/${currentUser.uid}`);

    // Set up a real-time listener
    const unsubscribe = onValue(
      notificationsRef,
      (snapshot) => {
        const data = snapshot.val();
        const loadedNotifications = [];
        if (data) {
          // Convert the object of notifications into an array
          Object.keys(data).forEach((key) => {
            loadedNotifications.push({ id: key, ...data[key] });
          });
        }
        // Filter for pending buddy requests
        const pendingRequests = loadedNotifications.filter(
          (notif) =>
            notif.type === "buddy_request" && notif.status === "pending"
        );
        setNotifications(pendingRequests.reverse()); // Show most recent first
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching notifications:", err);
        setError("Failed to load notifications: " + err.message);
        setLoading(false);
      }
    );

    // Clean up the listener when the component unmounts or user changes
    return () => off(notificationsRef, "value", unsubscribe);
  }, [currentUser]);

  const handleAcceptRequest = async (notification) => {
    setLoading(true);
    try {
      // Create a chat room between the current user and the sender
      const chatRoomId = await createChatRoom(
        notification.senderId,
        notification.recipientId
      );
      // Update the notification status to accepted and link the chat room
      await updateBuddyRequestStatus(
        notification.recipientId,
        notification.id,
        "accepted",
        chatRoomId
      );
      toast.success(
        `Buddy request from ${notification.senderUsername} accepted! Chat started.`
      );
      // Navigate to the chat window
      navigate(`/chat/${chatRoomId}/${notification.senderId}`);
    } catch (err) {
      console.error("Error accepting request:", err);
      toast.error("Failed to accept request: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRequest = async (notification) => {
    setLoading(true);
    try {
      await updateBuddyRequestStatus(
        notification.recipientId,
        notification.id,
        "rejected"
      );
      toast.info(`Buddy request from ${notification.senderUsername} rejected.`);
    } catch (err) {
      console.error("Error rejecting request:", err);
      toast.error("Failed to reject request: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-700 dark:text-gray-300">
        Loading notifications...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600 dark:text-red-400">
        Error loading notifications: {error}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="p-4 text-center text-gray-700 dark:text-gray-300">
        No new buddy requests.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 mt-8 mx-auto max-w-sm">
      <h3 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6">
        New Buddy Requests ({notifications.length})
      </h3>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md shadow-sm"
          >
            <UserCircle
              size={40}
              className="text-gray-400 dark:text-gray-500"
            />
            <div className="flex-grow">
              <p className="font-semibold text-gray-900 dark:text-white">
                {notification.senderUsername || "Someone"} wants to connect!
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(notification.timestamp).toLocaleString()}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleAcceptRequest(notification)}
                className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white transition disabled:opacity-50"
                disabled={loading}
                title="Accept Request"
              >
                <CheckCircle size={20} />
              </button>
              <button
                onClick={() => handleRejectRequest(notification)}
                className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition disabled:opacity-50"
                disabled={loading}
                title="Reject Request"
              >
                <XCircle size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsDisplay;
