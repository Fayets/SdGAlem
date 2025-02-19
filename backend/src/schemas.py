from pydantic import BaseModel
from typing import List
<<<<<<< HEAD
from datetime import datetime
from src.models import Roles

#USUARIOS
=======
from src.models import Roles




>>>>>>> 405771247fff7b4b255287220e9baf1ee23150f6
class BaseUser(BaseModel):
    username: str
    email: str
    firstName: str
    lastName: str
    role: Roles

    class Config:
<<<<<<< HEAD
=======
        # antes orm_mode=True
>>>>>>> 405771247fff7b4b255287220e9baf1ee23150f6
        from_attributes = True
        use_enum_values = True


class UserCreate(BaseUser):
    password: str

<<<<<<< HEAD
#LOGIN
=======
# Modelo de entrada

>>>>>>> 405771247fff7b4b255287220e9baf1ee23150f6
class LoginRequest(BaseModel):
    username: str | None = None
    email: str | None = None
    password: str

class TokenVerificationRequest(BaseModel):
    token: str

<<<<<<< HEAD
#PRODUCTOS  
=======
>>>>>>> 405771247fff7b4b255287220e9baf1ee23150f6
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

<<<<<<< HEAD
#CATEGORIAS
=======
>>>>>>> 405771247fff7b4b255287220e9baf1ee23150f6
class CategoryCreate(BaseModel):
    name: str

class CategoryResponse(BaseModel):
   name: str
   id:int
<<<<<<< HEAD

class StockAdjustMessage(BaseModel):
    message: str
    stock_actual: int

# NUEVO

# class ProductoVenta(BaseModel):
#     producto_id: int
#     cantidad: int

# class VentaRequest(BaseModel):
#     cliente_id: int
#     productos: List[ProductoVenta]
#     metodo_pago: str  # 'efectivo', 'tarjeta', 'credito'

# class SaleProduct(BaseModel):
#     producto_id: int
#     cantidad: int

# class SaleCreate(BaseModel):
#     cliente_id: int
#     productos: List[SaleProduct]
#     metodo_pago: str  # Puede ser 'efectivo', 'tarjeta' o 'credito'

# # Esquema de respuesta para la venta
# class SaleResponse(BaseModel):
#     id: int
#     cliente_id: int
#     metodo_pago: str
#     total: float
#     fecha: datetime
#     productos: List[SaleProduct]

=======
>>>>>>> 405771247fff7b4b255287220e9baf1ee23150f6
