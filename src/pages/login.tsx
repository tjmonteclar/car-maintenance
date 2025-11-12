import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import LoginLoading from "../components/loading";
import Footer from "../components/footer";
import { mockUsers } from "../mockData";

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const user = mockUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("userName", user.name);
        localStorage.setItem("userId", user.id.toString());

        navigate("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoginLoading />;
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ fontFamily: "Roboto" }}
    >
      <div className="flex-1 flex">
        <div
          className="hidden lg:flex lg:flex-1 relative"
          style={{
            backgroundImage: "url('/car.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>

          <div
            className="relative z-10 flex flex-col justify-center items-center text-white p-12 w-full"
            style={{ fontFamily: "Roboto" }}
          >
            <div className="flex justify-center mb-6">
              <div
                className={`flex items-center transform transition-all duration-1000 ${
                  isMounted
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 -translate-y-10 scale-90"
                }`}
              >
                <div className="relative">
                  <img
                    src="/sw-logo.png"
                    alt="Car Maintenance Tracker"
                    className="w-80 rounded-xl shadow-lg bg-white/20 p-2 hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute -inset-1 bg-[#7cabfc] rounded-xl opacity-20"></div>
                </div>
              </div>
            </div>

            <div
              className={`transition-all duration-1000 delay-300 ${
                isMounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <p
                className="py-10 text-xl text-center text-white/90 max-w-md"
                style={{ fontFamily: "Tahoma" }}
              >
                Track your vehicle maintenance with ease and precision
              </p>
            </div>

            <div className="mt-8 space-y-4 max-w-sm">
              <div
                className={`flex items-center transition-all duration-700 delay-500 ${
                  isMounted
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-8"
                }`}
              >
                <div className="w-8 h-8 bg-[#7cabfc] rounded-full flex items-center justify-center mr-3">
                  <span
                    className="text-white text-sm"
                    style={{ fontFamily: "Tahoma" }}
                  >
                    ✓
                  </span>
                </div>
                <span
                  className="text-white/90"
                  style={{ fontFamily: "Tahoma" }}
                >
                  Maintenance Scheduling
                </span>
              </div>
              <div
                className={`flex items-center transition-all duration-700 delay-700 ${
                  isMounted
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-8"
                }`}
              >
                <div className="w-8 h-8 bg-[#7cabfc] rounded-full flex items-center justify-center mr-3">
                  <span
                    className="text-white text-sm"
                    style={{ fontFamily: "Tahoma" }}
                  >
                    ✓
                  </span>
                </div>
                <span
                  className="text-white/90"
                  style={{ fontFamily: "Tahoma" }}
                >
                  Service History Tracking
                </span>
              </div>
              <div
                className={`flex items-center transition-all duration-500 delay-1000 ${
                  isMounted
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-8"
                }`}
              >
                <div className="w-8 h-8 bg-[#7cabfc] rounded-full flex items-center justify-center mr-3">
                  <span
                    className="text-white text-sm"
                    style={{ fontFamily: "Tahoma" }}
                  >
                    ✓
                  </span>
                </div>
                <span
                  className="text-white/90"
                  style={{ fontFamily: "Tahoma" }}
                >
                  Cost Management
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex-1 flex flex-col justify-center py-10 px-6 lg:px-12 relative"
          style={{ fontFamily: "Tahoma" }}
        >
          <div className="relative z-10 mx-auto w-full max-w-md">
            <div className="lg:hidden flex justify-center mb-8">
              <div className="flex items-center">
                <img
                  src="/logo.png"
                  alt="Car Maintenance Tracker"
                  className="h-20 w-12 rounded-xl shadow-lg bg-white/20 backdrop-blur-sm p-2"
                />
                <h1
                  className="ml-3 text-2xl font-bold text-white"
                  style={{ fontFamily: "Tahoma" }}
                >
                  SUPER WHEELS
                </h1>
              </div>
            </div>

            <div className="text-center lg:text-left mb-8">
              <h2
                className="text-3xl font-bold text-black"
                style={{ fontFamily: "Sans-Serif" }}
              >
                Sign in to your account
              </h2>
            </div>

            <div className="bg-white/95 backdrop-blur-sm py-8 px-6 shadow-2xl sm:rounded-2xl border border-white/20">
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7cabfc] focus:border-transparent transition-all duration-200 bg-white"
                      placeholder="Enter your password"
                      style={{ fontFamily: "Tahoma" }}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <span className="text-gray-400">🔒</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-[#7cabfc] focus:ring-[#7cabfc] border-gray-300 rounded"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-900"
                      style={{ fontFamily: "Tahoma" }}
                    >
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-gray-600 hover:text-[#7cabfc] transition-colors duration-200"
                      style={{ fontFamily: "Tahoma" }}
                    >
                      Forgot password?
                    </a>
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
                      Sign in
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
              </form>
              <div className="mt-6 text-center">
                <p
                  className="text-sm text-gray-600"
                  style={{ fontFamily: "Tahoma" }}
                >
                  No account yet?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-gray-600 hover:text-[#7cabfc] transition-colors duration-200"
                    style={{ fontFamily: "Tahoma" }}
                  >
                    Create your account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
