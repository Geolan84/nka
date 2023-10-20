import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/MyPlan.css"; // Подключаем стили

const MyPlan = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [applications, setApplications] = useState([]);

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
          setApplications(data.applications);
        } else {
          console.error("Ошибка при загрузке заявок на отпуск");
        }
      } catch (error) {
        console.error("Произошла ошибка при выполнении запроса:", error);
      }
    };

    fetchApplications();
  }, [token]);

  return (
    <div className="my-plan">
      <h1 className="my-plan-title">Мои заявки на отпуск</h1>
      <table className="my-plan-table">
        <thead>
          <tr>
            <th className="my-plan-header">Заявка №</th>
            <th className="my-plan-header">Тип</th>
            <th className="my-plan-header">Комментарий</th>
            <th className="my-plan-header">Дата начала</th>
            <th className="my-plan-header">Дата окончания</th>
            <th className="my-plan-header">Статус</th>
            <th className="my-plan-header">Дата подачи</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <tr key={application.application_id}>
              <td className="my-plan-cell">{application.application_id}</td>
              <td className="my-plan-cell">{application.type_id}</td>
              <td className="my-plan-cell">{application.note}</td>
              <td className="my-plan-cell">{application.start_date}</td>
              <td className="my-plan-cell">{application.end_date}</td>
              <td className="my-plan-cell">{application.status_id}</td>
              <td className="my-plan-cell">{application.moment}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="my-plan-button" onClick={() => navigate("/profile")}>
        Назад в профиль
      </button>
    </div>
  );
};

export default MyPlan;
