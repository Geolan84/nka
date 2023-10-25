import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../css/GanttChart.css';
import logo from '../images/logo.svg';
import { useNavigate } from "react-router-dom";

function VacationDashboard() {
  const [userData, setUserData] = useState(null);
  const token = localStorage.getItem('token');
  const daysInYear = 365; // Общее количество дней в году
  const emptyCellRef = useRef(null);
  const navigate = useNavigate();

  const months = [
    'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
    'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек',
  ];

  const handleNavigateToProfile = () => {
    navigate("/profile");
};


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/dashboard/get_one_level', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    // Получите ширину .empty-cell и установите ее в .user-name
    if (emptyCellRef.current) {
      const emptyCellWidth = emptyCellRef.current.offsetWidth;
      const userNameElements = document.querySelectorAll('.user-name');
      userNameElements.forEach((userNameElement) => {
        userNameElement.style.width = `${emptyCellWidth}px`;
      });
    }
  }, []);

  return (
    <div>
    <div className="header0">
        <img src={logo} alt="Logo" />
        <h1 className="user-title">График</h1>
        <button className="user-logout" onClick={handleNavigateToProfile}>Профиль</button>
    </div>
    <div className="gantt-chart">
      <div className="gantt-chart-header">
        <div className="gantt-chart-cell empty-cell" ref={emptyCellRef}>ФИО</div>
        {months.map((month, index) => (
          <div key={index} className="gantt-chart-cell month">
            {month}
          </div>
        ))}
      </div>
      <div className="gantt-chart-body">
        {userData &&
          userData.users.map((user) => (
            <div key={user.user_id} className="gantt-chart-row">
              <div className="gantt-chart-cell user-name">
                <div className="user-name-content">
                  {user.first_name} {user.second_name} {user.patronymic}
                </div>
              </div>
              {months.map((month, monthIndex) => {
                const monthStartDiv = (daysInYear / months.length) * monthIndex; // Начало месяца
                const monthDays = daysInYear / months.length;
                const vacationWidth = user.vacations
                  .filter((v) => {
                    return (
                      monthStartDiv <= v.end_div &&
                      monthStartDiv + monthDays >= v.start_div
                    );
                  })
                  .map((v) => {
                    const startDay = Math.max(monthStartDiv, v.start_div);
                    const endDay = Math.min(
                      monthStartDiv + monthDays,
                      v.end_div + 1
                    );

                    const startDate = new Date(v.start_date);
                    const endDate = new Date(v.end_date);

                    const formattedStartDate = `${startDate.getDate()}.${startDate.getMonth() + 1}.${startDate.getFullYear()}`;
                    const formattedEndDate = `${endDate.getDate()}.${endDate.getMonth() + 1}.${endDate.getFullYear()}`;

                    const width = ((endDay - startDay) / monthDays) * 100;
                    const marginLeft = ((startDay - monthStartDiv) / monthDays) * 100;
                    return { width, marginLeft, status_id: v.status_id, start_date: formattedStartDate, end_date: formattedEndDate, duration: v.duration};
                  });
                  return (
                    <div key={monthIndex} className="gantt-chart-cell">
                      {vacationWidth.map((vacation, index) => (
                        <div
                          key={index}
                          className={`vacation-line status-${vacation.status_id}`}
                          style={{
                            '--vacation-width': `${vacation.width}%`,
                            marginLeft: `${vacation.marginLeft}%`
                          }}
                          onMouseEnter={() => {
                            const tooltip = document.getElementById(`tooltip-${user.user_id}-${monthIndex}-${index}`);
                            tooltip.style.display = 'block';
                          }}
                          onMouseLeave={() => {
                            const tooltip = document.getElementById(`tooltip-${user.user_id}-${monthIndex}-${index}`);
                            tooltip.style.display = 'none';
                          }}
                        >
                          <div
                            id={`tooltip-${user.user_id}-${monthIndex}-${index}`}
                            className="vacation-date-tooltip"
                            
                          >
                            {vacation.start_date}-{vacation.end_date}<br/>{vacation.duration} дней
                          </div>
                        </div>
                      ))}
                    </div>
                  );
              })}
            </div>
          ))}
      </div>
    </div>
    </div>
  );
}

export default VacationDashboard;
