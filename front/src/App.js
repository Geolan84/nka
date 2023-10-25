import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import UserProfile from "./components/UserProfile";
import Login from "./components/Login";
import RegisterProf from "./components/RegisterProf";
import CompanyStructure from "./components/CompanyStructure";
import DepartmentForm from "./components/DepartmentForm";
import VacationPage from "./components/VacationPage";
import My_plan from "./components/My-plan";
import Approve from "./components/Approve";
import Dashboard from "./components/VacationDashboard";
import ReferenceCenter from "./components/ReferenceCenter";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterProf />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/structure" element={<CompanyStructure />} />
        <Route path="/structure/:departmentId" element={<DepartmentForm />} />
        <Route path="/vacation" element={<VacationPage />} />
        <Route path="/my-plan" element={<My_plan />} />
        <Route path="/approve" element={<Approve />} />
        <Route path="/reference" element={<ReferenceCenter />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
