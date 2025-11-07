import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar";
import Dashboard from "./pages/dashboard";
import AddRecord from "./pages/addrecord";
import ViewRecords from "./pages/viewrecords";
import Login from "./pages/login";
import Register from "./pages/register";
import EditProfile from "./pages/editprofile";

// Simple authentication check
const isAuthenticated = () => {
  return localStorage.getItem("isAuthenticated") === "true";
};

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
};

// Public Route component (redirect to dashboard if already authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return !isAuthenticated() ? <>{children}</> : <Navigate to="/dashboard" />;
};

// Layout component for protected routes
const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-4">
        {children}
      </div>
    </>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public routes - only accessible when NOT logged in */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } 
        />
        
        {/* Protected routes - only accessible when logged in */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/add-record" 
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <AddRecord />
              </ProtectedLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/view-records" 
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <ViewRecords />
              </ProtectedLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/edit-profile" 
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <EditProfile />
              </ProtectedLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* Redirect rules */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  );
}

export default App;