import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ChatbotsPage from './pages/Chatbots';
import SpecificChatbotInteraction from './pages/SpecificChatbotInteraction';
import api from './api/api';
import { useEffect, useState } from 'react';

const App = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      if (pathname === "/login" || pathname === "/register") {
        return; // Don’t fetch user on login/register page
      }

      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await api.get("/users/user/");
        setUser(response.data);
        console.log("Fetched user:", response.data);
} catch (error) {
  console.error("Failed to fetch user:", error);
        if (error.response && error.response.status === 401) {
          // Only redirect on 401 Unauthorized
          localStorage.removeItem("accessToken");
          navigate("/login");
        }
      }
    };

    fetchUser();
  }, [pathname, navigate]);
  return (
    <div className="min-h-screen bg-bg text-txt flex items-center justify-center">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Dashboard user_ = {user} />} />
        <Route path="/dashboard/chatbots" element={<ChatbotsPage user={user} />} />
        <Route path="/dashboard/chatbots/:id" element={<SpecificChatbotInteraction user = {user} />} />
      </Routes>
    </div>
  );
};

export default App;
