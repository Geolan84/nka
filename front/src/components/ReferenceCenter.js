import React from "react";
import logo from '../images/logo.svg';
import { useNavigate } from "react-router-dom";

const ReferenceCenter = () => {
    const role = localStorage.getItem("role");
    const navigate = useNavigate();
    const handleNavigateToProfile = () => {
        navigate("/profile");
    };
    const renderReferenceCenter = () => {
        if (role === "1") {
            return (
                <div className="reference-center">
                    <p>Нормативные правовые акты:</p>
                    <ul>
                        <li>
                            <a href="https://www.consultant.ru/document/cons_doc_LAW_34683/ec9a8272d8fc72bae7a1c8fff8924d87de7daf2f/" target="_blank" rel="noopener noreferrer">
                                Глава 19 Трудового кодекса Российской Федерации от 30.12.2001 N 197-ФЗ
                            </a>
                        </li>
                        <li>Локальный акт КонсультантПлюс (гиперссылка пока отсутствует)</li>
                    </ul>
        
                    <p>Готовые решения от компании КонсультантПлюс:</p>
                    <ul>
                        <li>
                            <a href="https://cloud.consultant.ru/cloud/cgi/online.cgi?req=doc&ts=UkKLKtTi2eY7lWYr&cacheid=F12D3DF56B9F8CE90D68452DFF5F0FC6&mode=splus&rnd=LFAr6Q&base=PBI&n=265768&dst=1000000001#49XiUtTSiBiajnC9" target="_blank" rel="noopener noreferrer">
                                Как разделить ежегодный отпуск на части
                            </a>
                        </li>
                        <li>
                            <a href="https://cloud.consultant.ru/cloud/cgi/online.cgi?req=doc&ts=0KXiUtTzsp7SCTHL&cacheid=D9BF3194B4435E855641DBCD072B919C&mode=splus&rnd=2Wxenw&base=PKBO&n=44784#ZZykUtTxeYxI2CRA" target="_blank" rel="noopener noreferrer">
                                Как продлить ежегодный отпуск по больничному листу
                            </a>
                        </li>
                        <li>
                            <a href="https://cloud.consultant.ru/cloud/cgi/online.cgi?req=doc&ts=0KXiUtTzsp7SCTHL&cacheid=D9BF3194B4435E855641DBCD072B919C&mode=splus&rnd=2Wxenw&base=PKBO&n=53455#lahiUtTmAFIJArTC1" target="_blank" rel="noopener noreferrer">
                                Кому предоставляется отпуск по уходу за ребенком
                            </a>
                        </li>
                        <li>
                            <a href="https://cloud.consultant.ru/cloud/cgi/online.cgi?req=doc&ts=0KXiUtTzsp7SCTHL&cacheid=D9BF3194B4435E855641DBCD072B919C&mode=splus&rnd=2Wxenw&base=PKBO&n=53604#7A1jUtT674E2VimN1" target="_blank" rel="noopener noreferrer">
                                Как оформить отпуск по уходу за ребенком до 1,5 лет
                            </a>
                        </li>
                        <li>
                            <a href="https://cloud.consultant.ru/cloud/cgi/online.cgi?req=doc&ts=0KXiUtTzsp7SCTHL&cacheid=D9BF3194B4435E855641DBCD072B919C&mode=splus&rnd=2Wxenw&base=PKBO&n=52937#F9djUtTeU06He3JP" target="_blank" rel="noopener noreferrer">
                                Как оформить отпуск по уходу за ребенком до 3 лет при его усыновлении
                            </a>
                        </li>
                        <li>
                            <a href="https://cloud.consultant.ru/cloud/cgi/online.cgi?req=doc&ts=0KXiUtTzsp7SCTHL&cacheid=D9BF3194B4435E855641DBCD072B919C&mode=splus&rnd=2Wxenw&base=PKBO&n=51845#IVwjUtTdwWepdpcW" target="_blank" rel="noopener noreferrer">
                                Как оформить отпуск по уходу за ребенком от 1,5 до 3 лет
                            </a>
                        </li>
                        <li>
                            <a href="https://cloud.consultant.ru/cloud/cgi/online.cgi?req=doc&ts=0KXiUtTzsp7SCTHL&cacheid=D9BF3194B4435E855641DBCD072B919C&mode=splus&rnd=2Wxenw&base=PKBO&n=52918#pO5kUtTwJ0oSQsmD1" target="_blank" rel="noopener noreferrer">
                                Как оформить отпуск по уходу за ребенком до 1,5 лет при рождении двойни
                            </a>
                        </li>
                        <li>
                            <a href="https://cloud.consultant.ru/cloud/cgi/online.cgi?req=doc&ts=0KXiUtTzsp7SCTHL&cacheid=D9BF3194B4435E855641DBCD072B919C&mode=splus&rnd=2Wxenw&base=PKBO&n=51964#oJKkUtTE1wX2Wvpo" target="_blank" rel="noopener noreferrer">
                                Как оформить отпуск по уходу за ребенком до 3 лет при рождении двух детей (двойни)
                            </a>
                        </li>
                        <li>
                            <a href="https://cloud.consultant.ru/cloud/cgi/online.cgi?req=doc&ts=0KXiUtTzsp7SCTHL&cacheid=D9BF3194B4435E855641DBCD072B919C&mode=splus&rnd=2Wxenw&base=PKBO&n=45316#03piUtTC0fuldMI31" target="_blank" rel="noopener noreferrer">
                                Как оформить отпуск по уходу за больным членом семьи
                            </a>
                        </li>
                    </ul>
                </div>
            );
        } else if (role === "2" || role === "3") {
            return (
                <div className="reference-center">
                    <p>Нормативные правовые акты:</p>
                    <ul>
                        <li>
                            <a href="https://www.consultant.ru/document/cons_doc_LAW_34683/ec9a8272d8fc72bae7a1c8fff8924d87de7daf2f/" target="_blank" rel="noopener noreferrer">
                                Глава 19 Трудового кодекса Российской Федерации от 30.12.2001 N 197-ФЗ
                            </a>
                        </li>
                        <li>Локальный акт КонсультантПлюс</li>
                    </ul>
        
                    <p>Готовые решения от компании КонсультантПлюс:</p>
                    <ul>
                        <li>
                            <a href="https://cloud.consultant.ru/cloud/cgi/online.cgi?req=doc&ts=0KXiUtTzsp7SCTHL&cacheid=D9BF3194B4435E855641DBCD072B919C&mode=splus&rnd=2Wxenw&base=PKBO&n=47238#F8nkUtTZO5O8ABvB" target="_blank" rel="noopener noreferrer">
                                Как разделить ежегодный отпуск на части
                            </a>
                        </li>
                        <li>
                            <a href="https://cloud.consultant.ru/cloud/cgi/online.cgi?req=doc&ts=0KXiUtTzsp7SCTHL&cacheid=D9BF3194B4435E855641DBCD072B919C&mode=splus&rnd=2Wxenw&base=PKBO&n=44784#ZZykUtTxeYxI2CRA" target="_blank" rel="noopener noreferrer">
                                Как продлить ежегодный отпуск по больничному листу
                            </a>
                        </li>
                        <li>
                            <a href="https://cloud.consultant.ru/cloud/cgi/online.cgi?req=doc&ts=0KXiUtTzsp7SCTHL&cacheid=D9BF3194B4435E855641DBCD072B919C&mode=splus&rnd=2Wxenw&base=PKBO&n=53455#lahiUtTmAFIJArTC1" target="_blank" rel="noopener noreferrer">
                                Кому предоставляется отпуск по уходу за ребенком
                            </a>
                        </li>
                        <li>
                            <a href="https://cloud.consultant.ru/cloud/cgi/online.cgi?req=doc&ts=0KXiUtTzsp7SCTHL&cacheid=D9BF3194B4435E855641DBCD072B919C&mode=splus&rnd=2Wxenw&base=PKBO&n=53604#7A1jUtT674E2VimN1" target="_blank" rel="noopener noreferrer">
                                Как оформить отпуск по уходу за ребенком до 1,5 лет
                            </a>
                        </li>
                        <li>
                            <a href="https://cloud.consultant.ru/cloud/cgi/online.cgi?req=doc&ts=0KXiUtTzsp7SCTHL&cacheid=D9BF3194B4435E855641DBCD072B919C&mode=splus&rnd=2Wxenw&base=PKBO&n=52937#F9djUtTeU06He3JP" target="_blank" rel="noopener noreferrer">
                                Как оформить отпуск по уходу за ребенком до 3 лет при его усыновлении
                            </a>
                        </li>
                        <li>
                            <a href="https://cloud.consultant.ru/cloud/cgi/online.cgi?req=doc&ts=0KXiUtTzsp7SCTHL&cacheid=D9BF3194B4435E855641DBCD072B919C&mode=splus&rnd=2Wxenw&base=PKBO&n=51845#IVwjUtTdwWepdpcW" target="_blank" rel="noopener noreferrer">
                                Как оформить отпуск по уходу за ребенком от 1,5 до 3 лет
                            </a>
                        </li>
                        <li>
                            <a href="https://cloud.consultant.ru/cloud/cgi/online.cgi?req=doc&ts=0KXiUtTzsp7SCTHL&cacheid=D9BF3194B4435E855641DBCD072B919C&mode=splus&rnd=2Wxenw&base=PKBO&n=52918#pO5kUtTwJ0oSQsmD1" target="_blank" rel="noopener noreferrer">
                                Как оформить отпуск по уходу за ребенком до 1,5 лет при рождении двойни
                            </a>
                        </li>
                        <li>
                            <a href="https://cloud.consultant.ru/cloud/cgi/online.cgi?req=doc&ts=0KXiUtTzsp7SCTHL&cacheid=D9BF3194B4435E855641DBCD072B919C&mode=splus&rnd=2Wxenw&base=PKBO&n=51964#oJKkUtTE1wX2Wvpo" target="_blank" rel="noopener noreferrer">
                                Как оформить отпуск по уходу за ребенком до 3 лет при рождении двух детей (двойни)
                            </a>
                        </li>
                        <li>
                            <a href="https://cloud.consultant.ru/cloud/cgi/online.cgi?req=doc&ts=0KXiUtTzsp7SCTHL&cacheid=D9BF3194B4435E855641DBCD072B919C&mode=splus&rnd=2Wxenw&base=PKBO&n=45316#03piUtTC0fuldMI31" target="_blank" rel="noopener noreferrer">
                                Как оформить отпуск по уходу за больным членом семьи
                            </a>
                        </li>
                        <li>
                            <a href="https://cloud.consultant.ru/cloud/cgi/online.cgi?req=doc&ts=0KXiUtTzsp7SCTHL&cacheid=D9BF3194B4435E855641DBCD072B919C&mode=splus&rnd=2Wxenw&base=PKBO&n=45057#bdilUtTwHARG4HBu1" target="_blank" rel="noopener noreferrer">
                                Как предоставить ежегодный отпуск, на период которого выпадают праздничные дни
                            </a>
                        </li>
                        <li>
                            <a href="https://cloud.consultant.ru/cloud/cgi/online.cgi?req=doc&ts=0KXiUtTzsp7SCTHL&cacheid=D9BF3194B4435E855641DBCD072B919C&mode=splus&rnd=2Wxenw&base=PKBO&n=48020#m2FlUtTFCsanuVoA" target="_blank" rel="noopener noreferrer">
                                Как предоставить ежегодный отпуск работникам со срочным трудовым договором
                            </a>
                        </li>
                        <li>
                            <a href="https://cloud.consultant.ru/cloud/cgi/online.cgi?req=doc&ts=0KXiUtTzsp7SCTHL&cacheid=D9BF3194B4435E855641DBCD072B919C&mode=splus&rnd=2Wxenw&base=PKBO&n=47370#HMJlUtTyGdaWENt31" target="_blank" rel="noopener noreferrer">
                                Как предоставить ежегодный отпуск на работе по внешнему совместительству
                            </a>
                        </li>
                        <li>
                            <a href="https://cloud.consultant.ru/cloud/cgi/online.cgi?req=doc&ts=0KXiUtTzsp7SCTHL&cacheid=D9BF3194B4435E855641DBCD072B919C&mode=splus&rnd=2Wxenw&base=PKBO&n=44782#eARlUtT3XG7vT7Ac" target="_blank" rel="noopener noreferrer">
                                Как перенести ежегодный отпуск в связи с больничным работника
                            </a>
                        </li>
                        <li>
                            <a href="https://cloud.consultant.ru/cloud/cgi/online.cgi?req=doc&ts=0KXiUtTzsp7SCTHL&cacheid=AC323FCF50DDFB36ED49F7F4366C1C13&mode=splus&rnd=2Wxenw&base=PBI&n=289834&dst=1000000001#LL1mUtTsRf79iQKU1" target="_blank" rel="noopener noreferrer">
                                Предоставляется ли опекуну отпуск по уходу за ребенком до 3 лет
                            </a>
                        </li>
                        <li>
                            <a href="https://cloud.consultant.ru/cloud/cgi/online.cgi?req=doc&ts=0KXiUtTzsp7SCTHL&cacheid=D9BF3194B4435E855641DBCD072B919C&mode=splus&rnd=2Wxenw&base=PKBO&n=48272#YjIjUtTbcifA6BkZ" target="_blank" rel="noopener noreferrer">
                                Как предоставить отпуск без сохранения заработной платы по личным и семейным обстоятельствам
                            </a>
                        </li>
                        <li>
                            <a href="https://cloud.consultant.ru/cloud/cgi/online.cgi?req=doc&ts=0KXiUtTzsp7SCTHL&cacheid=D9BF3194B4435E855641DBCD072B919C&mode=splus&rnd=2Wxenw&base=PKBO&n=47999#hLdlUtTMPfhMSi9t" target="_blank" rel="noopener noreferrer">
                                Как предоставить дополнительный отпуск без сохранения заработной платы многодетным родителям
                            </a>
                        </li>
                        <li>
                            <a href="https://cloud.consultant.ru/cloud/cgi/online.cgi?req=doc&ts=0KXiUtTzsp7SCTHL&cacheid=D9BF3194B4435E855641DBCD072B919C&mode=splus&rnd=2Wxenw&base=PKBO&n=44245#KKrlUtTrDhAU8aw5" target="_blank" rel="noopener noreferrer">
                                Как предоставить работнику отпуск с последующим увольнением по соглашению сторон
                            </a>
                        </li>
                    </ul>
                </div>
            );
        }
    };

    return (
        
        <div className="reference-center">
            <div className="header0">
                <img src={logo} alt="Logo" />
                <h1 className="user-title">Справочный центр</h1>
                <button className="user-logout" onClick={handleNavigateToProfile}>В профиль</button>
            </div>
            {renderReferenceCenter()}
        </div>
    );
};

export default ReferenceCenter;
