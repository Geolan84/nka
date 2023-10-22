import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import ru from "date-fns/locale/ru";
import "../css/Vacation.css";

registerLocale("ru", ru);

const VacationPage = ({ onClose }) => {
  const [comment, setComment] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const navigate = useNavigate();
  const user_id = localStorage.getItem("user_id");
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleBackInProf = () => {
    onClose(); // Вызываем переданную функцию для закрытия модального окна
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
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
        }),
      });

      if (response.ok) {
        console.log("Заявка на отпуск отправлена");
        onClose(); // Закрыть модальное окно после успешной отправки
      } else {
        console.log(startDate.toISOString().split('T')[0]);
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

  const countSelectedDays = () => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil((diffTime / (1000 * 60 * 60 * 24)) + 1);
      return diffDays;
    }
    return 0;
  };

  return (
    <div className="container-vac">
      <div className="header-vac">
        <h1>Планирование основного отпуска</h1>
      </div>
      <div className="user-info-vac">
        {user ? (
          <p>{user.first_name} {user.second_name}</p>
        ) : (
          <p>Информация о пользователе не найдена</p>
        )}
      </div>
      <div className="count-days-vac">
        Выбрано {countSelectedDays()} дней отпуска
      </div>
      <div className="comment-container">
        <label className="comment-label-vac">Комментарий:</label>
        <input
          type="text"
          value={comment}
          onChange={handleCommentChange}
          className="comment-input-vac"
        />
      </div>
      <div className="date-container">
        <label className="date-label-vac">Дата начала:</label>
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          locale="ru"
          dateFormat="yyyy-MM-dd"
          className="date-picker-vac"
        />
      </div>
              
      <div className="date-container">
        <label className="date-label-vac">Дата окончания:</label>
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          locale="ru"
          dateFormat="yyyy-MM-dd"
          className="date-picker-vac"
        />
      </div>
      <div className="action-buttons-vac">
        <button onClick={handleSendVacationRequest}>Отправить заявку на отпуск</button>
        <button onClick={handleBackInProf}>Назад в профиль</button> {/* Вызываем функцию при нажатии на кнопку */}
      </div>
    </div>
  );
};

export default VacationPage;
