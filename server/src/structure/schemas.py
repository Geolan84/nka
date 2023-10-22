from typing import Optional
from pydantic import BaseModel

class NewUser(BaseModel):
    email: str
    first_name: str
    second_name: str
    patronymic: Optional[str] = None
    department_id: Optional[int] = None
    is_head: bool

class AdminPatchUser(BaseModel):
    user_id: int
    email: Optional[str] = None
    first_name: Optional[str] = None
    second_name: Optional[str] = None
    patronymic: Optional[str] = None
    is_head: Optional[bool] = None

class PatchUser(BaseModel):
    user_id: int
    email: Optional[str] = None
    password: Optional[str] = None
    first_name: Optional[str] = None
    second_name: Optional[str] = None
    patronymic: Optional[str] = None
