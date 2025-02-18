from fastapi import HTTPException, APIRouter, status, Depends
from pony.orm import db_session
from src import schemas
from jose import jwt, JWTError
from src.services.user_services import UsersService
from pydantic import BaseModel
from decouple import config
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta
from uuid import UUID

# Auth controller

router = APIRouter()
service = UsersService()

SECRET_KEY = config("SECRET")
ACCESS_TOKEN_DURATION = 60  # Aumentado a 60 minutos
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


class RegisterMessage(BaseModel):
    message: str
    success: bool


async def get_current_user(token: str = Depends(oauth2_scheme)):
    """ Verifica el token y obtiene el usuario actual """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("id")

        if not user_id:
            raise HTTPException(status_code=401, detail="Token inválido (ID no encontrado)")

        try:
            user_id = UUID(user_id)  # Asegurar que el ID es UUID válido
        except ValueError:
            raise HTTPException(status_code=401, detail="Token inválido (ID malformado)")

        user = service.search_user_by_id(user_id)

        if not user:
            raise HTTPException(status_code=401, detail="Usuario no encontrado")

        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")


@router.post("/verify-token")
async def verify_token(token: str):
    """ Verifica la validez del token y devuelve la info del usuario """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("id")

        if not user_id:
            raise HTTPException(status_code=401, detail="Token inválido")

        user = service.search_user_by_id(user_id)

        if not user:
            raise HTTPException(status_code=401, detail="Usuario no encontrado")

        return {
            "message": "Token válido",
            "user": {
                "username": user.username,
                "email": user.email
            }
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")


@router.post("/register", response_model=RegisterMessage, status_code=201)
async def register(user: schemas.UserCreate):
    """ Registra un nuevo usuario """
    try:
        service.create_user(user)
        return {"message": "Usuario creado correctamente", "success": True}
    except HTTPException as e:
        return {"message": e.detail, "success": False}
    except Exception:
        return {"message": "Error inesperado al crear el usuario.", "success": False}


@router.post("/login")
async def login(request: schemas.LoginRequest):
    """ Autenticación del usuario y generación de token """
    username = request.username
    email = request.email
    password = request.password

    if not username and not email:
        raise HTTPException(status_code=400, detail="Se requiere un nombre de usuario o un email")

    # Buscar el usuario con el servicio
    user = service.search_user(username=username, email=email, password=password)

    access_token = {
        "id": str(user.id),
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_DURATION)
    }

    return {
        "message": "Usuario autenticado correctamente",
        "success": True,
        "access_token": jwt.encode(access_token, key=SECRET_KEY, algorithm="HS256"),
        "token_type": "bearer"
    }



#{
#  "username": "chuly",
#  "email": "chuly@test.com",
#  "firstName": "Carlos",
#  "lastName": "Alem",
#  "role": "ADMIN",
#  "password": "1234"
#}