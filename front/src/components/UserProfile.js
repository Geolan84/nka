import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
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

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");// Нет токена, перенаправляем пользователя на страницу входа
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

    //if (loading) {
    //    return <div>Loading...</div>;
    //}

    return (
        <div>
            <h1>Личный кабинет</h1>
            {user ? (
                <div>
                    <p>Имя: {user.first_name}</p>
                    <p>Фамилия: {user.second_name}</p>
                    <p>Email: {user.email}</p>
                </div>
            ) : (
                <p>Информация о пользователе не найдена</p>
            )}
            
                <button onClick={handleNavigateToStructure}>Перейти к структуре компании</button>
                <br/>
          
            <button onClick={handleNavigateToVacation}>Запланировать отпуск</button>
            <br/>
            <button>Мой план</button>
            <br/>
            <div className="Graphic">
                <button onClick={toggleDropdown}>График</button>
                <br/>
                {showDropdown && (
                    <div>
                        <button>Сектор</button>
                        <br/>
                        <button>Отдел</button>
                    </div>
                )}
            </div>
            <button>Иное отсутсвие</button>
            <br/>
            <button>Справочный центр</button>
            <br/>
            <button onClick={handleLogout}>Выйти</button>
        </div>
    );
};

export default UserProfile;