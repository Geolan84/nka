from typing import Optional
from datetime import date
from pydantic import BaseModel, model_validator

class ApplicationBody(BaseModel):
    type: int
    note: Optional[str] = None
    start_date: date
    end_date: date

    @model_validator(mode='before')
    def dates_chronology(cls, values):
        if values.get('start_date') > values.get('end_date'):
            raise ValueError('end_date should be greater or equal than start_date!')
        return values
