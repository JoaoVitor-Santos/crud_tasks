from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from main.models.models import TaskModel, HistoryModel, UserModel, StatusModel



def create_task(body, current_user, db: Session):
    try:
        task = TaskModel(
            nom_tarefa=body.nom_tarefa,
            des_tarefa=body.des_tarefa,
            idt_usuario=current_user.idt_usuario,
            ind_ativo=True
        )

        db.add(task)
        db.flush()

        history = HistoryModel(
            idt_status=1,
            idt_tarefa=task.idt_tarefa
        )

        db.add(history)

        db.commit()
        db.refresh(task)

        return {
            "message": "Tarefa criada com sucesso",
            "task": {
                "id": task.idt_tarefa,
                "nom_tarefa": task.nom_tarefa,
                "idt_status": 1
            }
        }

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Erro ao criar tarefa"
        )


def create_history(idt_tarefa: int, body, current_user, db: Session):
    try:
        task = db.query(TaskModel).filter(TaskModel.idt_tarefa == idt_tarefa).first()

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tarefa não encontrada"
            )

        if task.idt_usuario != current_user.idt_usuario:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Acesso negado: você não é o dono desta tarefa"
            )

        status_exists = db.query(StatusModel).filter(StatusModel.idt_status == body.idt_status).first()
        if not status_exists:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Status não encontrado"
            )

        history = HistoryModel(
            idt_status=body.idt_status,
            idt_tarefa=idt_tarefa
        )

        db.add(history)
        db.commit()
        db.refresh(history)

        return {
            "message": "Histórico criado com sucesso",
            "history": {
                "id": history.idt_historico,
                "idt_tarefa": history.idt_tarefa,
                "idt_status": history.idt_status
            }
        }

    except HTTPException:
        raise
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Erro ao criar histórico"
        )


def list_my_tasks(current_user, db: Session):
    try:
        subquery = db.query(
            HistoryModel.idt_tarefa,
            func.max(HistoryModel.idt_historico).label("last_history")
        ).group_by(HistoryModel.idt_tarefa).subquery()

        query = db.query(
            TaskModel.idt_tarefa,
            TaskModel.nom_tarefa,
            TaskModel.des_tarefa,
            TaskModel.ind_ativo,
            HistoryModel.idt_status,
            StatusModel.ind_status
        )\
        .outerjoin(subquery, subquery.c.idt_tarefa == TaskModel.idt_tarefa)\
        .outerjoin(HistoryModel, HistoryModel.idt_historico == subquery.c.last_history)\
        .outerjoin(StatusModel, StatusModel.idt_status == HistoryModel.idt_status)\
        .filter(
            TaskModel.idt_usuario == current_user.idt_usuario,
            TaskModel.ind_ativo == True
        )

        results = [
            {
                "idt_tarefa": t.idt_tarefa,
                "nom_tarefa": t.nom_tarefa,
                "des_tarefa": t.des_tarefa,
                "ind_ativo": t.ind_ativo,
                "idt_status": t.idt_status,
                "ind_status": t.ind_status
            }
            for t in query.all()
        ]

        return results

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Erro ao listar tarefas"
        )

def update_task(idt_tarefa: int, body, current_user, db: Session):
    try:
        task = db.query(TaskModel).filter(TaskModel.idt_tarefa == idt_tarefa).first()

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tarefa não encontrada"
            )

        if task.idt_usuario != current_user.idt_usuario:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Acesso negado: você não é o dono desta tarefa"
            )

        status_exists = db.query(StatusModel).filter(StatusModel.idt_status == body.idt_status).first()
        if not status_exists:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Status não encontrado"
            )

        task.nom_tarefa = body.nom_tarefa
        task.des_tarefa = body.des_tarefa

        history = HistoryModel(
            idt_status=body.idt_status,
            idt_tarefa=idt_tarefa
        )

        db.add(history)
        db.commit()
        db.refresh(task)

        return {
            "message": "Tarefa atualizada com sucesso",
            "task": {
                "idt_tarefa": task.idt_tarefa,
                "nom_tarefa": task.nom_tarefa,
                "des_tarefa": task.des_tarefa,
                "ind_ativo": task.ind_ativo,
                "idt_status": body.idt_status,
                "ind_status": status_exists.ind_status
            }
        }

    except HTTPException:
        raise
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Erro ao atualizar tarefa"
        )

def delete_task(idt_tarefa: int, current_user, db: Session):
	try:
		task = db.query(TaskModel).filter(TaskModel.idt_tarefa == idt_tarefa).first()

		if not task:
			raise HTTPException(
				status_code=status.HTTP_404_NOT_FOUND,
				detail="Tarefa não encontrada"
			)

		if task.idt_usuario != current_user.idt_usuario:
			raise HTTPException(
				status_code=status.HTTP_403_FORBIDDEN,
				detail="Acesso negado: você não é o dono desta tarefa"
			)

		task.ind_ativo = False
		db.commit()
		db.refresh(task)

		return {
			"message": "Tarefa deletada com sucesso",
			"task": {
				"id": task.idt_tarefa,
				"nom_tarefa": task.nom_tarefa,
				"idt_status": "False"
			}
		}

	except HTTPException:
		raise
	except Exception:
		db.rollback()
		raise HTTPException(
			status_code=status.HTTP_400_BAD_REQUEST,
			detail="Erro ao deletar tarefa"
		)