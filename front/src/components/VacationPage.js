import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import ru from "date-fns/locale/ru"; // Импортируйте русскую локализацию

registerLocale("ru", ru); // Регистрируйте русскую локализацию

const VacationPage = () => {
  const [comment, setComment] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const navigate = useNavigate();
  const user_id = localStorage.getItem("user_id");
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleBackInProf = () => {
    navigate("/profile");
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleSendVacationRequest = async () => {
    try {
      const response = await fetch("http://localhost:8080/apps/new_app", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: 1,
          note: comment,
          start_date: startDate.toISOString().split('T')[0], // Форматирование даты в "yyyy-MM-dd"
          end_date: endDate.toISOString().split('T')[0], // Форматирование даты в "yyyy-MM-dd"
        }),
      });

      if (response.ok) {
        // Запрос успешно отправлен
        console.log("Заявка на отпуск отправлена");
        navigate("/profile"); // Перенаправляем на профиль после отправки заявки
      } else {
        console.log(startDate.toISOString().split('T')[0])
        console.error("Ошибка при отправке заявки на отпуск");
      }
    } catch (error) {
      console.error("Произошла ошибка при выполнении запроса:", error);
    }
  };

  useEffect(() => {
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

  return (
    <div>
      <h1>Планирование основного отпуска</h1>
      {user ? (
        <div>
          <p>{user.first_name} {user.second_name}</p>
        </div>
      ) : (
        <p>Информация о пользователе не найдена</p>
      )}
      <label>Комментарий:</label>
      <input type="text" value={comment} onChange={handleCommentChange} />
      <label>Дата начала:</label>
      <DatePicker
        selected={startDate}
        onChange={handleStartDateChange}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        locale="ru"
        dateFormat="yyyy-MM-dd"
      />
      <br />
      <label>Дата окончания:</label>
      <DatePicker
        selected={endDate}
        onChange={handleEndDateChange}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        locale="ru"
        dateFormat="yyyy-MM-dd"
      />
      <br />
      <button onClick={handleSendVacationRequest}>Отправить заявку на отпуск</button>
      <button onClick={handleBackInProf}>Назад в профиль</button>
    </div>
  );
};

export default VacationPage;
