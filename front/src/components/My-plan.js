import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/MyPlan.css"; // Подключаем стили
import SelectHeadModal from "./SelectHeadModal";

const MyPlan = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [applications, setApplications] = useState([]);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [heads, setHeads] = useState([]);

  // Создаем объект с соответствиями для статусов заявок
  const statusMappings = {
    1: 'На согласовании',
    2: 'Согласовано',
    3: 'Отказано',
  };

  const formatDateTime = (dateTimeStr) => {
    const dateTime = new Date(dateTimeStr);
    const year = dateTime.getFullYear();
    const month = (dateTime.getMonth() + 1).toString().padStart(2, '0');
    const day = dateTime.getDate().toString().padStart(2, '0');
    const hours = dateTime.getHours().toString().padStart(2, '0');
    const minutes = dateTime.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch("http://localhost:8080/apps/get_apps", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Заменяем type_id и status_id на текст с использованием объектов с соответствиями
          const applicationsWithText = data.applications.map(application => ({
            ...application,
            status_id: statusMappings[application.status_id],
          }));
          setApplications(applicationsWithText);
        } else {
          console.error("Ошибка при загрузке заявок на отпуск");
        }
      } catch (error) {
        console.error("Произошла ошибка при выполнении запроса:", error);
      }
    };

    fetchApplications();
  }, [token]);

  const openModalForApplication = (applicationId) => {
    setSelectedApplicationId(applicationId);
  };

  const closeAndDownload = () => {
    // Here, you can implement the download logic for the selected application
    // Once the download is complete, you can close the modal
    setSelectedApplicationId(null);
  };

  return (
    <div className="my-plan">
      <h1 className="my-plan-title">Мои заявки на отпуск</h1>
      <table className="my-plan-table">
        <thead>
          <tr>
            <th className="my-plan-header">Комментарий</th>
            <th className="my-plan-header">Дата начала</th>
            <th className="my-plan-header">Дата окончания</th>
            <th className="my-plan-header">Статус</th>
            <th className="my-plan-header">Дата подачи</th>
            <th className="my-plan-header">Действия</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(application => (
            <tr key={application.application_id}>
              <td className="my-plan-cell">{application.note}</td>
              <td className="my-plan-cell">{application.start_date}</td>
              <td className="my-plan-cell">{application.end_date}</td>
              <td className="my-plan-cell">{application.status_id}</td>
              <td className="my-plan-cell">{formatDateTime(application.moment)}</td>
              <td className="my-plan-cell">
                {application.status_id === 'Согласовано' && (
                  <button className="my-plan-button" onClick={() => openModalForApplication(application.application_id)}>
                    Скачать
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="my-plan-button login-button" onClick={() => navigate("/profile")}>
        Назад в профиль
      </button>
      {selectedApplicationId !== null && (
        <SelectHeadModal
          isOpen={true}
          onClose={closeAndDownload}
          heads={heads}
          selectedHead={selectedApplicationId}
          appId={selectedApplicationId}
          onSelectHead={() => {}}
        />
      )}
    </div>
  );
};

export default MyPlan;
