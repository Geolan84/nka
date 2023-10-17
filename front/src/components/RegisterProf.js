import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterProf = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [key, setKey] = useState("");
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const submitRegistration = async () => {
    const requestOption = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        license: key,
        email: email,
        password: password,
        first_name: firstName,
        second_name: secondName
      })
    };

    try {
      const response = await fetch("http://localhost:8080/auth/register", requestOption);
      const data = await response.json();

      if (response.ok) {
        const token = data.token;
        localStorage.setItem("token", token);
        navigate("/profile");
      } else {
        setErrorMessage(data.msg);
      }
    } catch (error) {
      console.error("Произошла ошибка при отправке запроса:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitRegistration();
  };

  return (
    <div className="column">
      <form className="box" onSubmit={handleSubmit}>
        <h1 className="title has-text-centered">Регистрация</h1>
        <div className="field">
          <label className="label">Почта</label>
          <div className="control">
            <input
              type="email"
              placeholder="Введите свою почту"
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
        <div className="field">
          <label className="label">Ключ</label>
          <div className="control">
            <input
              type="text"
              placeholder="Введите лицензионный ключ"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="input"
              required
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Имя</label>
          <div className="control">
            <input
              type="text"
              placeholder="Введите своё имя"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="input"
              required
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Фамилия</label>
          <div className="control">
            <input
              type="text"
              placeholder="Введите свою фамилию"
              value={secondName}
              onChange={(e) => setSecondName(e.target.value)}
              className="input"
              required
            />
          </div>
        </div>
        <br />
        <button className="button is-primary" type="submit">
          Зарегистрироваться
        </button>
        {errorMessage && (
          <p className="has-text-danger">{errorMessage}</p>
        )}
      </form>
    </div>
  );
};

export default RegisterProf;