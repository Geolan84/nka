from typing import Optional
from pydantic import BaseModel

class NewUser(BaseModel):
    email: str
    first_name: str
    second_name: str
    patronymic: Optional[str] = None
    department_id: Optional[int] = None
    is_head: bool

class PatchUser(BaseModel):
    email: str
    first_name: Optional[str] = None
    second_name: Optional[str] = None
    patronymic: Optional[str] = None
    is_head: Optional[bool] = None
