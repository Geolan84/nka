import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/UserProfile.css";
import logo from '../images/logo.svg';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const user_id = localStorage.getItem("user_id");
    const role = localStorage.getItem("role");
    const [showDropdown, setShowDropdown] = useState(false);

    const handleNavigateToStructure = () => {
        navigate("/structure");
    };

    const handleNavigateToVacation = () => {
        navigate("/vacation");
    };

    const handleNavigateToMyPlan = () => {
        navigate("/my-plan");
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login"); // Нет токена, перенаправляем пользователя на страницу входа
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
        // Удаляем токен из localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("role");
        // Перенаправляем на главную страницу
        window.location.href = "/";
    };

    return (
        <div>
        <div className="header0">
            <img src={logo} alt="Logo" />
            <button className="user-logout" onClick={handleLogout}>Выйти</button>
        </div>
        <div className="user-profile">
            <div className="user-actions">
                <h1 className="user-title">Личный кабинет</h1>
                <button className="user-action" onClick={handleNavigateToStructure}>Перейти к структуре компании</button>
                <button className="user-action" onClick={handleNavigateToVacation}>Запланировать отпуск</button>
                <button className="user-action" onClick={handleNavigateToMyPlan}>Мой план</button>
                <div className="graphic">
                    <button className="user-action" onClick={toggleDropdown}>График</button>
                    {showDropdown && (
                        <div className="dropdown">
                            <button className="user-action">Сектор</button>
                            <button className="user-action">Отдел</button>
                        </div>
                    )}
                </div>
                <button className="user-action">Иное отсутствие</button>
                <button className="user-action">Справочный центр</button>
            </div>
            <div className="user-info">
                {user ? (
                    <>
                        <p>Имя: {user.first_name}</p>
                        <p>Фамилия: {user.second_name}</p>
                        <p>Отдел: </p>
                        <p>Email: {user.email}</p>
                        
                    </>
                ) : (
                    <p>Информация о пользователе не найдена</p>
                )}
            </div>
        </div>
        </div>
    );
};

export default UserProfile;
