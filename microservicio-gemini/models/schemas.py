from pydantic import BaseModel, Field
from typing import Optional


class AnalysisRequest(BaseModel):
    """Modelo de petición para análisis de PDF."""
    # El PDF se enviará como archivo multipart
    pass


class AnalysisResponse(BaseModel):
    """Modelo de respuesta del análisis TRL."""
    success: bool = Field(..., description="Indica si el análisis fue exitoso")
    table_text: Optional[str] = Field(None, description="Informe completo de análisis TRL")
    error: Optional[str] = Field(None, description="Mensaje de error si falló")
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "table_text": "=== ANÁLISIS TRL ===\n\nTRL ALCANZADO: TRL 5\n\nEVIDENCIAS ENCONTRADAS:\n- TRL 1: Cumplido (85/100)\n...",
                "error": None
            }
        }


class HealthResponse(BaseModel):
    """Modelo de respuesta para health check."""
    status: str = Field(..., description="Estado del servicio")
    project_id: str = Field(..., description="ID del proyecto GCP")
    model_id: str = Field(..., description="ID del modelo Gemini")
