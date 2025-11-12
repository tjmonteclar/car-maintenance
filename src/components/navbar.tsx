import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");

  const updateUserData = () => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        if (profile.name && profile.name.trim() !== "") {
          setUserName(profile.name);
        } else {
          const email =
            profile.email || localStorage.getItem("userEmail") || "User";
          setUserName(email.split("@")[0]);
        }
        if (profile.email) {
          setUserEmail(profile.email);
        } else {
          setUserEmail(localStorage.getItem("userEmail") || "");
        }
        return;
      } catch (error) {
        console.error("Error parsing user profile:", error);
      }
    }

    const userEmail = localStorage.getItem("userEmail") || "User";
    const emailName = userEmail.split("@")[0];
    setUserName(emailName);
    setUserEmail(userEmail);
  };

  useEffect(() => {
    updateUserData();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "userProfile" || e.key === "userEmail") {
        updateUserData();
      }
    };

    const handleProfileUpdate = () => {
      updateUserData();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("profileUpdated", handleProfileUpdate);

    const interval = setInterval(updateUserData, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("profileUpdated", handleProfileUpdate);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav
      className={`sticky top-0 z-50 p-4 bg-gradient-to-r from-[#7cabfc] to-blue-600 shadow-lg transition-all duration-300 ${
        isScrolled ? "shadow-xl py-3" : "py-4"
      }`}
    >
      <div className="mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center w-full">
          <div className="flex items-center space-x-4 mb-3 sm:mb-0 group">
            <div className="relative">
              <img
                src="/logo.png"
                alt="Car Maintenance Logo"
                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-white drop-shadow-sm">
                Expense Management System
              </h1>
              <p className="text-sm text-white/90 mt-1 font-medium">
                Track and manage vehicle maintenance history
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1">
              <NavLink
                to="/add-record"
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-white text-blue-700 shadow-lg"
                      : "text-white hover:bg-white/30 hover:text-white"
                  }`
                }
              >
                Add Record
              </NavLink>

              <NavLink
                to="/view-records"
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-white text-blue-700 shadow-lg"
                      : "text-white hover:bg-white/30 hover:text-white"
                  }`
                }
              >
                View Records
              </NavLink>
            </div>

            <div className="hidden sm:block">
              <span className="text-white font-semibold text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                Welcome, {userName}
              </span>
            </div>

            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="relative w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500 group"
              >
                <span className="text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300">
                  {userName.charAt(0).toUpperCase()}
                </span>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full opacity-0 group-hover:opacity-100 blur transition duration-300 group-hover:duration-1000"></div>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200/50 backdrop-blur-sm overflow-hidden z-50 animate-in slide-in-from-top-5 duration-300">
                  <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#7cabfc] to-blue-600 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white font-semibold text-sm">
                          {userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {userName}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {userEmail || "No email"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2 px-2">
                    <NavLink
                      to="/dashboard"
                      onClick={() => setIsDropdownOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 text-sm rounded-xl transition-all duration-300 mb-1 ${
                          isActive
                            ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-l-4 border-blue-500 shadow-sm"
                            : "text-gray-700 hover:bg-gray-100 hover:translate-x-1"
                        }`
                      }
                    >
                      <svg
                        className="w-5 h-5 mr-3 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      Dashboard
                    </NavLink>

                    <NavLink
                      to="/add-record"
                      onClick={() => setIsDropdownOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 text-sm rounded-xl transition-all duration-300 mb-1 ${
                          isActive
                            ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-l-4 border-blue-500 shadow-sm"
                            : "text-gray-700 hover:bg-gray-100 hover:translate-x-1"
                        }`
                      }
                    >
                      <svg
                        className="w-5 h-5 mr-3 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Add Record
                    </NavLink>

                    <NavLink
                      to="/view-records"
                      onClick={() => setIsDropdownOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 text-sm rounded-xl transition-all duration-300 mb-1 ${
                          isActive
                            ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-l-4 border-blue-500 shadow-sm"
                            : "text-gray-700 hover:bg-gray-100 hover:translate-x-1"
                        }`
                      }
                    >
                      <svg
                        className="w-5 h-5 mr-3 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      View Records
                    </NavLink>

                    <NavLink
                      to="/edit-profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 text-sm rounded-xl transition-all duration-300 ${
                          isActive
                            ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-l-4 border-blue-500 shadow-sm"
                            : "text-gray-700 hover:bg-gray-100 hover:translate-x-1"
                        }`
                      }
                    >
                      <svg
                        className="w-5 h-5 mr-3 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Edit Profile
                    </NavLink>
                  </div>

                  <div className="pt-2 px-2 border-t border-gray-200/50">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-sm rounded-xl transition-all duration-300 text-red-600 hover:bg-red-50 hover:translate-x-1 group"
                    >
                      <svg
                        className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => setIsDropdownOpen(false)}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
