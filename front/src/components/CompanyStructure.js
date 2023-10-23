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

    const handleBackInProf = () => {
        navigate("/profile");
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
                                            onClick={() => handleRenameDepartment(department.department_id)}
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

    const handleRenameDepartment = (departmentId) => {
        // Обработка переименования отдела
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
        </div>
    );
};

export default CompanyStructure;
