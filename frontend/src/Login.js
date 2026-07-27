import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post("https://study-tracker-backend-tocq.onrender.com/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      alert("Login Successful ✅");


      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-950 to-black relative overflow-hidden">

      <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500 blur-3xl opacity-20 rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 blur-3xl opacity-20 rounded-full"></div>

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-[0_0_30px_rgba(168,85,247,0.3)]">

        <h1 className="text-5xl font-extrabold text-center mb-3 bg-gradient-to-r from-pink-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
          ✨ Study Tracker ✨
        </h1>

        <p className="text-center text-gray-300 mb-8">
          Welcome Back 👋
        </p>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 mb-5 rounded-xl bg-black/30 border border-purple-400 text-white placeholder-gray-300 outline-none focus:border-cyan-400 transition-all"
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-4 mb-6 rounded-xl bg-black/30 border border-purple-400 text-white placeholder-gray-300 outline-none focus:border-cyan-400 transition-all"
        />

        <button
          onClick={loginUser}
          className="w-full p-4 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 font-bold text-white hover:scale-105 transition-all duration-500 shadow-[0_0_25px_rgba(236,72,153,0.7)]"
        >
          Login 🚀
        </button>

        <p className="text-center mt-6 text-gray-300">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-cyan-400 hover:text-pink-400 font-bold"
          >
            Sign Up
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;