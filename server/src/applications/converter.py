import os
from pytrovich.enums import NamePart, Case
from pytrovich.maker import PetrovichDeclinationMaker
from pytrovich.detector import PetrovichGenderDetector

from datetime import datetime
from fpdf import FPDF


def __translate_to_genetive(name, surname, patronymic):
    # print(name, surname, patronymic)
    detector = PetrovichGenderDetector()
    gender = detector.detect(firstname=name, lastname=surname, middlename=patronymic)
    maker = PetrovichDeclinationMaker()
    return f"{maker.make(NamePart.LASTNAME, gender, Case.GENITIVE, surname)} {maker.make(NamePart.FIRSTNAME, gender, Case.GENITIVE, name)} {maker.make(NamePart.MIDDLENAME, gender, Case.GENITIVE, patronymic)}"


def __translate_to_dative(name, surname, patronymic):
    # print(name, surname, patronymic)
    detector = PetrovichGenderDetector()
    gender = detector.detect(firstname=name, lastname=surname, middlename=patronymic)
    maker = PetrovichDeclinationMaker()
    return f"{maker.make(NamePart.LASTNAME, gender, Case.DATIVE, surname)} {maker.make(NamePart.FIRSTNAME, gender, Case.DATIVE, name)} {maker.make(NamePart.MIDDLENAME, gender, Case.DATIVE, patronymic)}"


def convert_app_to_pdf(sault: str, app: dict):
    pdf = FPDF()
    pdf.add_page()
    pdf.add_font(
        "DejaVu",
        "",
        "applications/font/DejaVuSansCondensedBook.ttf",
        uni=True,
    )
    pdf.set_font("DejaVu", size=12)
    # Requesites.

    receiver = __translate_to_dative(
        app.get("head_name"),
        app.get("head_surname"),
        app.get("head_patronymic"),
    )
    sender = __translate_to_genetive(
        app.get("first_name"),
        app.get("second_name"),
        app.get("patronymic"),
    )
    pdf.cell(180, 7, txt=f"Генеральному директору", ln=1, align="R")
    pdf.cell(180, 7, txt=receiver, ln=1, align="R")
    pdf.cell(180, 7, txt=f"от {sender}", ln=1, align="R")
    pdf.cell(180, 50, txt=f"", ln=2, align="C")
    pdf.cell(180, 10, txt=f"ЗАЯВЛЕНИЕ", ln=2, align="C")

    last_digit_day = app.get("duration") % 10
    if last_digit_day == 1:
        day_form = "день"
    elif 1 < last_digit_day < 5:
        day_form = "дня"
    else:
        day_form = "дней"

    pdf.multi_cell(
        0,
        10,
        border=0,
        txt=f"        Прошу предоставить мне {app.get('title').lower()} на {app.get('duration')} календарных {day_form} с {app.get('start_date').strftime('%d.%m.%Y')} по {app.get('end_date').strftime('%d.%m.%Y')}.",
        align="L",
        fill=0,
        split_only=False,
    )

    date = datetime.today().strftime("%d.%m.%y")
    pdf.cell(
        190,
        40,
        txt=f"{date}                                                                         ____________",
        ln=1,
        align="C",
    )
    pdf.output(f"vacations/Vacation{sault}.pdf")
