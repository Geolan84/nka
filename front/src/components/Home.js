import React from "react";
import { Link } from "react-router-dom";
import "../css/HomePage.css";

const HomePage = () => {
    return (
        <div>
            <h1>Добро пожаловать!</h1>
            <p>Выберите, что вы хотите сделать:</p>
            <Link to="/login">Войти</Link>
            <br/>
            <Link to="/register">Зарегистрироваться</Link>
        </div>
    );
};

export default HomePage; 