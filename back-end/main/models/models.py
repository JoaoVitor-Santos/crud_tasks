from sqlalchemy import Column, String, Integer, Boolean
from ..connection import Base

class UserModel(Base):
    __tablename__ = "t_usuario"

    idt_usuario = Column(Integer, primary_key=True, index=True)
    des_email = Column(String(255), unique=True, index=True, nullable=False)
    des_senha = Column(String(255), nullable=False)

class TaskModel(Base):
    __tablename__ = "t_tarefa"

    idt_tarefa = Column(Integer, primary_key=True, index=True)
    nom_tarefa = Column(String(255), nullable=False)
    des_tarefa = Column(String(255), nullable=False)
    ind_ativo = Column(Boolean, default=True, nullable=False)
    idt_usuario = Column(Integer, nullable=False)

class StatusModel(Base):
        __tablename__ = "t_status"

        idt_status = Column(Integer, primary_key=True, index=True)
        ind_status = Column(String(255), nullable=False)

class HistoryModel(Base):
    __tablename__ = "t_historico"

    idt_historico = Column(Integer, primary_key=True, index=True)
    idt_status = Column(Integer, nullable=False)
    idt_tarefa = Column(Integer, nullable=False)
