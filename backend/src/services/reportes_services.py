from pony.orm import db_session
from fastapi import HTTPException
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from src import models


class ReportService:
    def _init_(self):
        pass

    @db_session
    def generate_inventory_pdf(self) -> str:
        """Genera un reporte en PDF con la cantidad de productos en el inventario."""
        try:
            # Obtener todos los productos
            products = list(models.Product.select())

            if not products:
                raise HTTPException(status_code=404, detail="No hay productos en el inventario.")

            # Nombre del archivo PDF
            pdf_filename = "inventory_report.pdf"

            # Crear PDF
            c = canvas.Canvas(pdf_filename, pagesize=letter)
            width, height = letter

            # Título del reporte (centrado)
            c.setFont("Helvetica-Bold", 16)
            c.drawCentredString(width / 2, height - 40, "Reporte de Inventario")

            # Configurar la tabla
            c.setFont("Helvetica-Bold", 10)
            y_position = height - 80

            headers = ["Código", "Nombre", "Categoría", "Stock", "Precio Venta", "Precio Costo"]
            
            # Ajustar posiciones X con más separación
            x_start = 50  # Margen izquierdo
            column_spacing = 90  # Espaciado entre columnas aumentado
            x_positions = [x_start + i * column_spacing for i in range(len(headers))]

            # Dibujar encabezados
            for i, header in enumerate(headers):
                c.drawString(x_positions[i], y_position, header)

            c.setFont("Helvetica", 10)
            y_position -= 20  # Más espacio entre encabezados y datos

            # Agregar datos de productos
            for product in products:
                if y_position < 50:  # Crear nueva página si el espacio es insuficiente
                    c.showPage()
                    y_position = height - 80
                    c.setFont("Helvetica", 10)

                categoria_nombre = product.categoria.name if product.categoria else "Sin categoría"

                c.drawString(x_positions[0], y_position, product.codigo)
                c.drawString(x_positions[1], y_position, product.nombre[:20])  # Limitar nombre a 20 caracteres
                c.drawString(x_positions[2], y_position, categoria_nombre[:15])  # Limitar categoría a 15 caracteres
                c.drawString(x_positions[3], y_position, str(product.stock))
                c.drawString(x_positions[4], y_position, f"${product.precio_venta}")
                c.drawString(x_positions[5], y_position, f"${product.precio_costo}")

                y_position -= 25  # Más espacio entre filas de productos

            c.save()
            return pdf_filename

        except Exception as e:
            print(f"Error al generar el reporte en PDF: {e}")
            raise HTTPException(status_code=500, detail="Error al generar el reporte en PDF.")