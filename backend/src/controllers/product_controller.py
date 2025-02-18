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
        return {"message": e.detail, "success": False}
    except Exception as e:
        return {"message": "Error inesperado al actualizar el producto.", "success": False}


@router.get("/get/{codigo}", response_model=schemas.ProductResponse)
def get_product(codigo: str, current_user=Depends(get_current_user)):
    try:
        product_data = service.get_product_by_code(codigo)
        return product_data
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=500, detail="Error inesperado al obtener el producto."
        )


@router.get("/all", response_model=List[schemas.ProductResponse])
def get_all_products(current_user=Depends(get_current_user)):
    try:
        all_products = service.get_all_products()
        return all_products
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=500, detail="Error inesperado al obtener los productos."
        )


@router.delete("/{codigo}", status_code=200)
def delete_product(codigo: str, current_user=Depends(get_current_user)):
    try:
        result = service.delete_product(codigo)
        return {"message": result["message"], "success": True}
    except HTTPException as e:
        return {"message": e.detail, "success": False}
    except Exception as e:
        return {
            "message": "Error inesperado al eliminar el producto.",
            "success": False,
        }


class StockAdjustMessage(BaseModel):
    message: str
    stock_actual: int


@router.put("/adjust_stock/{codigo}", response_model=StockAdjustMessage)
def adjust_product_stock(codigo: str, cantidad: int, current_user=Depends(get_current_user)):
    try:
        result = service.adjust_stock(codigo, cantidad)
        return result
    except HTTPException as e:
        return {"message": e.detail, "stock_actual": 0}
    except Exception as e:
        return {
            "message": "Error inesperado al ajustar el stock.",
            "stock_actual": 0,
        }


@router.get("/low_stock", response_model=List[schemas.ProductResponse])
def get_low_stock_products(current_user=Depends(get_current_user)):
    try:
        return service.get_low_stock_products()
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=500, detail="Error inesperado al obtener productos con stock bajo."
        )


# NUEVOS ENDPOINTS PARA REPORTES


@router.get("/total_products")
def total_products(current_user=Depends(get_current_user)):
    """Devuelve el total de productos en el inventario."""
    try:
        return service.get_total_products()
    except Exception as e:
        raise HTTPException(
            status_code=500, detail="Error inesperado al obtener el total de productos."
        )


@router.get("/inventory_value")
def inventory_value(current_user=Depends(get_current_user)):
    """Devuelve el valor total del inventario."""
    try:
        return service.get_inventory_value()
    except Exception as e:
        raise HTTPException(
            status_code=500, detail="Error inesperado al obtener el valor del inventario."
        )


@router.get("/low_stock_count")
def low_stock_count(current_user=Depends(get_current_user)):
    """Devuelve la cantidad de productos con stock bajo."""
    try:
        return service.get_low_stock_count()
    except Exception as e:
        raise HTTPException(
            status_code=500, detail="Error inesperado al obtener la cantidad de productos con stock bajo."
        )
