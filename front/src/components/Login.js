import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";
import logo from '../images/logo.svg';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setErrorMessage] = useState("");
  const [error, setError] = useState(""); // Добавляем состояние для ошибки

  const submitLogin = async () => {
    const requestOption = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    };

    try {
      const response = await fetch("http://localhost:8080/auth/login", requestOption);
      const data = await response.json();

      if (response.ok) {
        const token = data.token;
        const user_id = data.user_id;
        const role = data.role;
        localStorage.setItem("token", token);
        localStorage.setItem("user_id", user_id);
        localStorage.setItem("role", role);
        navigate("/profile");
      } else if (response.status === 400) {
        setError("Ошибка логина или пароля");
      } else {
        setErrorMessage(data.msg);
      }
    } catch (error) {
      console.error("Произошла ошибка при отправке запроса:", error);
    }
  };

  const handleReturn = () => {
    navigate("/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitLogin();
  };

  return (
    <div>
      <div className="header0">
        <img src={logo} alt="Logo" />
        <button onClick={handleReturn}>
          Вернуться
        </button>
      </div>
      <div className="login-container">
        <h1 className="login-title">Вход</h1>
        {error && <div className="error-message">{error}</div>}
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Почта"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button-2">
            Войти
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
