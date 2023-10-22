import React from "react";
import {useNavigate} from "react-router-dom";
import "../css/HomePage.css";
import logo from '../images/logo.svg';
import point from '../images/point.svg';

const HomePage = () => {
    const navigate = useNavigate();
    const handleNavigateToLogin = () => {
        navigate("/login");
    };
    const handleNavigateToRegister = () => {
        navigate("/register");
    };
    return (
        <div>
            <div className="header0">
        <img src={logo} alt="Logo" />
        <div>
            <button className="login-button" onClick={handleNavigateToLogin}>Для сотрудника</button>
            <button className="login-button" onClick={handleNavigateToRegister}>Для работодателя</button>
        </div>
      </div>
      
            <div className="container">
                <h4 className="h4-home">Добро пожаловать в "ЭНКА"!</h4>
                <h2 className="h2-home">- ваш умный и надежный помощник в мире отпусков!</h2>
                <h3 className="h3-home">Это инструмент, который автоматизирует процессы планирования, согласования и контроля отпусков, что
                    позволяет сэкономить время и ресурсы, а также избежать ошибок и нарушений.
                </h3>
                <div className="block">
                    <div className="h3-b-home">
                        <a className="a-home" onClick={handleNavigateToLogin}>Начать планировать</a>
                    </div>
                </div>
            </div>
            <div className="gray">
                <h1 className="h1-home">В чем преимущества платформы?</h1>
            </div>
            <div className="text_container">
                <div className="text-home">Быстрый старт</div>
                <div className="text-home">Понятный интерфейс</div>
                <div className="text-home">Простота использования</div>
            </div>
            <div className="gray">
                <h1>Этот сервис подходит Вам, если:</h1>
            </div>
            <div className="centered-image-container">
            <div className="image-container">
                <div className="photo_container">
                    <div className="image">
                        <img src="https://image2.thematicnews.com/uploads/topics/preview/00/20/64/34/96b74dd26e.jpg"
                             alt="Photo 3"/>
                    </div>
                    <div className="image">
                        <img src="https://image2.thematicnews.com/uploads/topics/preview/00/20/64/34/96b74dd26e.jpg"
                             alt="Photo 4"/>
                    </div>
                </div>
                <div className="photo_container">
                    <div className="plus">
                        <div className="point_svg">
                            <img src={point} alt="point"/>
                        </div>
                        Вы устали от большого количества печатной документации.
                    </div>
                    <div className="plus"><br/></div>
                    <div className="plus">
                        <div className="point_svg">
                            <img src={point} alt="point1"/>
                        </div>
                        Вы разочарованы ручным отслеживанием отпусков в электронных таблицах.
                    </div>
                    <div className="plus"><br/></div>
                    <div className="plus">
                        <div className="point_svg">
                            <img src={point} alt="point3"/>
                        </div>
                        Вам нужна большая гибкость и прозрачность в планировании отпусков.
                    </div>
                </div>
                </div>
            </div>
            <div className="centered-p-home">
                <p className="p-home">Copyrights 2023 &copy; nka.ru</p>
            </div>
        </div>
    );
};
export default HomePage; 