import React from "react";
import {Link} from "react-router-dom";
import "../css/HomePage.css";
import logo from '../images/logo.svg';
import point from '../images/point.svg';

const HomePage = () => {
    return (
        <div>
            <div className="header0">
        <img src={logo} alt="Logo" />
        <div>
        <Link to="/login"><button className="login-button">Для сотрудника</button></Link>
        <Link to="/register"><button className="login-button">Для работодателя</button></Link>
        </div>
      </div>
      
            <div className="container">
                <h4>Добро пожаловать в "ЭНКА"!</h4>
                <h2>- ваш умный и надежный помощник в мире отпусков!</h2>
                <h3>Это инструмент, который автоматизирует процессы планирования, согласования и контроля отпусков, что
                    позволяет сэкономить время и ресурсы, а также избежать ошибок и нарушений.
                </h3>
                <div className="block">
                    <div className="h3">
                        <Link to="/register">Начать планировать</Link>
                    </div>
                </div>
            </div>
            <div className="gray">
                <h1>В чем преимущества платформы?</h1>
            </div>
            <div className="text_container">
                <div className="text">Быстрый старт</div>
                <div className="text">Понятный интерфейс</div>
                <div className="text">Простота использования</div>
            </div>
            <div className="gray">
                <h1>Этот сервис подходит Вам, если:</h1>
            </div>
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

            <p>Copyrights 2023 &copy; yenka.ru</p>
        </div>
    );
};
export default HomePage; 