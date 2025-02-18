from pony.orm import db_session, desc, select
from fastapi import HTTPException
from typing import Optional
from uuid import UUID
import bcrypt
from pony.orm.core import TransactionIntegrityError
from src import models, schemas


class UsersService:
    def __init__(self):
        pass

    def create_user(self, user: schemas.UserCreate):
        """ Crea un usuario nuevo en la base de datos """
        with db_session:
            try:
                hashed_password = self.hash_password(user.password)

                usuario = models.User(
                    username=user.username,
                    email=user.email,
                    password=hashed_password,
                    firstName=user.firstName,
                    lastName=user.lastName,
                    role=user.role,
                )
                return usuario
            except TransactionIntegrityError:
                raise HTTPException(status_code=400, detail="El usuario o email ya existen")
            except Exception:
                raise HTTPException(status_code=500, detail="Error al crear el usuario")

    def search_user_by_id(self, user_id: UUID):
        """ Busca un usuario por su ID """
        with db_session:
            return models.User.get(id=user_id)

    def search_user(self, username: Optional[str], email: Optional[str], password: str):
        """ Busca un usuario por nombre o email y valida su contraseña """
        with db_session:
            user = None
            if username:
                user = models.User.get(username=username)
            elif email:
                user = models.User.get(email=email)

            if not user:
                raise HTTPException(status_code=404, detail="Usuario no encontrado")

            if not self.check_password(user.password, password):
                raise HTTPException(status_code=401, detail="Contraseña incorrecta")

            return user

    @staticmethod
    def hash_password(password: str) -> str:
        """ Hashea una contraseña con bcrypt """
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')

    @staticmethod
    def check_password(stored_password: str, provided_password: str) -> bool:
        """ Verifica si la contraseña ingresada coincide con la almacenada """
        return bcrypt.checkpw(provided_password.encode('utf-8'), stored_password.encode('utf-8'))
