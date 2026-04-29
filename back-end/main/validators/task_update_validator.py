from pydantic import BaseModel, Field


class TaskUpdateValidator(BaseModel):
    nom_tarefa: str = Field(..., min_length=1)
    des_tarefa: str = Field(..., min_length=1)
    idt_status: int = Field(..., gt=0)
