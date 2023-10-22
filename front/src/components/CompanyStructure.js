import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Импортируйте Link из react-router-dom
import "../css/CompanyStructure.css";
import logo from '../images/logo.svg';

const CompanyStructure = () => {
    const [divisions, setDivisions] = useState([]);
    const [newDivision, setNewDivision] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const fetchDivisions = () => {
        fetch("http://localhost:8080/struct/get_department")
            .then((response) => response.json())
            .then((data) => {
                if (data.department_name) {
                    setDivisions([data]);
                }
            })
            .catch((error) => {
                console.error("Ошибка при получении подразделений:", error);
            });
    };

    useEffect(() => {
        fetchDivisions();
    }, []);

    const addDivision = () => {
        fetch(`http://localhost:8080/struct/new_department?department_name=${newDivision}`, {
            method: "POST",
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setIsModalOpen(false);
                    fetchDivisions();
                }
            })
            .catch((error) => {
                console.error("Ошибка при создании подразделения:", error);
            });

        setNewDivision("");
    };

    const handleBackInProf = () => {
        window.location.href = "/profile";
    };

    const handleDepartmentClick = (departmentId) => {
        navigate(`/structure/dep=${departmentId}`);
    };

    const renderDepartments = (departments) => {
        return (
            <ul className="">
                {departments.map((department) => (
                    <li key={department.department_id}>
                        <span
                            onClick={() => handleDepartmentClick(department.department_id)}
                            style={{ cursor: "pointer" }}
                        >
                            {department.department_name}
                        </span>
                        {department.departments && department.departments.length > 0 && (
                            renderDepartments(department.departments)
                        )}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div>
            <div className="header0">
            <img onClick={handleBackInProf} src={logo} alt="Logo" />
            <h1 className="user-title">Структура компании</h1>
            <button className="user-logout" onClick={handleBackInProf}>Назад в профиль</button>
        </div>
            <div>
                <h2>Существующие отделы:</h2>
                {renderDepartments(divisions)}
            </div>
        </div>
    );
};

export default CompanyStructure;
