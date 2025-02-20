from fastapi import APIRouter, Depends, HTTPException, Response
from src.services.reportes_services import ReportService
from src.controllers.auth_controller import get_current_user

router = APIRouter()
report_service = ReportService()


@router.get("/generate_inventory_pdf")
def generate_inventory_pdf(current_user=Depends(get_current_user)):
    """Genera un reporte en PDF con la cantidad de productos en el inventario."""
    try:
        pdf_path = report_service.generate_inventory_pdf()
        
        # Leer el archivo PDF generado
        with open(pdf_path, "rb") as pdf_file:
            pdf_content = pdf_file.read()

        return Response(
            content=pdf_content,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=inventarioAstro.pdf"}
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error al generar el reporte: {str(e)}"
        )