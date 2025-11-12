import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  company: string;
}

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    company: "",
  });

  // Load user data on component mount
  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail") || "";
    const userName = userEmail.split("@")[0] || "User";

    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      // Remove position field if it exists in old data
      const { position, ...profileWithoutPosition } = parsedProfile;
      setProfile(profileWithoutPosition);
    } else {
      setProfile({
        name: userName,
        email: userEmail,
        phone: "",
        company: "Super Wheels Car Maintenance",
      });
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      localStorage.setItem("userProfile", JSON.stringify(profile));

      if (profile.email) {
        localStorage.setItem("userEmail", profile.email);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading && !saved) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7cabfc] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout pageTitle="Edit Profile">
      <div className="max-w-4xl mx-auto">
        {/* Header with Gradient Background */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200 rounded-2xl p-8 text-center mb-8 shadow-lg">
          <div className="w-20 h-20 bg-gradient-to-br from-[#7cabfc] to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold font-['Tahoma'] mb-2">
            Edit Profile
          </h1>
          <p className="text-gray-500 text-lg">
            Update your personal information and preferences
          </p>
        </div>

        {/* Profile Information Card */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-[#7cabfc]/20">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#7cabfc] to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
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
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Profile Information
                  </h2>
                  <p className="text-gray-600">Manage your account details</p>
                </div>
              </div>
              <div className="bg-white px-4 py-2 rounded-full border border-[#7cabfc] shadow-sm">
                <span className="text-sm font-semibold text-[#7cabfc]">
                  Personal
                </span>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Full Name */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400 group-focus-within:text-[#7cabfc]"
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
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="w-full pl-10 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7cabfc] focus:border-[#7cabfc] transition-all duration-300 group-hover:border-gray-300"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400 group-focus-within:text-[#7cabfc]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        className="w-full pl-10 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7cabfc] focus:border-[#7cabfc] transition-all duration-300 group-hover:border-gray-300"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Phone Number */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400 group-focus-within:text-[#7cabfc]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 123-4567"
                        className="w-full pl-10 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7cabfc] focus:border-[#7cabfc] transition-all duration-300 group-hover:border-gray-300"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Company */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                      Company
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400 group-focus-within:text-[#7cabfc]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="company"
                        value={profile.company}
                        onChange={handleInputChange}
                        placeholder="Your company name"
                        className="w-full pl-10 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7cabfc] focus:border-[#7cabfc] transition-all duration-300 group-hover:border-gray-300"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Success Message */}
              {saved && (
                <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-green-800 font-semibold">
                        Profile updated successfully!
                      </p>
                      <p className="text-green-600 text-sm">
                        Your changes have been saved.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    className="px-8 py-4 text-gray-700 font-semibold bg-gray-100 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span>Cancel</span>
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-4 bg-gradient-to-r from-[#7cabfc] to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#7cabfc] disabled:opacity-50 transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-xl"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Profile Information
              </h3>
              <p className="text-blue-700">
                Keep your profile information up to date to ensure the best
                experience with our maintenance management system. Your data is
                securely stored and only used to personalize your experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditProfile;
