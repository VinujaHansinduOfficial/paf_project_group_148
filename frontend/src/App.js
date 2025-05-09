import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SomeComponent from "./components/SomeComponent"; // Import SomeComponent 
import ChatPage from "./pages/ChatPage";
import Navbar from "./components/Navbar"; // Import the Navbar component
import { useAuth } from "./components/AuthContext"; // Import useAuth
import ProfilePage from "./pages/ProfilePage"; // Import ProfilePage  

function App() {
  const { user } = useAuth(); // Get user from AuthContext

  return (
    <Router>
      {user && <Navbar />} {/* Render Navbar if user is logged in */}
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/chat" /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/SomeComponent" element={<SomeComponent />} />
        <Route
          path="/chat"
          element={user ? <ChatPage /> : <Navigate to="/login" />}
        />
        <Route path="/profile/:userId" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
