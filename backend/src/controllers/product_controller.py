from fastapi import HTTPException, APIRouter, Depends
from pony.orm import *
from src import schemas
from src.services.product_services import ProductServices
from src.controllers.auth_controller import get_current_user
from pydantic import BaseModel
from typing import List

# Product controller

router = APIRouter()
service = ProductServices()  # Servicio que contiene la lógica de negocio

class RegisterMessage(BaseModel):
    message: str
    success: bool


@router.post("/register", response_model=RegisterMessage, status_code=201)
def register_product(product: schemas.ProductCreate, current_user=Depends(get_current_user)):
    try:
        # Asegúrate de que el nombre del método coincide aquí
        product_created = service.create_producto(product)
        return {
            "message": "Producto creado correctamente",
            "success": True,
        }
    except HTTPException as e:
        return {
            "message": e.detail,
            "success": False,
        }
    except Exception as e:
        return {
            "message": "Error inesperado al crear el producto.",
            "success": False,
        }


class UpdateMessage(BaseModel):
    message: str
    success: bool


@router.put("/update/{codigo}", response_model=UpdateMessage)
def update_product(codigo: str, product_update: schemas.ProductCreate, current_user=Depends(get_current_user)):
    try:
        update_result = service.update_product(codigo, product_update)
        return {"message": update_result["message"], "success": True}
    except HTTPException as e:
        print(f"HTTPException: {e.detail}")
        return {"message": e.detail, "success": False}
    except Exception as e:
        print(f"Error inesperado al actualizar el producto: {e}")
        return {"message": "Error inesperado al actualizar el producto.", "success": False}


@router.get("/get/{codigo}", response_model=schemas.ProductResponse)
def get_product(codigo: str, current_user=Depends(get_current_user)):
    try:
        product_data = service.get_product_by_code(codigo)
        return product_data
    except HTTPException as e:
        print(f"HTTPException: {e.detail}")
        raise e
    except Exception as e:
        print(f"Error inesperado al obtener el producto: {e}")
        raise HTTPException(
            status_code=500, detail="Error inesperado al obtener el producto.")

@router.get("/all", response_model=List[schemas.ProductResponse])
def get_all_products(current_user=Depends(get_current_user)):
    try:
        all_products = service.get_all_products()
        return all_products
    except HTTPException as e:
        print(f"HTTPException: {e.detail}")
        raise e
    except Exception as e:
        print(f"Error inesperado al obtener los productos: {e}")
        raise HTTPException(status_code=500, detail="Error inesperado al obtener los productos.")


@router.delete("/{codigo}", status_code=200)
def delete_product(codigo: str, current_user=Depends(get_current_user)):
    try:
        result = service.delete_product(codigo)
        return {"message": result["message"], "success": True}
    except HTTPException as e:
        return {"message": e.detail, "success": False}
    except Exception as e:
        print(f"Error inesperado al eliminar el producto: {e}")
        return {"message": "Error inesperado al eliminar el producto.", "success": False}

