import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/UserProfile.css";
import logo from '../images/logo.svg';
import avatar from '../images/avatar.png';
import VacationTypePage from "./VacationTypePage";
import VacationPage from "./VacationPage";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const user_id = localStorage.getItem("user_id");
    const role = localStorage.getItem("role");
    const [showDropdown, setShowDropdown] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleOpenTypeModal = () => {
        setIsTypeModalOpen(true);
    };

    const handleBackInProf = () => {
        setIsModalOpen(false);
    };

    const handleBackInTypeProf = () => {
        setIsTypeModalOpen(false);
    };

    const handleNavigateToStructure = () => {
        navigate("/structure");
    };

    const handleNavigateToMyPlan = () => {
        navigate("/my-plan");
    };

    const handleNavigateToReference = () => {
        navigate("/reference");
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleNavigateToApprove = () => {
        navigate("/approve");
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`http://localhost:8080/struct/get_user?user_id=${user_id}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    console.error("Ошибка при загрузке профиля пользователя");
                }
            } catch (error) {
                console.error("Произошла ошибка при выполнении запроса:", error);
            }
        };

        fetchUserProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("role");
        window.location.href = "/";
    };

    return (
        <div>
            <div className="header0">
                <img src={logo} alt="Logo" />
                <h1 className="user-title">Личный кабинет</h1>
                <button className="user-logout" onClick={handleLogout}>Выйти</button>
            </div>

            <div className="user-profile">
                <div className="user-actions">
                {role === "3" && (
                    <button className="user-action" onClick={handleNavigateToStructure}>Перейти к структуре компании</button>
                    )}
                    <button className="user-action" onClick={handleOpenModal}>Запланировать отпуск</button>
                    <button className="user-action" onClick={handleNavigateToMyPlan}>Мой план</button>
                    <button className="user-action">График</button>

                    <button className="user-action" onClick={handleOpenTypeModal}>Иное отсутствие</button>

                    {role === "2" && (
                        <button className="user-action" onClick={handleNavigateToApprove}>Подтвердить отпуска</button>
                    )}

                    <button className="user-action" onClick={handleNavigateToReference}>Справочный центр</button>
                </div>

                <div className="user-profile-2">
                    <div className="user-info">
                        <div className="user-avatar">
                            <img src={avatar} alt="Avatar" />
                        </div>
                        <div className="user-details">
                            {user ? (
                                <>
                                    <p>{user.first_name} {user.second_name} {user.patronymic}</p>
                                    <p>Отдел: {user.department_name}</p>
                                    <p>Email: {user.email}</p>
                                    <p>Роль: {role === "1" ? "Сотрудник" : role === "2" ? "Начальник" : role === "3" ? "Администратор" : "Неизвестно"}</p>
                                </>
                            ) : (
                                <p>Информация о пользователе не найдена</p>
                            )}
                        </div>
                    </div>
                    <div className="user-actions">
                        {/* Your user actions buttons */}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className={`modal-overlay ${isModalOpen ? "active" : ""}`}>
                    <VacationPage onClose={handleBackInProf} />
                </div>
            )}

            {isTypeModalOpen && (
                <div className={`modal-overlay ${isTypeModalOpen ? "active" : ""}`}>
                    <VacationTypePage onClose={handleBackInTypeProf} />
                </div>
            )}
        </div>
    );
};

export default UserProfile;
