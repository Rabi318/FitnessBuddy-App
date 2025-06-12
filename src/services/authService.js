import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
} from "firebase/auth";

import { auth, db } from "./firebase";

import {
  ref,
  set,
  update,
  get,
  push,
  onValue,
  off,
  remove,
} from "firebase/database";

export const registerUser = async (email, password, username, age) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;
  await set(ref(db, "users/" + user.uid), {
    uid: user.uid,
    email: email,
    username: username,
    age: parseInt(age),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    photoURL: user.photoURL || null,
    location: "",
    preferredWorkouts: [],
    fitnessGoals: [],
  });

  return userCredential;
};
export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

export const logoutUser = () => {
  return signOut(auth);
};

export const updateUserProfile = async (uid, data) => {
  const userRef = ref(db, `users/${uid}`);
  await update(userRef, { ...data, updatedAt: new Date().toISOString() });
};

export const fetchAllUsers = async () => {
  const usersRef = ref(db, "users");
  const sanpshot = await get(usersRef);
  if (sanpshot.exists()) {
    return sanpshot.val();
  }
  return {};
};

//New Function for buddy matching requests(Notifications)

export const sendBuddyRequest = async (
  senderId,
  senderUsername,
  recipientId
) => {
  const notificationRef = push(ref(db, `notifications/${recipientId}`));
  const notificationId = notificationRef.key;

  await set(notificationRef, {
    id: notificationId,
    senderId,
    senderUsername,
    recipientId,
    type: "buddy_request",
    status: "pending",
    timestamp: new Date().toISOString(),
  });
  return notificationId;
};

export const updateBuddyRequestStatus = async (
  recipientId,
  notificationId,
  newStatus,
  chatRoomId = null
) => {
  const notificationRef = ref(
    db,
    `notifications/${recipientId}/${notificationId}`
  );
  const updates = {
    status: newStatus,
    timestamp: new Date().toISOString(),
  };
  if (chatRoomId) {
    updates.chatRoomId = chatRoomId;
  }
  await update(notificationRef, updates);
};

//Creates a chat room between two users
export const createChatRoom = async (user1Id, user2Id) => {
  const chatRoomRef = ref(db, "chatRooms");
  const newChatRoomRef = push(chatRoomRef);
  const chatRoomId = newChatRoomRef.key;

  await set(newChatRoomRef, {
    id: chatRoomId,
    participants: {
      [user1Id]: true,
      [user2Id]: true,
    },
    createdAt: new Date().toISOString(),
  });
  const user1ChatsRef = ref(db, `users/${user1Id}/chats/${chatRoomId}`);
  const user2ChatsRef = ref(db, `users/${user2Id}/chats/${chatRoomId}`);
  await set(user1ChatsRef, true);
  await set(user2ChatsRef, true);
  return chatRoomId;
};

export const sendMessage = async (
  chatRoomId,
  senderId,
  senderUsername,
  text
) => {
  const messagesRef = push(ref(db, `chatRooms/${chatRoomId}/messages`)); // Push to messages node
  await set(messagesRef, {
    senderId,
    senderUsername,
    text,
    timestamp: new Date().toISOString(),
  });
};

export const onMessagesChanged = (chatRoomId, callback) => {
  const messagesRef = ref(db, `chatRooms/${chatRoomId}/messages`);
  const unsubscribe = onValue(messagesRef, (snapshot) => {
    const data = snapshot.val();
    const messages = [];
    if (data) {
      Object.keys(data).forEach((key) => {
        messages.push({ id: key, ...data[key] });
      });
    }
    // Sort messages by timestamp to ensure correct order
    messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    callback(messages);
  });
  return () => off(messagesRef, "value", unsubscribe); // Return unsubscribe function
};

export const fetchUserById = async (uid) => {
  const userRef = ref(db, `users/${uid}`);
  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return null;
};

//----New Functions for workout Tracking

export const addWorkout = async (uid, workoutData) => {
  const workoutsRef = ref(db, `users/${uid}/workouts`);
  const newWorkoutRef = push(workoutsRef);
  await set(newWorkoutRef, {
    ...workoutData,
    loggedAt: new Date().toISOString(),
  });
};

export const onWorkoutsChanged = (uid, callback) => {
  const workoutsRef = ref(db, `users/${uid}/workouts`);
  const unsubscribe = onValue(workoutsRef, (snapshot) => {
    const data = snapshot.val();
    const workouts = [];
    if (data) {
      Object.keys(data).forEach((key) => {
        workouts.push({ id: key, ...data[key] });
      });
    }
    // Sort workouts by loggedAt to ensure correct order
    workouts.sort((a, b) => new Date(a.loggedAt) - new Date(b.loggedAt));
    callback(workouts);
  });
  return () => off(workoutsRef, "value", unsubscribe);
};

//update a specific workout
export const updateWorkout = async (uid, workoutId, updatedData) => {
  const workoutRef = ref(db, `users/${uid}/workouts/${workoutId}`);
  await update(workoutRef, {
    ...updatedData,
    updatedAt: new Date().toISOString(),
  });
};
//delete a specific workout
export const deleteWorkout = async (uid, workoutId) => {
  const workoutRef = ref(db, `users/${uid}/workouts/${workoutId}`);
  await remove(workoutRef);
};
