from decouple import config
from enum import IntEnum

class Role(IntEnum):
    EMPLOYEE = 1
    HEAD = 2
    ADMIN = 3

DB_USER = config("DB_USER")
DB_PASS = config("DB_PASS")
DB_NAME = config("DB_NAME")
DB_PORT = config("DB_PORT")
DB_HOST = config("DB_HOST")
SECRET = config("SECRET")
ALGORITHM = config("ALGORITHM")
ADMIN_PASS = config("ADMIN_PASS")
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"



