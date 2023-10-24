from decouple import config
from enum import IntEnum


class Role(IntEnum):
    EMPLOYEE = 1
    HEAD = 2
    ADMIN = 3


class ApplicationStatus(IntEnum):
    PROCESSING = 1
    ACCESSED = 2
    REJECTED = 3


vacation_names = {
    1: "Основной отпуск",
    2: "Дополнительный оплачиваемый отпуск",
    3: "Отпуск без сохранения з/п",
    4: "Отпуск по уходу за ребёнком",
    5: "Учебный отпуск",
    6: "Донорский день",
}

DB_USER = config("DB_USER")
DB_PASS = config("DB_PASS")
DB_NAME = config("DB_NAME")
DB_PORT = config("DB_PORT")
DB_HOST = config("DB_HOST")
SECRET = config("SECRET")
ALGORITHM = config("ALGORITHM")
ADMIN_PASS = config("ADMIN_PASS")
MAIL_KEY = config("MAIL_KEY")
EMAIL_SENDER = config("EMAIL_SENDER")
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
