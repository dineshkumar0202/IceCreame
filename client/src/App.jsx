import React from "react";
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminPage  from "./pages/AdminHome.jsx";
import UserHome from "./pages/UserHome.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Branches from "./pages/Branches.jsx";
import Sales from "./pages/Sales.jsx";
import IngredientsPage  from "./pages/Ingredients.jsx";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

export default function App() {
  const { user } = useAuth();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {user && <Navbar />}
      <div className="flex-1 overflow-hidden">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                {user?.role === 'admin' ? <AdminPage  /> : <UserHome />}
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/branches"
            element={
              <ProtectedRoute>
                <Branches />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales"
            element={
              <ProtectedRoute>
                <Sales />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ingredients"
            element={
              <ProtectedRoute>
                <IngredientsPage />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" replace /> : <Login />} 
          />
          <Route path="*" element={<NotFound />} />
          
        </Routes>
      </div>
    </div>
  );
}
