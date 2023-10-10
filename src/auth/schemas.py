from typing import Optional
from pydantic import BaseModel

class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    license: str
    email: str
    password: str
    first_name: str
    second_name: str
    patronymic: Optional[str] = None
    qual_id: Optional[int] = None
    prof_id: Optional[int] = None

