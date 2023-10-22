import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../css/CompanyStructure.css";
import logo from '../images/logo.svg';

const DepartmentForm = () => {
    const navigate = useNavigate(); // Добавляем импорт useNavigate
    const { departmentId } = useParams();
    const id = departmentId.split('=')[1]; // Извлекаем значение 'id' из параметра
    const [departmentData, setDepartmentData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddingUser, setIsAddingUser] = useState(false);
    const [newDivision, setNewDivision] = useState("");
    const [newUser, setNewUser] = useState({
        email: "",
        first_name: "",
        second_name: "",
        patronymic_name: "",
        is_head: false,
    });

    const fetchDepartmentData = () => {
        fetch(`http://localhost:8080/struct/get_department?department_id=${id}`)
            .then((response) => response.json())
            .then((data) => {
                setDepartmentData(data);
            })
            .catch((error) => {
                console.error("Ошибка при получении данных подразделения:", error);
            });
    };

    const handleDepartmentClick = (departmentId) => {
        navigate(`/structure/dep=${departmentId}`);
    };

    const renderDepartments = (departments) => {
        return (
            <ul>
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

    const renderUsers = (users) => {
        return (
            <ul>
                {users.map((user) => (
                    <li key={user.user_id}>
                        {user.first_name} {user.second_name} {user.patronymic} ({user.email})
                        {user.is_head && " - Начальник"}
                    </li>
                ))}
            </ul>
        );
    };

    useEffect(() => {
        fetchDepartmentData();
    }, [id]);

    const addDivision = () => {
        fetch(`http://localhost:8080/struct/new_department?department_name=${newDivision}&head_department_id=${id}`, {
            method: "POST",
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setIsModalOpen(false);
                    fetchDepartmentData();
                }
            })
            .catch((error) => {
                console.error("Ошибка при создании подразделения:", error);
            });

        setNewDivision("");
    };

    const addUser = () => {
        fetch("http://localhost:8080/struct/add_user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...newUser,
                department_id: id,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setIsAddingUser(false);
                    fetchDepartmentData();
                }
            })
            .catch((error) => {
                console.error("Ошибка при создании пользователя:", error);
            });

        setNewUser({
            email: "",
            first_name: "",
            second_name: "",
            patronymic: "",
            is_head: false,
        });
    };

    const handleBackInStruct = () => {
        navigate(`/structure`);
    };

    const handleBackInProf = () => {
        navigate(`/profile`);
    };

    return (

        <div>
            <div className="header0">
                <img onClick={handleBackInProf} src={logo} alt="Logo" />
                <button className="user-logout" onClick={handleBackInProf}>Назад в профиль</button>
            </div>
            <h1>Подразделение {departmentData.department_name}</h1>
            <button onClick={handleBackInStruct}>Назад к структуре компании</button>
            <button onClick={() => setIsModalOpen(true)}>Добавить звено</button>
            <button onClick={() => setIsAddingUser(true)}>Добавить сотрудника</button>

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
            )}

        {isAddingUser && (
                <div className="modal-overlay">
                    <div className="modal-user"> {/* Отдельный класс для модального окна сотрудника */}
                        <div className="modal-card">
                            <h2>Добавить сотрудника</h2>
                            <input
                                type="text"
                                placeholder="Email"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Имя"
                                value={newUser.first_name}
                                onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Фамилия"
                                value={newUser.second_name}
                                onChange={(e) => setNewUser({ ...newUser, second_name: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Отчество"
                                value={newUser.patronymic}
                                onChange={(e) => setNewUser({ ...newUser, patronymic: e.target.value })}
                            />
                            <label>
                                <input
                                    type="checkbox"
                                    checked={newUser.is_head}
                                    onChange={(e) => setNewUser({ ...newUser, is_head: e.target.checked })}
                                />
                                Начальник
                            </label>
                            <div className="modal-buttons">
                                <button onClick={addUser}>Добавить</button>
                                <button onClick={() => setIsAddingUser(false)}>Отмена</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <h2>Существующие подразделения:</h2>
                {departmentData.departments ? (
                    renderDepartments(departmentData.departments)
                ) : (
                    <p>{departmentData.loading ? "Загрузка..." : "Тут пока нет подразделений"}</p>
                )}
            </div>
            <div>
                <h2>Сотрудники:</h2>
                {departmentData.users ? (
                    renderUsers(departmentData.users)
                ) : (
                    <p>{departmentData.loading ? "Загрузка..." : "Тут пока нет сотрудников"}</p>
                )}
            </div>
        </div>
    );
};

export default DepartmentForm;
