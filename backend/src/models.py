import uuid
from pony.orm import *
from enum import Enum
from .db import db

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
    stock_minimo = Required(int, default=0)   #campo para definir el límite mínimo de stock
    _table_ = "Products"


 