import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/MyPlan.css";

const Approve = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [apps, setApps] = useState([]);

  const formatDateTime = (dateTimeStr) => {
    const dateTime = new Date(dateTimeStr);
    const year = dateTime.getFullYear();
    const month = (dateTime.getMonth() + 1).toString().padStart(2, '0');
    const day = dateTime.getDate().toString().padStart(2, '0');
    const hours = dateTime.getHours().toString().padStart(2, '0');
    const minutes = dateTime.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const typeMappings = {
    2: 'Дополнительный оплачиваемый отпуск',
    3: 'Отпуск без сохранения з/п',
    4: 'Отпуск по уходу за ребёнком',
    5: 'Учебный отпуск',
    6: 'Донорский день',
  };

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await fetch("http://localhost:8080/apps/get_active_apps", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Заменяем type_id и status_id на текст с использованием объектов с соответствиями
          const appsWithText = data.apps.map(app => ({
            ...app,
            type_id: typeMappings[app.type_id],
          }));
          setApps(appsWithText);
        } else {
          console.error("Ошибка при загрузке заявок на отпуск");
        }
      } catch (error) {
        console.error("Произошла ошибка при выполнении запроса:", error);
      }
    };

    fetchApps();
  }, [token]);

  const handleApprove = (appId) => {
    // Отправить POST-запрос на сервер для согласования заявки
    fetch(`http://localhost:8080/apps/approve?app_id=${appId}&status_id=1`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Обработка успешного согласования (по желанию)
          // Можно обновить интерфейс или выполнить другие действия
        }
      })
      .catch((error) => {
        console.error("Ошибка при согласовании заявки:", error);
      });
  };

  const handleReject = (appId) => {
    // Отправить POST-запрос на сервер для отказа в заявке
    fetch(`http://localhost:8080/apps/approve?app_id=${appId}&status_id=3`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Обработка успешного отказа (по желанию)
          // Можно обновить интерфейс или выполнить другие действия
        }
      })
      .catch((error) => {
        console.error("Ошибка при отказе в заявке:", error);
      });
  };

  return (
    <div className="my-plan">
      <h1 className="my-plan-title">Заявки на согласование</h1>
      <table className="my-plan-table">
        <thead>
          <tr>
            <th className="my-plan-header">Имя</th>
            <th className="my-plan-header">Комментарий</th>
            <th className="my-plan-header">Дата начала</th>
            <th className="my-plan-header">Дата окончания</th>
            <th className="my-plan-header">Дата обновления</th>
            <th className="my-plan-header">Действия</th>
          </tr>
        </thead>
        <tbody>
          {apps.map(app => (
            <tr key={app.application_id}>
              <td className="my-plan-cell">{`${app.second_name} ${app.first_name} ${app.patronymic}`}</td>
              <td className="my-plan-cell">{app.note}</td>
              <td className="my-plan-cell">{app.start_date}</td>
              <td className="my-plan-cell">{app.end_date}</td>
              <td className="my-plan-cell">{formatDateTime(app.moment)}</td>
              <td className="my-plan-cell">
                {app.status_id === 1 ? (
                  <>
                    <button className="ToApprove" onClick={() => handleApprove(app.application_id)}>Согласовать</button>
                    <button className="Deny" onClick={() => handleReject(app.application_id)}>Отказать</button>
                  </>
                ) : (
                  "Нельзя согласовать"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="my-plan-button login-button" onClick={() => navigate("/profile")}>
        Назад в профиль
      </button>
    </div>
  );
};

export default Approve;
