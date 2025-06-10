import React, { useState } from "react";
import { loginUser, registerUser } from "../services/authService";
import { useDispatch } from "react-redux";
import { setUser, setError, setLoading } from "../features/auth/authSlice";
import toast from "react-hot-toast";

const AuthForm = ({ mode, switchMode, closeModal }) => {
  const dispatch = useDispatch();
  const isLogin = mode === "login";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoadingState] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading());
    setLoadingState(true);
    try {
      if (isLogin) {
        const userCredential = await loginUser(email, password);
        dispatch(setUser(userCredential.user));
        toast.success("Login successful");
        closeModal();
      } else {
        await registerUser(email, password, username, age);
        toast.success("Registration successful! Please login.");
        switchMode();
      }
    } catch (err) {
      dispatch(setError(err.message));
      toast.error(err.message);
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-4 text-center  text-blue-600">
        {isLogin ? "Login" : "Register"}
      </h2>

      {!isLogin && (
        <>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full px-4 py-2 mb-3 border rounded focus:outline-none"
          />
          <input
            type="number"
            required
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Age"
            className="w-full px-4 py-2 mb-3 border rounded focus:outline-none"
          />
        </>
      )}

      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full px-4 py-2 mb-3 border rounded focus:outline-none"
      />
      <input
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full px-4 py-2 mb-4 border rounded focus:outline-none"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-60"
        disabled={loading}
      >
        {loading
          ? isLogin
            ? "Logging in..."
            : "Registering..."
          : isLogin
          ? "Login"
          : "Register"}
      </button>

      <p className="text-center mt-4 text-sm">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          type="button"
          onClick={switchMode}
          className="text-blue-600 hover:underline"
        >
          {isLogin ? "Register here" : "Login here"}
        </button>
      </p>
    </form>
  );
};

export default AuthForm;
