# from pony.orm import db_session, commit
# from fastapi import HTTPException, Query
# from datetime import datetime
# from src.models import Venta, Product, Cliente, DetalleVenta, Credito
# from src import models, schemas
# from src.schemas import SaleCreate

# class SaleServices:
#     def __init__(self):
#         pass 

#     def obtener_cliente(cliente_id: int):
#         return Cliente.get(id=cliente_id)

#     def obtener_producto(producto_id: int):
#         return Product.get(id=producto_id)

#     def create_sale(self, sale_data: schemas.SaleCreate) -> dict:
#         with db_session:
#             try:
#                 # Obtener cliente
#                 cliente = models.Cliente.get(id=sale_data.cliente_id)
#                 if not cliente:
#                     raise HTTPException(status_code=404, detail="Cliente no encontrado")
                    
#                 # Crear la venta
#                 venta = models.Venta(cliente=cliente, fecha=datetime.now(), metodo_pago=sale_data.metodo_pago, total=0)
#                 total_venta = 0
                    
#                 for item in sale_data.productos:
#                     producto = models.Product.get(id=item.producto_id)
#                     if not producto:
#                         raise HTTPException(status_code=404, detail=f"Producto con ID {item.producto_id} no encontrado")
                        
#                     if producto.stock < item.cantidad:
#                         raise HTTPException(status_code=400, detail=f"Stock insuficiente para {producto.nombre}")
                        
#                     # Calcular subtotal y registrar detalle de venta
#                     subtotal = producto.precio_venta * item.cantidad
#                     models.DetalleVenta(venta=venta, producto=producto, cantidad=item.cantidad, subtotal=subtotal)
                        
#                     # Descontar stock
#                     producto.stock -= item.cantidad
                        
#                     total_venta += subtotal
                    
#                 # Actualizar total de la venta
#                 venta.total = total_venta
                    
#                 # Si la venta es a crédito, crear el registro de deuda
#                 if sale_data.metodo_pago == "credito":
#                     models.Credito(cliente=cliente, venta=venta, saldo_pendiente=total_venta, fecha_registro=datetime.now())
                    
#                 commit()
#                 return {"success": "Venta registrada correctamente", "venta_id": venta.id}
                
#             except Exception as e:
#                 print(f"Error al registrar la venta: {e}")
#                 raise HTTPException(status_code=500, detail="Error inesperado al registrar la venta.")

#         return {"success": "Venta registrada correctamente", "venta_id": venta.id}
