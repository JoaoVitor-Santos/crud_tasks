from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from main.validators.task_create_validator import TaskCreateValidator
from main.validators.task_update_validator import TaskUpdateValidator
from main.validators.task_history_validator import TaskHistoryValidator
from main.validators.auth_user import get_current_user
from main.models.models import UserModel
from main.connection import get_db

from ..services import task_service


tasks_routes = APIRouter(prefix="/tasks", tags=["tasks"])


@tasks_routes.post("/create", status_code=status.HTTP_201_CREATED)
def create_task(
	body: TaskCreateValidator,
	db: Session = Depends(get_db),
	current_user: UserModel = Depends(get_current_user)
):
	return task_service.create_task(body, current_user, db)


@tasks_routes.post("/{idt_tarefa}/history", status_code=status.HTTP_201_CREATED)
def create_history(
    idt_tarefa: int,
    body: TaskHistoryValidator,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    return task_service.create_history(idt_tarefa, body, current_user, db)


@tasks_routes.put("/{idt_tarefa}", status_code=status.HTTP_200_OK)
def update_task(
    idt_tarefa: int,
    body: TaskUpdateValidator,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    return task_service.update_task(idt_tarefa, body, current_user, db)


@tasks_routes.get("/my-tasks")
def list_my_tasks(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    return task_service.list_my_tasks(current_user, db)


@tasks_routes.delete("/{idt_tarefa}", status_code=status.HTTP_200_OK)
def delete_task(
	idt_tarefa: int,
	db: Session = Depends(get_db),
	current_user: UserModel = Depends(get_current_user)
):
	return task_service.delete_task(idt_tarefa, current_user, db)