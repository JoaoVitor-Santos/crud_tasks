from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from main.routes.user_routes import users_routes
from main.routes.task_routes import tasks_routes
from main.routes.status_routes import status_routes
from main.connection import Base, engine, SessionLocal
from main.models.models import StatusModel

STATUS_SEED = [
    {"idt_status": 1, "ind_status": "pendente"},
    {"idt_status": 2, "ind_status": "fazendo"},
    {"idt_status": 3, "ind_status": "pausado"},
    {"idt_status": 4, "ind_status": "concluido"},
]


def seed_status(db):
    for item in STATUS_SEED:
        exists = db.query(StatusModel).filter(StatusModel.idt_status == item["idt_status"]).first()
        if not exists:
            db.add(StatusModel(**item))
    db.commit()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Tables are now managed by Alembic migrations
    # Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_status(db)
    finally:
        db.close()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_credentials=True,
    allow_headers=["*"],
)

app.include_router(users_routes)
app.include_router(tasks_routes)
app.include_router(status_routes)