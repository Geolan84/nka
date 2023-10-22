import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import ru from "date-fns/locale/ru";
import "../css/VacationType.css";

registerLocale("ru", ru);

const VacationTypePage = ({ onClose }) => {
  const [comment, setComment] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [vacationType, setVacationType] = useState(1);
  const navigate = useNavigate();
  const user_id = localStorage.getItem("user_id");
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleBackInProf = () => {
    onClose();
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleVacationTypeChange = (e) => {
    setVacationType(parseInt(e.target.value, 10));
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
          type: vacationType,
          note: comment,
          start_date: startDate.toISOString().split("T")[0],
          end_date: endDate.toISOString().split("T")[0],
        }),
      });

      if (response.ok) {
        console.log("Заявка на отпуск отправлена");
        onClose();
      } else {
        console.error("Ошибка при отправке заявки на отпуск");
      }
    } catch (error) {
      console.error("Произошла ошибка при выполнении запроса:", error);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/struct/get_user?user_id=${user_id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
    <div className="container-vac-type">
      <div className="header-vac-type">
        <h1>Иное отсутствие</h1>
      </div>
      <div className="user-info-vac-type">
        {user ? (
          <p>
            {user.first_name} {user.second_name}
          </p>
        ) : (
          <p>Информация о пользователе не найдена</p>
        )}
      </div>
      <div className="count-days-vac-type">
        Выбрано {countSelectedDays()} дней отпуска
      </div>
      <label className="date-label-vac-type">Тип отпуска:</label>
      <select
        value={vacationType}
        onChange={handleVacationTypeChange}
        className="vacation-type-select"
      >
        <option value={2}>Дополнительный оплачиваемый отпуск</option>
        <option value={3}>Отпуск без сохранения з/п</option>
        <option value={4}>Отпуск по уходу за ребёнком</option>
        <option value={5}>Учебный отпуск</option>
        <option value={6}>Донорский день</option>
      </select>
      <label className="comment-label-vac-type">Комментарий:</label>
      <input
        type="text"
        value={comment}
        onChange={handleCommentChange}
        className="comment-input-vac-type"
      />
      <label className="date-label-vac-type">Дата начала:</label>
      <DatePicker
        selected={startDate}
        onChange={handleStartDateChange}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        locale="ru"
        dateFormat="yyyy-MM-dd"
        className="date-picker-vac-type"
      />
      <label className="date-label-vac-type">Дата окончания:</label>
      <DatePicker
        selected={endDate}
        onChange={handleEndDateChange}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        locale="ru"
        dateFormat="yyyy-MM-dd"
        className="date-picker-vac-type"
      />
      <div className="action-buttons-vac-type">
        <button onClick={handleSendVacationRequest}>Отправить заявку на отпуск</button>
        <button onClick={handleBackInProf}>Назад в профиль</button>
      </div>
    </div>
  );
};

export default VacationTypePage;
