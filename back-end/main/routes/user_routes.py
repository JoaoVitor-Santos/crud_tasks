from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer

from main.validators.user_register_validator import UserRegisterValidator
from main.connection import get_db

from ..services import user_service

users_routes = APIRouter(prefix="/users", tags=["users"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")


@users_routes.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(
    body: UserRegisterValidator,
    db: Session = Depends(get_db)
):
    return user_service.create_user(body, db)


@users_routes.post("/login", status_code=status.HTTP_200_OK)
def login_user(
    body: UserRegisterValidator,
    db: Session = Depends(get_db)
):
    return user_service.login_user(body, db)


@users_routes.post("/refresh", status_code=status.HTTP_200_OK)
def refresh_token_route(
    token: str = Depends(oauth2_scheme)
):
    return user_service.refresh_token(token)


@users_routes.post("/logout", status_code=status.HTTP_200_OK)
def logout_user(
    token: str = Depends(oauth2_scheme)
):
    return user_service.logout_user(token)