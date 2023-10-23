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

  // Идентификаторы документов Consultant.ru для гиперссылок
  const linkIds = [
    "7c366ded2c0c00fa6bcf8f2ca11917e7075f9cef",
    "1ea2cd88521106bc484f44be9e24fa81034d13e5",
    "4b81f3bdfda7b890f6be7740c3d91e8bd6afda5d",
    "56236a39da1eba84f52b37d378edbffd1710628e",
    "627272a057d8634b0366744b16b04a6853d96fad",
    "5096118a0d71c28f406acf6275cd6c1c36efe705",
    "befc35b415ff7b334824418693252b451205ffc0",
    "2f173da324a5464ef649b88f7347b8a17d200dae",
  ];

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
      <div className="comment-container-vac">
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
        <button onClick={handleBackInProf}>Назад в профиль</button>
      </div>

      <div className="learn-more-links">
        <p>
          Подробнее об основном отпуске:{" "}
          {linkIds.map((linkId, index) => (
            <a
              key={index}
              href={`https://www.consultant.ru/document/cons_doc_LAW_34683/${linkId}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "black" }}
            >
              {index < linkIds.length && index > 0 ? `, ` : ``}
              [{index}]
            </a>
          ))}
        </p>
      </div>
    </div>
  );
};

export default VacationPage;
