import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/CompanyStructure.css";
import logo from '../images/logo.svg';

const CompanyStructure = () => {
    const [divisions, setDivisions] = useState([]);
    const navigate = useNavigate();

    const fetchAllDivisions = (token) => {
        fetch("http://localhost:8080/struct/get_all_departments", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data) {
                    setDivisions([data]);
                }
            })
            .catch((error) => {
                console.error("Ошибка при получении подразделений:", error);
            });
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetchAllDivisions(token);
    }, []);

    const handleBackInProf = () => {
        window.location.href = "/profile";
    };

    const toggleDepartment = (departmentId) => {
        setDivisions((prevState) => {
            const updatedDivisions = toggleDepartmentVisibility(prevState, departmentId);
            return [...updatedDivisions];
        });
    };

    const toggleDepartmentVisibility = (departments, departmentId) => {
        return departments.map((department) => {
            if (department.department_id === departmentId) {
                return { ...department, isExpanded: !department.isExpanded };
            } else if (department.departments) {
                return {
                    ...department,
                    departments: toggleDepartmentVisibility(department.departments, departmentId),
                };
            }
            return department;
        });
    };

    const renderDepartments = (departments, level = 0) => {
        return (
            <ul className="tree">
                {departments.map((department) => (
                    <li key={department.department_id}>
                        <div className="tree-item">
                        <input
                            type="checkbox"
                            id={`c${department.department_id}`}
                            checked={department.isExpanded || false} // Ensure it's controlled
                            onChange={() => toggleDepartment(department.department_id)}
                        />
                            <label className="tree_label" htmlFor={`c${department.department_id}`}>
                                <span className="department-name">{department.department_name}</span>
                                <div className="tree_buttons">
                                    {level > 0 && department.isExpanded && (
                                        <button onClick={() => handleRenameDepartment(department.department_id)}>
                                            Изменить
                                        </button>
                                    )}
                                    {level > 0 && department.isExpanded && (
                                        <button onClick={() => handleDeleteDepartment(department.department_id)}>
                                            Удалить
                                        </button>
                                    )}
                                    {department.isExpanded && (
                                        <button onClick={() => handleDepartmentClick(department.department_id)}>
                                            Перейти в отдел
                                        </button>
                                    )}
                                </div>
                            </label>
                        </div>
                        {department.departments && department.isExpanded && department.departments.length > 0 && (
                            renderDepartments(department.departments, level + 1)
                        )}
                    </li>
                ))}
            </ul>
        );
    };

    const handleRenameDepartment = (departmentId) => {
        // Обработка переименования отдела
    };

    const handleDeleteDepartment = (departmentId) => {
        // Обработка удаления отдела
    };

    const handleDepartmentClick = (departmentId) => {
        navigate(`/structure/dep=${departmentId}`);
    };

    return (
        <div>
            <div className="header0">
                <img onClick={handleBackInProf} src={logo} alt="Logo" />
                <h1 className="user-title">Структура компании</h1>
                <button className="user-logout" onClick={handleBackInProf}>
                    Назад в профиль
                </button>
            </div>
            <div className="FormDep">
                <h2>Существующие отделы:</h2>
                {divisions.length > 0 && renderDepartments(divisions)}
            </div>
        </div>
    );
};

export default CompanyStructure;
