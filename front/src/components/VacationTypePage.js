import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import ru from "date-fns/locale/ru";
import "../css/VacationType.css";

registerLocale("ru", ru);

const VacationTypePage = ({ onClose }) => {
  const [selectedHead, setSelectedHead] = useState("");
  const [heads, setHeads] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [vacationType, setVacationType] = useState(2);
  const navigate = useNavigate();
  const user_id = localStorage.getItem("user_id");
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

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
      const startDateToSend = new Date(startDate);
      startDateToSend.setDate(startDateToSend.getDate() + 1);
  
      const endDateToSend = new Date(endDate);
      endDateToSend.setDate(endDateToSend.getDate() + 1);
  
      // Параметры запроса добавляются в URL
      const url = `http://localhost:8080/apps/get_another_pdf?head_id=${selectedHead}&type_id=${vacationType}&start_date=${startDateToSend.toISOString().split("T")[0]}&end_date=${endDateToSend.toISOString().split("T")[0]}`;
  
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        // Получение файла как Blob
        const blob = await response.blob();
  
        // Имя файла, которое будет использоваться при скачивании
        const filename = "отпуск.pdf";
  
        // Используйте библиотеку file-saver для скачивания файла
        if (window.saveAs) {
          window.saveAs(blob, filename);
        } else {
          // В противном случае, можно использовать нативный метод
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = filename;
          a.style.display = "none";
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }
  
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
  }, [user_id, token]);

  useEffect(() => {
    const fetchHeads = async () => {
      try {
        const response = await fetch("http://localhost:8080/struct/heads", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const headData = await response.json();
          setHeads(headData.heads); // Обратите внимание на обновление этой строки
        } else {
          console.error("Ошибка при загрузке списка руководителей");
        }
      } catch (error) {
        console.error("Произошла ошибка при выполнении запроса:", error);
      }
    };

    fetchHeads();
  }, [token]);

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
      <div className="comment-container-vac-type">
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
      </div>
      <div className="comment-container-vac-type">
        <label className="date-label-vac-type">Выберите руководителя:</label>
        <select
          value={selectedHead}
          onChange={(e) => setSelectedHead(e.target.value)}
          className="vacation-type-select"
        >
          <option value="">-- Выберите руководителя --</option>
          {heads.map((head, index) => ( // Обновление итерации по руководителям
            <option key={index} value={head.user_id}>
              {head.full_name}
            </option>
          ))}
        </select>
      </div>
      <div className="date-container-vac-type">
        <label className="date-label-vac-type">Дата начала:</label>
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          locale="ru"
          dateFormat="dd-MM-yyyy"
          className="date-picker-vac-type"
        />
      </div>
      <div className="date-container-vac-type">
        <label className="date-label-vac-type">Дата окончания:</label>
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          locale="ru"
          dateFormat="dd-MM-yyyy"
          className="date-picker-vac-type"
        />
      </div>
      <div className="action-buttons-vac-type">
        <button onClick={handleSendVacationRequest}>Отправить заявку на отпуск</button>
        <button onClick={handleBackInProf}>Назад в профиль</button>
      </div>
    </div>
  );
};

export default VacationTypePage;
