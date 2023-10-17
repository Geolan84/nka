import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import UserProfile from "./components/UserProfile";
import Login from "./components/Login";
import RegisterProf from "./components/RegisterProf";
import CompanyStructure from "./components/CompanyStructure";
import DepartmentForm from "./components/DepartmentForm";
import VacationPage from "./components/VacationPage";


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
      </Routes>
    </Router>
  );
};

export default App;
