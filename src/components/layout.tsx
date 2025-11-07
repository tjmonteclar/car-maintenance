import React from "react";
import Sidebar from "./sidebar";

interface LayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  pageTitle = "Dashboard",
}) => {
  const handleOpenSidebar = () => {
    // Dispatch custom event that Sidebar will listen to
    const event = new CustomEvent("openSidebar");
    window.dispatchEvent(event);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Self-contained */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header with Toggle Button */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleOpenSidebar}
              className="w-10 h-10 bg-[#bfa14a] text-white rounded-lg shadow flex items-center justify-center hover:bg-[#a58c3b] transition-colors"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-900">{pageTitle}</h1>
            <div className="w-10"></div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-4 lg:p-6 overflow-auto">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
