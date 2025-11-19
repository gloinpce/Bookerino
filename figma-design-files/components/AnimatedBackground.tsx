import React from "react";
import { useTheme } from "./ThemeProvider";

const AnimatedBackground = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient background */}
      <div className={`absolute inset-0 transition-colors duration-500 ${
        isDark 
          ? "bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900" 
          : "bg-gradient-to-br from-white via-blue-50 to-white"
      }`}></div>
      
      {/* Animated Gradient Orbs - Light Mode: Albastru deschis + Alb */}
      {!isDark && (
        <>
          <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-400/60 rounded-full mix-blend-multiply filter blur-xl opacity-90 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-300/60 rounded-full mix-blend-multiply filter blur-xl opacity-90 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-200/60 rounded-full mix-blend-multiply filter blur-xl opacity-90 animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/50 rounded-full mix-blend-multiply filter blur-xl opacity-90 animate-blob animation-delay-6000"></div>
          <div className="absolute top-1/4 left-1/4 w-[32rem] h-[32rem] bg-blue-400/45 rounded-full mix-blend-multiply filter blur-2xl opacity-80 animate-blob-slow"></div>
          <div className="absolute top-1/2 right-1/3 w-[32rem] h-[32rem] bg-blue-300/40 rounded-full mix-blend-multiply filter blur-2xl opacity-80 animate-blob-slow animation-delay-3000"></div>
        </>
      )}

      {/* Animated Gradient Orbs - Dark Mode: Albastru închis + tonuri închise */}
      {isDark && (
        <>
          <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-700/30 rounded-full mix-blend-screen filter blur-xl opacity-40 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-800/30 rounded-full mix-blend-screen filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-600/25 rounded-full mix-blend-screen filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-900/30 rounded-full mix-blend-screen filter blur-xl opacity-40 animate-blob animation-delay-6000"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-700/20 rounded-full mix-blend-screen filter blur-2xl opacity-30 animate-blob-slow"></div>
          <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-blue-800/20 rounded-full mix-blend-screen filter blur-2xl opacity-30 animate-blob-slow animation-delay-3000"></div>
        </>
      )}
    </div>
  );
};

export default AnimatedBackground;
