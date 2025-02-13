from pony.orm import db_session
from fastapi import HTTPException
from src import models, schemas
from src.schemas import CategoryCreate


class CategoryService:

    def get_category_by_id(self, categoria_id: int):
        with db_session:
            # Buscar la categoría por ID
            category = models.Category.get(id=categoria_id)
            if not category:
                raise HTTPException(status_code=404, detail="Categoría no encontrada")
            # Convertir a diccionario o esquema para enviar como respuesta
            category_data = schemas.CategoryResponse(
                id=category.id,
                name=category.name  # Asegúrate de que 'name' sea el nombre correcto del campo
            )
            return category_data

    def get_category_by_name(self, nombre: str):
        with db_session:
            # Buscar la categoría por nombre
            category = models.Category.get(nombre=nombre)
            return category

    def create_category(self, category_data: CategoryCreate):
        with db_session:
            try:
                # Verificar si la categoría ya existe
                existing_category = models.Category.get(name=category_data.name)
                if existing_category:
                    raise HTTPException(status_code=400, detail="La categoría ya existe.")
                
                # Crear una nueva categoría
                new_category = models.Category(
                    name=category_data.name  # Asumimos que 'nombre' es un campo en tu modelo
                )
                return new_category
            except Exception as e:
                print(f"Error al crear la categoría: {e}")
                raise HTTPException(status_code=500, detail="Error al crear la categoría.")
    
    def update_category(self, categoria_id: int, category_update: CategoryCreate):
        with db_session:
            try:
                # Buscar la categoría por ID
                category = models.Category.get(id=categoria_id)
                if not category:
                    raise HTTPException(status_code=404, detail="Categoría no encontrada")
                
                # Actualizar la categoría
                category.name = category_update.name
                return {"message": "Categoría actualizada correctamente"}
            except Exception as e:
                print(f"Error al actualizar la categoría: {e}")
                raise HTTPException(status_code=500, detail="Error al actualizar la categoría.")
    
    def delete_category(self, categoria_id: int):
        with db_session:
            try:
                # Buscar la categoría por ID
                category = models.Category.get(id=categoria_id)
                if not category:
                    raise HTTPException(status_code=404, detail="Categoría no encontrada")
                
                # Eliminar la categoría
                category.delete()
                return {"message": "Categoría eliminada correctamente"}
            except Exception as e:
                print(f"Error al eliminar la categoría: {e}")
                raise HTTPException(status_code=500, detail="Error al eliminar la categoría.")
