from pydantic import BaseModel
from typing import List
from src.models import Roles




class BaseUser(BaseModel):
    username: str
    email: str
    firstName: str
    lastName: str
    role: Roles

    class Config:
        # antes orm_mode=True
        from_attributes = True
        use_enum_values = True


class UserCreate(BaseUser):
    password: str

# Modelo de entrada

class LoginRequest(BaseModel):
    username: str | None = None
    email: str | None = None
    password: str

class TokenVerificationRequest(BaseModel):
    token: str

class ProductCreate(BaseModel):
    codigo: str
    nombre: str
    categoria_id: int  # ID de la categoría
    precio_costo: float
    precio_venta: float
    stock: int
    stock_minimo: int    

class CategoryBase(BaseModel):
    id: int
    name: str

class ProductResponse(BaseModel):
    id: int
    codigo: str
    nombre: str
    categoria: CategoryBase | None  # Permite que la categoría sea opcional y sea un objeto completo
    precio_costo: float
    precio_venta: float
    stock: int
    stock_minimo: int

    class Config:
        from_attributes = True

class CategoryCreate(BaseModel):
    name: str

class CategoryResponse(BaseModel):
   name: str
   id:int
