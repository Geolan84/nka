import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/CompanyStructure.css";
import logo from '../images/logo.svg';
import iconEdit from '../icons/icons8-edit-64.png';
import iconDelete from '../icons/icons8-trash-can-50.png';
import iconRedir from '../icons/icons8-right-arrow-50.png';

const CompanyStructure = () => {
    const [divisions, setDivisions] = useState([]);
    const [users, setUsers] = useState([]);
    const [departmentNames, setDepartmentNames] = useState([]);
    const [showDepartments, setShowDepartments] = useState(true);
    const [userChanges, setUserChanges] = useState({});
    const [isDataFetched, setIsDataFetched] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newDivision, setNewDivision] = useState("");
    const [dep_id, setDep_id] = useState("");
    const navigate = useNavigate();

    const fetchAllData = async (token) => {
        try {
            const [divisionsResponse, usersResponse, departmentNamesResponse] = await Promise.all([
                fetch("http://localhost:8080/struct/get_all_departments", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }).then((response) => response.json()),
                fetch("http://localhost:8080/struct/get_all_users", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }).then((response) => response.json()),
                fetch("http://localhost:8080/struct/department_names", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }).then((response) => response.json())
            ]);

            if (divisionsResponse) {
                setDivisions([divisionsResponse]);
            }

            if (usersResponse && usersResponse.users) {
                setUsers(usersResponse.users);
            }

            if (departmentNamesResponse && departmentNamesResponse.departments_list) {
                setDepartmentNames(departmentNamesResponse.departments_list);
            }

            setIsDataFetched(true);
        } catch (error) {
            console.error("Ошибка при получении данных:", error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!isDataFetched) {
            fetchAllData(token);
        }
    }, [isDataFetched]);

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

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setNewDivision("");
    };

    const changDivision = () => {
        // Обработка добавления нового подразделения
        closeModal();
    };

    const handleEditDepartment = (departmentId) => {
        openModal();
        setDep_id(departmentId);
    };

    

    const renderAddDivisionModal = () => {
        return (
            <div className="modal-overlay">
                <div className="modal">
                    <div className="modal-card">
                        <h2>Изменить название отдела</h2>
                        <input
                            type="text"
                            placeholder="Новое название"
                            value={newDivision}
                            onChange={(e) => setNewDivision(e.target.value)}
                        />
                        <div className="modal-buttons">
                            <button onClick={() => editDepartment(dep_id)}>Изменить</button> {/* Call editDepartment on button click */}
                            <button onClick={closeModal}>Отмена</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const handleBackInProf = () => {
        navigate("/profile");
    };

    const handleSelectChange = (userId, selectedDepartmentId) => {
        setUsers((prevState) => {
            return prevState.map((user) => {
                if (user.user_id === userId) {
                    setUserChanges({
                        ...userChanges,
                        [userId]: selectedDepartmentId,
                    });
                    return { ...user, department_id: selectedDepartmentId };
                }
                return user;
            });
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
                                checked={department.isExpanded || false}
                                onChange={() => toggleDepartment(department.department_id)}
                            />
                            <label className="tree_label" htmlFor={`c${department.department_id}`}>
                                <span className="department-name">{department.department_name}</span>
                                <div className="tree_buttons">
                                {level > 0 && department.isExpanded && (
                                    <button className="action-button-struc">
                                        <img
                                            src={iconEdit}
                                            alt="Edit Icon"
                                            onClick={() => handleEditDepartment(department.department_id)}
                                            className="action-icon-struc"
                                        />
                                    </button>
                                )}
                                {level > 0 && department.isExpanded && (
                                    <button className="action-button-struc">
                                        <img
                                            src={iconDelete}
                                            alt="Delete Icon"
                                            onClick={() => handleDeleteDepartment(department.department_id)}
                                            className="action-icon-struc"
                                        />
                                    </button>
                                )}
                                {department.isExpanded && (
                                    <button className="action-button-struc">
                                        <img
                                            src={iconRedir}
                                            alt="Redir Icon"
                                            onClick={() => handleDepartmentClick(department.department_id)}
                                            className="action-icon-struc"
                                        />
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

    const renderUsers = (users) => {
        return (
            <table className="my-plan-table user-table">
                <thead>
                    <tr>
                        <th className="my-plan-header">ФИО</th>
                        <th className="my-plan-header">Почта</th>
                        <th className="my-plan-header">Отдел</th>
                        <th className="my-plan-header">Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.user_id}>
                            <td className="my-plan-cell">{`${user.second_name} ${user.first_name}${user.patronymic ? ' ' + user.patronymic : ''}`}</td>
                            <td className="my-plan-cell">{user.email}</td>
                            <td className="my-plan-cell">
                                <select
                                    value={user.department_id}
                                    onChange={(e) => handleSelectChange(user.user_id, e.target.value)}
                                >
                                    {departmentNames.map((department) => (
                                        <option key={department.department_id} value={department.department_id}>
                                            {department.department_name}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td className="my-plan-cell">
                                {userChanges[user.user_id] === user.department_id ? (
                                    <button
                                        onClick={() => handleEditUser(user.user_id)}
                                        className="my-plan-button user-button"
                                    >
                                        Изменить
                                    </button>
                                ) : (
                                    "Изменений нет"
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    const editDepartment = async (departmentId) => {
        try {
            const token = localStorage.getItem("token");
            const newDepartmentName = encodeURIComponent(newDivision); // Кодирование значения newDivision
    
            const url = `http://localhost:8080/struct/edit_department?new_name=${newDepartmentName}&department_id=${departmentId}`;
    
            const response = await fetch(url, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    new_name: newDivision,
                    department_id: departmentId,
                }),
            });
    
            if (response.ok) {
                // Обработка успешного ответа по необходимости
                console.log("Отдел успешно обновлен");
    
                // Загрузка обновленных данных
                await fetchAllData(token);
    
                closeModal(); // Закрыть модальное окно после успешного обновления.
            } else {
                // Обработка ошибок или отображение сообщения об ошибке.
                console.error("Не удалось обновить отдел");
            }
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };
    
    
    

    const handleDeleteDepartment = (departmentId) => {
        // Обработка удаления отдела
    };

    const handleEditUser = (userId) => {
        const selectedDepartmentId = userChanges[userId];
        // Обработка изменения отдела пользователя, используя selectedDepartmentId
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
            <div className="radio-button-group">
                <button
                    className={`radio-button ${showDepartments ? 'active-button' : 'inactive-button'}`}
                    onClick={() => setShowDepartments(true)}
                >
                    Показать департаменты
                </button>
                <button
                    className={`radio-button ${!showDepartments ? 'active-button' : 'inactive-button'}`}
                    onClick={() => setShowDepartments(false)}
                >
                    Показать всех пользователей
                </button>
            </div>
            <div className="FormDep">
                <h2>{showDepartments ? "Существующие отделы" : "Список пользователей"}:</h2>
                {showDepartments && divisions.length > 0 && renderDepartments(divisions)}
                {!showDepartments && users.length > 0 && renderUsers(users)}
            </div>
            {isModalOpen && renderAddDivisionModal()}
        </div>
    );
};

export default CompanyStructure;

