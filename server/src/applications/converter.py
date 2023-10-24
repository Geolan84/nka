import fpdf
from pytrovich.enums import NamePart, Gender, Case
from pytrovich.maker import PetrovichDeclinationMaker
from pytrovich.detector import PetrovichGenderDetector

from datetime import datetime
from fpdf import FPDF


def __translate_to_dative(name, surname, patronymic):
    detector = PetrovichGenderDetector()
    gender = detector.detect(firstname=name, lastname=surname, middlename=patronymic)
    maker = PetrovichDeclinationMaker()
    return f"{maker.make(NamePart.FIRSTNAME, gender, Case.DATIVE, name)} {maker.make(NamePart.LASTNAME, gender, Case.DATIVE, surname)} {maker.make(NamePart.MIDDLENAME, gender, Case.DATIVE, patronymic)}"


def convert_app_to_pdf(app: dict):
    pdf = FPDF()
    pdf.add_page()
    pdf.add_font(
        "DejaVu",
        "",
        "/home/nemo/dev/nka/server/src/applications/font/DejaVuSansCondensedBook.ttf",
        uni=True,
    )
    pdf.set_font("DejaVu", size=12)
    date = datetime.today().strftime("%d.%m.%y")

    pdf.cell(
        180,  # ширина клетки
        10,  # высота,
        txt=f'Заявление на {app.get("title")}',
        ln=1,  # разрыв строки
        align="L",
    )

    pdf.cell(
        180,
        10,
        txt=f"Руководителю отдела Х ЗАО «Консультант Плюс» ФИО",
        ln=1,
        align="R",
    )
    receiver = __translate_to_dative(
        app.get("head_surname"),
        app.get("head_name"),
        app.get("head_patronymic"),
    )

    sender = __translate_to_dative(
        app.get("second_name"), app.get("first_name"), app.get("patronymic")
    )

    pdf.cell(180, 10, txt=receiver, ln=1, align="R")

    pdf.cell(180, 10, txt=f"      ", ln=1, align="R")

    pdf.cell(180, 10, txt=f"Заявление", ln=2, align="C")

    # pdf.multi_cell(
    #     180,  # ширина клетки
    #     10,  # высота,
    #     border=0,
    #     txt=f"Я, {}, проживающая по адресу {indx},г. {city}, ул. {street}, д. {house}, кв. {apart}, паспорт {p_serie} {p_num} выдан {when} {who}, прошу предоставить мне отпуск {prichina} с {start_date} по {end_date}.",
    #     # ln = 1, # разрыв строки
    #     align="L",
    #     fill=0,
    #     split_only=False,
    # )

    result = pdf.output(f"ЗаявлениеНаОтпуск.pdf")
    """
    print("ФИО:")
    fio = str(input())
    print("Почтовый индекс:")
    indx = str(input())
    print("Город:")
    city = str(input())
    print("Улица:")
    street = str(input())
    print("Дом:")
    house = str(input())
    print("Квартира:")
    apart = str(input())
    print("Серия паспорта:")
    p_serie = str(input())
    print("Номер паспорта:")
    p_num = str(input())
    print("Когда выдан:")
    when = str(input())
    print("Кем выдан:")
    who = str(input())
    print("Дата начала отпуска:")
    start_date = str(input())
    print("Дата конца отпуска:")
    end_date = str(input())
    

    if prichina != "ежегодный оплачиваемый":
        print("Прикрепленное приложение:")
        add = str(input())
        pdf.multi_cell(
            180,
            10,  # высота,
            border=0,
            txt=f"Приложение: {add}",
            align="L",
            fill=0,
            split_only=False,
        )

        pdf.cell(180, 10, txt=f"      ", ln=1, align="R")

        pdf.cell(180, 10, border=0, txt=f"{fio}", ln=1, align="L", fill=0)

        pdf.cell(180, 10, border=0, txt=f"{date}", ln=1, align="L", fill=0)
    else:
        pdf.cell(180, 10, txt=f"      ", ln=1, align="R")
        pdf.cell(180, 10, border=0, txt=f"{fio}", ln=1, align="L", fill=0)
        pdf.cell(180, 10, border=0, txt=f"{date}", ln=1, align="L", fill=0)

    
    """
