import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Импортируйте Link и useHistory из react-router-dom
import "../css/CompanyStructure.css";

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
        // Отправка POST-запроса на сервер с названием нового подразделения
        // ...

        fetch(`http://localhost:8080/struct/new_department?department_name=${newDivision}`, {
            method: "POST",
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    // Закройте модальное окно
                    setIsModalOpen(false);
                    // После успешного POST-запроса обновите список существующих подразделений
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
        // Программный переход на страницу подразделения
        navigate(`/structure/dep=${departmentId}`);
    };
    const renderDepartments = (departments) => {
        return (
            <ul>
                {departments.map((department) => (
                    <li key={department.department_id}>
                        {/* Используйте Link для перехода на страницу с формой и функционалом */}
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
            <h1>Структура компании</h1>
            <button onClick={handleBackInProf}>Назад в профиль</button>
            {/*
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-card">
                            <h2>Добавить подразделение</h2>
                            <input
                                type="text"
                                placeholder="Название подразделения"
                                value={newDivision}
                                onChange={(e) => setNewDivision(e.target.value)}
                            />
                            <div className="modal-buttons">
                                <button onClick={addDivision}>Добавить</button>
                                <button onClick={() => setIsModalOpen(false)}>Отмена</button>
                            </div>
                        </div>
                    </div>
                </div> 
            )}*/}

            <div>
                <h2>Существующие подразделения:</h2>
                {renderDepartments(divisions)}
            </div>
        </div>
    );
};

export default CompanyStructure;
