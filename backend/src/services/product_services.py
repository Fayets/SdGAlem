<<<<<<< HEAD
from pony.orm import db_session, desc, select, sum
=======
from pony.orm import db_session, desc, select
>>>>>>> 405771247fff7b4b255287220e9baf1ee23150f6
from fastapi import HTTPException, Query
from typing import Optional
from pony.orm.core import TransactionIntegrityError
from src import models, schemas
from src.schemas import ProductCreate
<<<<<<< HEAD
import traceback
=======


class ProductServices:
    def __init__(self):
        pass 

    from pony.orm import db_session, select
from fastapi import HTTPException
from src import models, schemas
from pony.orm.core import TransactionIntegrityError
>>>>>>> 405771247fff7b4b255287220e9baf1ee23150f6


class ProductServices:
    def __init__(self):
        pass 

    def create_producto(self, codigo_data: schemas.ProductCreate) -> dict:
        with db_session:
            try:
                # Verificar si el código ya existe
                existing_product = models.Product.get(codigo=codigo_data.codigo)
                if existing_product:
                    raise HTTPException(
                        status_code=400,
                        detail=f"El código {codigo_data.codigo} ya está en uso, no se puede crear el producto."
                    )

                # Crear el producto si el código es único
                producto = models.Product(
                    codigo=codigo_data.codigo,
                    nombre=codigo_data.nombre,
                    categoria=codigo_data.categoria_id,
                    precio_costo=codigo_data.precio_costo,
                    precio_venta=codigo_data.precio_venta,
                    stock=codigo_data.stock,
                    stock_minimo=codigo_data.stock_minimo
                )
                print("Producto creado correctamente.")
                product_dict = producto.to_dict(exclude=['id'])
                return product_dict
            except TransactionIntegrityError as e:
                print(f"Error de integridad transaccional: {e}")
                raise HTTPException(
                    status_code=400, detail="Error de integridad al crear el producto.")
            except Exception as e:
                print(f"Error al crear el producto: {e}")
                raise HTTPException(
                    status_code=500, detail="Error al crear el producto.")


    def get_product_by_code(self, codigo: str):
        with db_session:
            try:
                product = models.Product.get(codigo=codigo)
                if not product:
                    print("Producto no encontrado")
                    raise HTTPException(status_code=404, detail="Producto no encontrado")
                
                product_dict = product.to_dict()
                print("Producto encontrado:", product_dict)  # Verifica que hay datos
                return product_dict
            except Exception as e:
                print(f"Error al obtener el producto: {e}")
                raise HTTPException(status_code=500, detail="Error al obtener el producto")
    
    def get_all_products(self):
        with db_session:
            try:
                # Obtener todos los productos
                products = list(models.Product.select())
                
                product_list = []
                for product in products:
                    product_dict = {
                        "id": product.id,
                        "codigo": product.codigo,
                        "nombre": product.nombre,
                        "categoria": {
                            "id": product.categoria.id,
                            "name": product.categoria.name
                        } if product.categoria else None,
                        "precio_costo": product.precio_costo,
                        "precio_venta": product.precio_venta,
                        "stock": product.stock,
                        "stock_minimo": product.stock_minimo
                    }
                    product_list.append(product_dict)
                
                if not product_list:
                    raise HTTPException(status_code=404, detail="No hay productos disponibles")
                
                return product_list
                
            except Exception as e:
                print(f"Error al obtener los productos: {e}")
                raise HTTPException(status_code=500, detail="Error inesperado al obtener los productos")



    def update_product(self, codigo: str, product_update: schemas.ProductCreate) -> dict:
        with db_session:
            try:
                # Buscar el producto por código
                product = models.Product.get(codigo=codigo)
                if not product:
                    raise HTTPException(status_code=404, detail="Producto no encontrado")

                # Actualizar datos del producto
                product.nombre = product_update.nombre
                product.precio_costo = product_update.precio_costo
                product.precio_venta = product_update.precio_venta

                # Actualizar la categoría (si es necesario, se puede cambiar la categoría del producto)
                category = models.Category.get(id=product_update.categoria_id)
                if not category:
                    raise HTTPException(status_code=404, detail="Categoría no encontrada")
                product.categoria = category

                return {"message": "Producto actualizado correctamente"}

            except Exception as e:
                # Mostrar el error en la consola y lanzar excepción
                print(f"Error al actualizar el producto: {e}")
                raise HTTPException(status_code=500, detail="Error inesperado al actualizar el producto.")
            
    def delete_product(self, codigo: str) -> dict:
        with db_session:
            try:
                # Buscar el producto por código
                product = models.Product.get(codigo=codigo)
                if not product:
                    raise HTTPException(status_code=404, detail="Producto no encontrado")

                # Eliminar el producto
                product.delete()
                return {"message": "Producto eliminado correctamente"}

            except Exception as e:
                print(f"Error al eliminar el producto: {e}")
                raise HTTPException(status_code=500, detail="Error inesperado al eliminar el producto.")
<<<<<<< HEAD
            
    def adjust_stock(self, codigo: str, cantidad: int) -> dict:
            with db_session:
                try:
                    product = models.Product.get(codigo=codigo)
                    if not product:
                        raise HTTPException(status_code=404, detail="Producto no encontrado")
                    
                    product.stock += cantidad
                    message = "Stock actualizado correctamente."
                    
                    if product.stock < product.stock_minimo:
                        message += " Advertencia: el stock está por debajo del mínimo permitido."
                    
                    return {"message": message, "stock_actual": product.stock}
                except Exception as e:
                    print(f"Error al ajustar el stock: {e}")
                    raise HTTPException(status_code=500, detail="Error inesperado al ajustar el stock.")
    
    def get_low_stock_products(self):
        with db_session:
            try:
                # Filtrar productos con stock por debajo del mínimo
                low_stock_products = list(models.Product.select(lambda p: p.stock < p.stock_minimo))

                if not low_stock_products:
                    raise HTTPException(status_code=404, detail="No hay productos con stock bajo.")

                product_list = [
                    {
                        "id": product.id,
                        "codigo": product.codigo,
                        "nombre": product.nombre,
                        "categoria": {
                            "id": product.categoria.id,
                            "name": product.categoria.name
                        } if product.categoria else None,  # Aseguramos que sea un diccionario
                        "stock": product.stock,
                        "stock_minimo": product.stock_minimo,
                        "precio_costo": product.precio_costo,  # Agregamos el campo faltante
                        "precio_venta": product.precio_venta   # Agregamos el campo faltante
                    }
                    for product in low_stock_products
                ]

                return product_list

            except Exception as e:
                print(f"Error al obtener productos con stock bajo: {e}")
                raise HTTPException(status_code=500, detail="Error inesperado al obtener productos con stock bajo.")
            
    #FUNCIONA
    def get_total_products(self):
        with db_session:
            try:
                # Obtener todos los productos y luego contar el tamaño de la lista
                total_products = len(list(models.Product.select()))
                return {"total_products": total_products}
            except Exception as e:
                print(f"Error al obtener la cantidad de productos: {e}")
                raise HTTPException(status_code=500, detail="Error inesperado al obtener la cantidad de productos.")

    #FUNCIONA
    def get_inventory_value(self):
        with db_session:
            try:
                """ Calcula el valor total del inventario sumando (stock * precio_venta) de todos los productos en la base de datos. """
                total_value = select(sum(p.stock * p.precio_venta) for p in models.Product)[:][0] or 0
                return {"inventory_value": total_value}
            except Exception as e:
                print(f"Error al obtener el valor del inventario: {e}")
                raise HTTPException(status_code=500, detail="Error inesperado al obtener el valor del inventario.")


    def get_low_stock_count(self):
        with db_session:
            try:
                # Filtrar productos con stock bajo y contar la cantidad
                low_stock_count = len(list(models.Product.select(lambda p: p.stock < p.stock_minimo)))
                return {"low_stock_count": low_stock_count}
            except Exception as e:
                print(f"Error al obtener la cantidad de productos con stock bajo: {e}")
                raise HTTPException(status_code=500, detail="Error inesperado al obtener la cantidad de productos con stock bajo.")









=======
>>>>>>> 405771247fff7b4b255287220e9baf1ee23150f6


