import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import LoginLoading from "../components/loading";

interface User {
  id: number;
  email: string;
  password: string;
  name: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      // Add a small delay to show the loading animation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Check if user already exists
      const usersResponse = await fetch("http://localhost:3001/users");

      if (!usersResponse.ok) {
        throw new Error("Failed to check existing users");
      }

      const users: User[] = await usersResponse.json();

      const existingUser = users.find((u) => u.email === formData.email);
      if (existingUser) {
        setError("User with this email already exists");
        setLoading(false);
        return;
      }

      // Create new user
      const newUser = {
        id: Math.floor(Math.random() * 1000000),
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      console.log("Creating user:", newUser);

      const response = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response:", errorText);
        throw new Error(`Failed to create account: ${response.status}`);
      }

      const createdUser = await response.json();
      console.log("User created:", createdUser);

      // Auto-login after successful registration
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", createdUser.email);
      localStorage.setItem("userName", createdUser.name);
      localStorage.setItem("userId", createdUser.id.toString());

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      setError(
        `Failed to create account: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // Show loading overlay when loading
  if (loading) {
    return <LoginLoading />;
  }

  return (
    <div
      className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative"
      style={{
        backgroundImage: "url('/car-2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        fontFamily: "Tahoma",
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Enhanced Logo/Title with Animation */}
          <div className="flex justify-center mb-2">
            <div className="flex items-center transform hover:scale-105 transition-transform duration-300">
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="Car Maintenance Tracker"
                  className="h-16 w-16 rounded-xl shadow-lg bg-white/20 backdrop-blur-sm p-2"
                />
                <div className="absolute -inset-1 bg-[#7cabfc] rounded-xl opacity-20 blur-sm"></div>
              </div>
              <h1
                className="ml-4 text-3xl font-bold text-white"
                style={{ fontFamily: "Tahoma" }}
              >
                Create Your Account
              </h1>
            </div>
          </div>
          <p
            className="mt-2 text-center text-sm text-white/80"
            style={{ fontFamily: "Tahoma" }}
          >
            Start tracking your vehicle maintenance history
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white/90 backdrop-blur-lg py-8 px-6 shadow-2xl sm:rounded-2xl border border-white/20">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div
                  className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
                  style={{ fontFamily: "Tahoma" }}
                >
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                  style={{ fontFamily: "Tahoma" }}
                >
                  Full Name
                </label>
                <div className="relative">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7cabfc] focus:border-transparent transition-all duration-200 bg-white"
                    placeholder="Enter your full name"
                    style={{ fontFamily: "Tahoma" }}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <span className="text-gray-400">👤</span>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                  style={{ fontFamily: "Tahoma" }}
                >
                  Email address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7cabfc] focus:border-transparent transition-all duration-200 bg-white"
                    placeholder="Enter your email"
                    style={{ fontFamily: "Tahoma" }}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <span className="text-gray-400">📧</span>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                  style={{ fontFamily: "Tahoma" }}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7cabfc] focus:border-transparent transition-all duration-200 bg-white"
                    placeholder="Enter your password"
                    style={{ fontFamily: "Tahoma" }}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <span className="text-gray-400">🔒</span>
                  </div>
                </div>
                <p
                  className="mt-1 text-xs text-gray-500"
                  style={{ fontFamily: "Tahoma" }}
                >
                  Must be at least 6 characters long
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                  style={{ fontFamily: "Tahoma" }}
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7cabfc] focus:border-transparent transition-all duration-200 bg-white"
                    placeholder="Confirm your password"
                    style={{ fontFamily: "Tahoma" }}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <span className="text-gray-400">🔒</span>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-[#7cabfc] to-blue-600 hover:from-blue-600 hover:to-[#7cabfc] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7cabfc] transform hover:scale-[1.02] transition-all duration-200"
                  style={{ fontFamily: "Tahoma" }}
                >
                  <span
                    className="flex items-center"
                    style={{ fontFamily: "Tahoma" }}
                  >
                    Create Account
                    <svg
                      className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </button>
              </div>

              <div className="text-center">
                <p
                  className="text-sm text-gray-600"
                  style={{ fontFamily: "Tahoma" }}
                >
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-gray-600 hover:text-[#7cabfc] transition-colors duration-200"
                    style={{ fontFamily: "Tahoma" }}
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
