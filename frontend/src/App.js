import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useAuth } from "./components/AuthContext";

import Navbar from "./components/Navbar";
import Skills from "./pages/Skills";
import LearningPlansPage from "./pages/LearningPlansPage";
import CreateLearningPlanPage from "./pages/CreateLearningPlanPage";
import ViewLearningPlanPage from "./pages/ViewLearningPlanPage";
import SkillSharingPage from "./pages/SkillSharingPage";
import Projects from "./pages/Projects";
import AddSkill from "./pages/AddSkillPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SomeComponent from "./components/SomeComponent";
import ChatPage from "./pages/ChatPage";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";

import "./App.css";

// Get user from context or fallback to localStorage
function useUser() {
  const { user: authUser } = useAuth();
  const localUser = JSON.parse(localStorage.getItem("user"));
  return authUser || localUser;
}

function App() {
  const user = useUser();

  return (
    <Router>
      {user ? <Navbar user={user} /> : null}
      <Routes>
        {/* Default redirect based on auth */}
        <Route
          path="/"
          element={user ? <Navigate to="/chat" /> : <Navigate to="/login" />}
        />

        {/* Authentication Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login-page" element={<LoginPage />} />
        <Route path="/register-page" element={<RegisterPage />} />

        {/* Authenticated Routes */}
        <Route path="/chat" element={user ? <ChatPage /> : <Navigate to="/login" />} />
        <Route path="/home" element={user ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/SomeComponent" element={<SomeComponent />} />

        {/* Skills & Learning Plans */}
        <Route path="/skills" element={<Skills />} />
        <Route path="/learning-plans" element={<LearningPlansPage />} />
        <Route path="/create-learning-plan" element={<CreateLearningPlanPage />} />
        <Route path="/view-learning-plan/*" element={<ViewLearningPlanPage />} />
        <Route path="/view-learning-plan/:id" element={<ViewLearningPlanPage />} />
        <Route path="/view-learning-plan/:id/:planId" element={<ViewLearningPlanPage />} />
        <Route path="/view-learning-plan/:id/:planId/:planName" element={<ViewLearningPlanPage />} />
        <Route path="/view-learning-plan/:id/:planId/:planName/:planDescription" element={<ViewLearningPlanPage />} />
        <Route path="/view-learning-plan/:id/:planId/:planName/:planDescription/:technologies" element={<ViewLearningPlanPage />} />
        <Route path="/view-learning-plan/:id/:planId/:planName/:planDescription/:technologies/:skills" element={<ViewLearningPlanPage />} />
        <Route path="/view-learning-plan/:id/:planId/:planName/:planDescription/:technologies/:skills/:learningPlans" element={<ViewLearningPlanPage />} />
        <Route path="/view-learning-plan/:id/:planId/:planName/:planDescription/:technologies/:skills/:learningPlans/:skillSharing" element={<ViewLearningPlanPage />} />
        <Route path="/view-learning-plan/:id/:planId/:planName/:planDescription/:technologies/:skills/:learningPlans/:skillSharing/:addSkill" element={<ViewLearningPlanPage />} />
        <Route path="/view-learning-plan/:id/:planId/:planName/:planDescription/:technologies/:skills/:learningPlans/:skillSharing/:addSkill/:addProject" element={<ViewLearningPlanPage />} />

        {/* Skill Sharing & Adding */}
        <Route path="/skill-sharing" element={<SkillSharingPage />} />
        <Route path="/add-skill" element={<AddSkill />} />
        <Route path="/add-skill/*" element={<AddSkill />} />
        <Route path="/add-skill/:id" element={<AddSkill />} />
        <Route path="/add-skill/:id/:skillId" element={<AddSkill />} />
        <Route path="/add-skill/:id/:skillId/:skillName" element={<AddSkill />} />
        <Route path="/add-skill/:id/:skillId/:skillName/:skillDescription" element={<AddSkill />} />
        <Route path="/add-skill/:id/:skillId/:skillName/:skillDescription/:technologies" element={<AddSkill />} />
        <Route path="/add-skill/:id/:skillId/:skillName/:skillDescription/:technologies/:skills" element={<AddSkill />} />
        <Route path="/add-skill/:id/:skillId/:skillName/:skillDescription/:technologies/:skills/:learningPlans" element={<AddSkill />} />
        <Route path="/add-skill/:id/:skillId/:skillName/:skillDescription/:technologies/:skills/:learningPlans/:skillSharing" element={<AddSkill />} />
        <Route path="/add-skill/:id/:skillId/:skillName/:skillDescription/:technologies/:skills/:learningPlans/:skillSharing/:addSkill" element={<AddSkill />} />
        <Route path="/add-skill/:id/:skillId/:skillName/:skillDescription/:technologies/:skills/:learningPlans/:skillSharing/:addSkill/:addProject" element={<AddSkill />} />
        <Route path="/add-skill/:id/:skillId/:skillName/:skillDescription/:technologies/:skills/:learningPlans/:skillSharing/:addSkill/:addProject/:viewProject" element={<AddSkill />} />
        <Route path="/add-skill/:id/:skillId/:skillName/:skillDescription/:technologies/:skills/:learningPlans/:skillSharing/:addSkill/:addProject/:viewProject/:editProject" element={<AddSkill />} />
        <Route path="/add-skill/:id/:skillId/:skillName/:skillDescription/:technologies/:skills/:learningPlans/:skillSharing/:addSkill/:addProject/:viewProject/:editProject/:login" element={<AddSkill />} />
        <Route path="/add-skill/:id/:skillId/:skillName/:skillDescription/:technologies/:skills/:learningPlans/:skillSharing/:addSkill/:addProject/:viewProject/:editProject/:login/:register" element={<AddSkill />} />
        <Route path="/add-skill/:id/:skillId/:skillName/:skillDescription/:technologies/:skills/:learningPlans/:skillSharing/:addSkill/:addProject/:viewProject/:editProject/:login/:register/:home" element={<AddSkill />} />
        <Route path="/add-skill/:id/:skillId/:skillName/:skillDescription/:technologies/:skills/:learningPlans/:skillSharing/:addSkill/:addProject/:viewProject/:editProject/:login/:register/:home/:projects" element={<AddSkill />} />

        {/* Projects */}
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/*" element={<Projects />} />
        <Route path="/projects/:id" element={<Projects />} />
        <Route path="/projects/:id/:projectId" element={<Projects />} />
        <Route path="/projects/:id/:projectId/:projectName" element={<Projects />} />
        <Route path="/projects/:id/:projectId/:projectName/:projectDescription" element={<Projects />} />
        <Route path="/projects/:id/:projectId/:projectName/:projectDescription/:technologies" element={<Projects />} />
        <Route path="/projects/:id/:projectId/:projectName/:projectDescription/:technologies/:skills" element={<Projects />} />
        <Route path="/projects/:id/:projectId/:projectName/:projectDescription/:technologies/:skills/:learningPlans" element={<Projects />} />
        <Route path="/projects/:id/:projectId/:projectName/:projectDescription/:technologies/:skills/:learningPlans/:skillSharing" element={<Projects />} />
        <Route path="/projects/:id/:projectId/:projectName/:projectDescription/:technologies/:skills/:learningPlans/:skillSharing/:addSkill" element={<Projects />} />
        <Route path="/projects/:id/:projectId/:projectName/:projectDescription/:technologies/:skills/:learningPlans/:skillSharing/:addSkill/:addProject" element={<Projects />} />
        <Route path="/projects/:id/:projectId/:projectName/:projectDescription/:technologies/:skills/:learningPlans/:skillSharing/:addSkill/:addProject/:viewProject" element={<Projects />} />
        <Route path="/projects/:id/:projectId/:projectName/:projectDescription/:technologies/:skills/:learningPlans/:skillSharing/:addSkill/:addProject/:viewProject/:editProject" element={<Projects />} />
      </Routes>
    </Router>
  );
}

export default App;
