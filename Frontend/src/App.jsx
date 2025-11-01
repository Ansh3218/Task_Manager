import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./Components/Login/Login";
import SignUp from "./Components/SignUp/SignUp";
import Dashboard from "./Pages/Dashboard";
import { useEffect, useState } from "react";
import { OrbitProgress } from "react-loading-indicators";
import { Toaster } from "react-hot-toast";
import { ProtectRoute } from "./Components/ProtectedRoute/ProtectRoute";

function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1800);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen bg-[#0A0A0A]">
          <OrbitProgress
            variant="disc"
            color="#32cd32"
            size="medium"
            text=""
            textColor="#ffffff"
          />
        </div>
      ) : (
        <div className="bg-[#0A0A0A] min-h-screen">
          <Toaster position="top-right" reverseOrder={false} />
          <Routes>
            <Route
              path="/"
              element={
                <ProtectRoute>
                  <Dashboard />
                </ProtectRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </div>
      )}
    </>
  );
}

export default App;
