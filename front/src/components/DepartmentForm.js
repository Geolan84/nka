import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import logo from '../images/logo.svg';
import "../css/DepartmentForm.css";

const DepartmentForm = () => {
    const navigate = useNavigate();
    const { departmentId } = useParams();
    const id = departmentId.split('=')[1];
    const [departmentData, setDepartmentData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddingUser, setIsAddingUser] = useState(false);
    const [newDivision, setNewDivision] = useState("");
    const [newUser, setNewUser] = useState({
        email: "",
        first_name: "",
        second_name: "",
        patronymic: "",
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

    const handleDepartmentClick = (departmentId) => {
        navigate(`/structure/dep=${departmentId}`);
    };

    const renderUsers = (users) => {
        return users.map((user) => (
            <tr key={user.user_id}>
                <td className="my-plan-data">
                    {`${user.second_name} ${user.first_name} ${user.patronymic}`}
                </td>
                <td className="my-plan-data">{user.email}</td>
                <td className="my-plan-data">{user.role_id === 1 ? "Сотрудник" : user.role_id === 2 ? "Руководитель" : user.role_id === 3 ? "Администратор" : "Неизвестно"}</td>
            </tr>
        ));
    };

    const renderDepartments = (departments) => {
        return departments.map((department) => (
            <div
                key={department.department_id}
                onClick={() => handleDepartmentClick(department.department_id)} // Обработчик клика на подразделение
                className="clickable-department" // Добавьте класс для стилизации как кликабельных
            >
                {department.department_name}
            </div>
        ));
    };

    return (
        <div>
            <div className="header0">
                <img onClick={handleBackInProf} src={logo} alt="Logo" />
                <h1>{departmentData.department_name}</h1>
                <div className="heder-buttons">
                    <button className="login-button" onClick={handleBackInProf}>
                        Назад в профиль
                    </button>
                    <button className="login-button" onClick={handleBackInStruct}>
                        Назад к структуре компании
                    </button>
                </div>
            </div>

            

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
                    <div className="modal-user">
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
            <div className="dep-mas"><h2>Сотрудники:</h2></div>
                {departmentData.users ? (
                    <table className="my-plan-table user-table">
                        <thead>
                            <tr>
                                <th className="my-plan-header">ФИО</th>
                                <th className="my-plan-header">Почта</th>
                                <th className="my-plan-header">Должность</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderUsers(departmentData.users)}
                        </tbody>
                    </table>
                ) : (
                    <p>{departmentData.loading ? "Загрузка..." : "Тут пока нет сотрудников"}</p>
                )}
                <button className="add-user-button" onClick={() => setIsAddingUser(true)}>Добавить сотрудника</button>
            </div>

            
            <div className="dep-mas"><h2>Существующие подразделения:</h2>
                {departmentData.departments ? (
                    renderDepartments(departmentData.departments)
                ) : (
                    <p>{departmentData.loading ? "Загрузка..." : "Тут пока нет подразделений"}</p>
                )}
            </div>
                <button className="add-dep-button" onClick={() => setIsModalOpen(true)}>Добавить подразделение</button>
        </div>
    );
};

export default DepartmentForm;
