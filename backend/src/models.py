import uuid
from pony.orm import *
from enum import Enum
from .db import db
from datetime import datetime

class Roles(str, Enum): 
    ADMIN = "ADMIN"
    STUDENT = "STUDENT"
    TEACHER = "TEACHER"

class User(db.Entity):
    id = PrimaryKey(uuid.UUID, auto=True)
    username = Required(str)
    email = Required(str)
    password = Required(str)
    firstName = Required(str, column="firstName")
    lastName = Required(str,column="lastName")
    role = Required(str)
    _table_ = "Users"

class Category(db.Entity):
    id = PrimaryKey(int, auto=True)
    name = Required(str)
    products = Set("Product")
    _table_ = "Categories"

class Product(db.Entity):
    id = PrimaryKey(int, auto=True)
    codigo = Required(str, unique=True)
    nombre = Required(str)
    categoria = Optional(Category)
    precio_costo = Required(float)
    precio_venta = Required(float)
    stock = Required(int, default=0)  
    stock_minimo = Required(int, default=0)   # Campo para definir el límite mínimo de stock
    detalles_venta = Set("DetalleVenta")  # Relación inversa con DetalleVenta
    _table_ = "Products"

class Venta(db.Entity):
    id = PrimaryKey(int, auto=True)
    cliente = Required("Cliente")
    fecha = Required(datetime, default=lambda: datetime.now())
    metodo_pago = Required(str)  # 'efectivo', 'tarjeta', 'credito'
    total = Required(float)
    detalles = Set("DetalleVenta")
    credito = Optional("Credito")  # Relación opcional con Crédito
    _table_ = "Ventas"

class DetalleVenta(db.Entity):
    id = PrimaryKey(int, auto=True)
    venta = Required(Venta)
    producto = Required(Product)
    cantidad = Required(int)
    subtotal = Required(float)
    _table_ = "DetallesVenta"

class Credito(db.Entity):
    id = PrimaryKey(int, auto=True)
    cliente = Required("Cliente")
    venta = Required(Venta)
    saldo_pendiente = Required(float)
    fecha_registro = Required(datetime, default=lambda: datetime.now())
    _table_ = "Creditos"

class Cliente(db.Entity):
    id = PrimaryKey(int, auto=True)
    nombre = Required(str)
    documento = Required(str, unique=True)
    ventas = Set(Venta)
    creditos = Set(Credito)
    _table_ = "Clientes"
