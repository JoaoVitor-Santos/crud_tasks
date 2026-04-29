from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from ..services.status_service import list_status
from main.connection import get_db

status_routes = APIRouter(prefix="/status", tags=["status"])

@status_routes.get("/list")
def list_status_endpoint(db: Session = Depends(get_db)):
    return list_status(db)