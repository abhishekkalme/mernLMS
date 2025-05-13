import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      const { token, user } = response.data;

      if (token) {
        login(user, token);
        navigate("/");
      } else {
        console.log("Login failed: No token received");
      }
    } catch (err) {
      console.error("Login failed:", err.response?.data?.message || err.message);
    }
  };

  const handleGoogleLogin = async (response) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/google`, {
        token: response.credential,
      });

      const { token, user } = res.data;

      if (token && user) {
        login(user, token);
        navigate("/");
      } else {
        console.log("Google login failed: No token or user received");
      }
    } catch (err) {
      console.error("Google Login Error:", err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-10 bg-white shadow-lg rounded-lg dark:bg-gray-900 dark:border border-[#6366f1] dark:hover:shadow-blue-800 dark:shadow-md">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
          Welcome Back
        </h2>
        <p className="text-gray-500 mt-2">Please sign in to your account</p>
      </div>

      <form onSubmit={handleLogin}>
        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
          Email Address
        </label>
        <input
          type="email"
          className="block w-full pl-10 mb-4 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
          Password
        </label>
        <input
          type="password"
          className="block w-full pl-10 pr-3 py-2 mb-8 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full text-white p-2 rounded hover:bg-indigo-600 bg-indigo-500 shadow-lg shadow-indigo-500/50"
        >
          Login
        </button>
      </form>

      <div className="relative mt-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">or</span>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={(error) => console.error("Google Login Error:", error)}
          useOneTap
        />
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        Don't have an account?
        <Link
          to="/register"
          className="font-medium text-violet-400 hover:text-blue-700 ml-2"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;
