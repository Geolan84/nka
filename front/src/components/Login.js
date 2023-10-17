import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate(); // Используйте useNavigate для доступа к объекту history
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setErrorMessage] = useState("");

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
        navigate("/profile"); // Используйте navigate для перехода
      } else {
        setErrorMessage(data.msg);
      }
    } catch (error) {
      console.error("Произошла ошибка при отправке запроса:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitLogin();
  };

  return (
    <div className="column">
      <form className="box" onSubmit={handleSubmit}>
        <h1 className="title has-text-centered">Вход</h1>
        <div className="field">
          <label className="label">Почта</label>
          <div className="control">
            <input
              type="email"
              placeholder="Введите почту"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Пароль</label>
          <div className="control">
            <input
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
            />
          </div>
        </div>
        <br />
        <button className="button is-primary" type="submit">
          Войти
        </button>
      </form>
    </div>
  );
};

export default Login;
