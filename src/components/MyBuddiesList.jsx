// components/MyBuddiesList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserById, onMessagesChanged } from "../services/authService"; // Import onMessagesChanged to get chat metadata
import { ref, onValue, off } from "firebase/database"; // Realtime DB imports
import { db } from "../services/firebase"; // Your Realtime Database instance
import { UserCircle, MessageCircle } from "lucide-react"; // Message icon for chat button
import toast from "react-hot-toast";

const MyBuddiesList = ({ userId, chatRooms }) => {
  const navigate = useNavigate();
  const [buddies, setBuddies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId || !chatRooms || Object.keys(chatRooms).length === 0) {
      setBuddies([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const fetchBuddyDetails = async () => {
      const buddiesData = [];
      const chatRoomPromises = [];

      for (const chatRoomId in chatRooms) {
        if (chatRooms.hasOwnProperty(chatRoomId)) {
          // Listen to the chat room to get participant UIDs
          const chatRoomRef = ref(db, `chatRooms/${chatRoomId}`);
          chatRoomPromises.push(
            new Promise((resolve) => {
              onValue(
                chatRoomRef,
                async (snapshot) => {
                  const chatData = snapshot.val();
                  if (chatData && chatData.participants) {
                    // Determine the other user's UID
                    const participantIds = Object.keys(chatData.participants);
                    const otherId = participantIds.find((id) => id !== userId);

                    if (otherId) {
                      try {
                        const otherUser = await fetchUserById(otherId);
                        if (otherUser) {
                          buddiesData.push({
                            chatRoomId: chatRoomId,
                            otherUserId: otherId,
                            otherUsername:
                              otherUser.username || "Unknown Buddy",
                            otherUserPhotoURL: otherUser.photoURL || null,
                            // You can add more details from otherUser's profile here
                          });
                        }
                      } catch (err) {
                        console.error(`Error fetching user ${otherId}:`, err);
                        // Don't block if one user fails
                      }
                    }
                  }
                  resolve(); // Resolve the promise once processing for this chat room is done
                },
                (err) => {
                  console.error(
                    `Error listening to chatRoom ${chatRoomId}:`,
                    err
                  );
                  resolve(); // Resolve even on error to unblock promise.all
                },
                { onlyOnce: true }
              ); // Use onlyOnce to avoid continuous listening for initial fetch
            })
          );
        }
      }

      // Wait for all chat room details to be fetched
      await Promise.all(chatRoomPromises);

      // Filter out duplicates if any (though typically won't happen with unique chatRoomIds)
      const uniqueBuddies = [];
      const seenUids = new Set();
      buddiesData.forEach((buddy) => {
        if (!seenUids.has(buddy.otherUserId)) {
          uniqueBuddies.push(buddy);
          seenUids.add(buddy.otherUserId);
        }
      });

      setBuddies(uniqueBuddies);
      setLoading(false);
    };

    fetchBuddyDetails();

    // Cleanup listeners for all chat rooms
    // NOTE: This cleanup is basic. For a very large number of chats,
    // you might need a more sophisticated listener management.
    return () => {
      for (const chatRoomId in chatRooms) {
        if (chatRooms.hasOwnProperty(chatRoomId)) {
          off(ref(db, `chatRooms/${chatRoomId}`), "value");
        }
      }
    };
  }, [userId, chatRooms]); // Rerun if userId or chatRooms object changes

  const handleOpenChat = (chatRoomId, otherUserId) => {
    navigate(`/chat/${chatRoomId}/${otherUserId}`);
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-700 dark:text-gray-300">
        Loading your buddies...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600 dark:text-red-400">
        Error loading buddies: {error}
      </div>
    );
  }

  if (buddies.length === 0) {
    return (
      <div className="p-4 text-center text-gray-700 dark:text-gray-300">
        You haven't accepted any buddy requests yet.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
      <h3 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6">
        My Buddies
      </h3>
      <div className="space-y-4">
        {buddies.map((buddy) => (
          <div
            key={buddy.otherUserId}
            className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md shadow-sm"
          >
            {buddy.otherUserPhotoURL ? (
              <img
                src={buddy.otherUserPhotoURL}
                alt={`${buddy.otherUsername}'s avatar`}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <UserCircle
                size={40}
                className="text-gray-400 dark:text-gray-500"
              />
            )}
            <div className="flex-grow">
              <p className="font-semibold text-gray-900 dark:text-white">
                {buddy.otherUsername}
              </p>
              {/* You could display last message or last active time here */}
            </div>
            <button
              onClick={() =>
                handleOpenChat(buddy.chatRoomId, buddy.otherUserId)
              }
              className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition disabled:opacity-50"
              title={`Chat with ${buddy.otherUsername}`}
            >
              <MessageCircle size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBuddiesList;
