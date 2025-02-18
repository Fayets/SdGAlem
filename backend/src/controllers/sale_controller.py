# from fastapi import HTTPException, APIRouter, Depends
# from pony.orm import db_session
# from src import schemas
# from src.services.sale_services import SaleServices
# from src.controllers.auth_controller import get_current_user
# from pydantic import BaseModel
# from typing import List

# router = APIRouter()
# service = SaleServices()


# class RegisterSaleMessage(BaseModel):
#     message: str
#     success: bool


# @router.post("/register", response_model=RegisterSaleMessage, status_code=201)
# def register_sale(sale_data: schemas.SaleCreate, current_user=Depends(get_current_user)):
#     try:
#         sale_created = service.create_sale(sale_data)
#         return {"message": "Venta registrada correctamente", "success": True}
#     except HTTPException as e:
#         return {"message": e.detail, "success": False}
#     except Exception as e:
#         return {"message": "Error inesperado al registrar la venta.", "success": False}


# @router.get("/get/{sale_id}", response_model=schemas.SaleResponse)
# def get_sale(sale_id: int, current_user=Depends(get_current_user)):
#     try:
#         return service.get_sale_by_id(sale_id)
#     except HTTPException as e:
#         raise e
#     except Exception as e:
#         raise HTTPException(status_code=500, detail="Error inesperado al obtener la venta.")


# @router.get("/all", response_model=List[schemas.SaleResponse])
# def get_all_sales(current_user=Depends(get_current_user)):
#     try:
#         return service.get_all_sales()
#     except HTTPException as e:
#         raise e
#     except Exception as e:
#         raise HTTPException(status_code=500, detail="Error inesperado al obtener las ventas.")


# class DeleteSaleMessage(BaseModel):
#     message: str
#     success: bool


# @router.delete("/{sale_id}", response_model=DeleteSaleMessage)
# def delete_sale(sale_id: int, current_user=Depends(get_current_user)):
#     try:
#         result = service.delete_sale(sale_id)
#         return {"message": result["message"], "success": True}
#     except HTTPException as e:
#         return {"message": e.detail, "success": False}
#     except Exception as e:
#         return {"message": "Error inesperado al eliminar la venta.", "success": False}


# # REPORTES
# @router.get("/total_sales")
# def total_sales(current_user=Depends(get_current_user)):
#     try:
#         return service.get_total_sales()
#     except Exception as e:
#         raise HTTPException(status_code=500, detail="Error inesperado al obtener el total de ventas.")


# @router.get("/total_revenue")
# def total_revenue(current_user=Depends(get_current_user)):
#     try:
#         return service.get_total_revenue()
#     except Exception as e:
#         raise HTTPException(status_code=500, detail="Error inesperado al obtener el total de ingresos.")
