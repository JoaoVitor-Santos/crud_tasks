from jose import jwt, JWTError
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from main.models.models import StatusModel

def list_status(db: Session):
    try:
        status_list = db.query(StatusModel).all()
        return {
            "message": "Status list retrieved successfully",
            "status": [
                {
                    "idt_status": status.idt_status,
                    "ind_status": status.ind_status
                } for status in status_list
            ]
        }
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Erro ao listar os status"
        )