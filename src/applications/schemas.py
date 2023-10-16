from typing import Optional
from datetime import date
from pydantic import BaseModel

class ApplicationBody(BaseModel):
    type: int
    note: Optional[str] = None
    start_date: date
    end_date: date
