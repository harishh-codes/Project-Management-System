import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import Lottie from "lottie-react";

import Button from "../components/Button";
import heroAnimation from "../assets/hero.json";

import { LogIn, UserPlus, LayoutDashboard, ArrowRight } from "lucide-react";

export default function Home() {
  const user = useSelector((state) => state.auth.user);
  const [typedText, setTypedText] = useState("");

  const textToType = "Project Manager";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(textToType.slice(0, i++));
      if (i > textToType.length) clearInterval(interval);
    }, 120);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden relative">

      {/* Floating Blurs */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="w-72 h-72 bg-purple-400/20 rounded-full blur-3xl absolute top-10 left-16"
          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-[100px] absolute bottom-10 right-20"
          animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.25, 1] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
      </div>

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-10 py-6 bg-white/60 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">PM</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-wide">
            Project Manager
          </h1>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-16 px-10 mt-20">

        {/* LEFT CONTENT */}
        <motion.div
          className="max-w-xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            <span className="bg-gradient-to-r from-purple-500 via-blue-600 to-pink-500 bg-clip-text text-transparent animate-gradient">
              Manage Work,
            </span>
            <br />
            <span className="text-gray-800">{typedText} ▌</span>
          </h1>

          <p className="text-gray-600 mt-4 text-lg">
            Organize tasks, collaborate with your team, and track progress —
            beautifully and efficiently.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex gap-4">

            {!user && (
              <>
                {/* LOGIN */}
                <Link to="/login">
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-60 group-hover:opacity-100 transition"></div>

                    <Button
                      size="lg"
                      className="relative px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg backdrop-blur"
                    >
                      <LogIn size={20} />
                      Login
                    </Button>
                  </div>
                </Link>

                {/* REGISTER */}
                <Link to="/register">
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500 to-orange-500 rounded-xl blur opacity-60 group-hover:opacity-100 transition"></div>

                    <Button
                      size="lg"
                      className="relative px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-rose-600 to-orange-500 shadow-lg backdrop-blur"
                    >
                      <UserPlus size={20} />
                      Register
                    </Button>
                  </div>
                </Link>
              </>
            )}

            {user && (
              <Link to="/dashboard">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl blur opacity-60 group-hover:opacity-100 transition"></div>

                  <Button
                    size="lg"
                    className="relative px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-green-600 to-blue-500 shadow-lg backdrop-blur"
                  >
                    <LayoutDashboard size={20} />
                    Dashboard <ArrowRight size={20} />
                  </Button>
                </div>
              </Link>
            )}
          </div>
        </motion.div>

        {/* RIGHT SIDE LOTTIE */}
        <motion.div
          className="max-w-md drop-shadow-xl"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <Lottie animationData={heroAnimation} loop />
        </motion.div>

      </div>

    </div>
  );
}
