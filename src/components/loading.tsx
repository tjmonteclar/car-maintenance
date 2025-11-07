import React from "react";

const LoginLoading: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center z-50">
      {/* Animated Car Icon with Pulse Effect */}
      <div className="relative mb-8">
        <div className="w-20 h-20 bg-[#bfa14a] rounded-xl flex items-center justify-center text-white text-3xl animate-pulse shadow-lg">
          🚗
        </div>
        <div className="absolute inset-0 border-4 border-[#bfa14a] rounded-xl animate-ping opacity-75"></div>
      </div>

      {/* Text with Typing Animation */}
      <div className="text-center">
        <p className="text-xl font-semibold text-gray-800 mb-2">
          Starting Your Engine
        </p>
        <p className="text-gray-600 mb-6">Preparing your dashboard...</p>

        {/* Wave Animation */}
        <div className="flex justify-center space-x-1">
          {[1, 2, 3, 4, 5].map((bar) => (
            <div
              key={bar}
              className="w-1.5 h-6 bg-[#bfa14a] rounded-full animate-bounce"
              style={{
                animationDelay: `${bar * 0.1}s`,
                animationDuration: "0.6s",
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-64 h-1 bg-gray-200 rounded-full mt-8 overflow-hidden">
        <div className="h-full bg-[#bfa14a] rounded-full animate-progress"></div>
      </div>
    </div>
  );
};

// Add this export statement at the end
export default LoginLoading;
