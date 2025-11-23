"""
Microservicio FastAPI para análisis de PDFs con Google Cloud Gemini.
"""
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from config import settings
from models.schemas import AnalysisResponse, HealthResponse
from services.analizador_TRL import analizar_trl


# Configurar logging
logging.basicConfig(
    level=logging.INFO if settings.DEBUG else logging.WARNING,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Crear app FastAPI
app = FastAPI(
    title="Microservicio de Análisis TRL",
    description="Evalúa el nivel de madurez tecnológica (TRL) de documentos PDF usando Google Cloud Gemini 2.0 Pro",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", response_model=dict)
async def root():
    """Endpoint raíz."""
    return {
        "message": "Microservicio de Análisis TRL",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Endpoint de health check."""
    return HealthResponse(
        status="healthy",
        project_id=settings.PROJECT_ID,
        model_id=settings.MODEL_ID
    )


@app.post("/analizar", response_model=AnalysisResponse)
async def analizar_documento(
    file: UploadFile = File(..., description="Archivo PDF del documento tecnológico a analizar")
):
    """
    Analiza un PDF de un documento tecnológico y evalúa su nivel TRL.
    
    Args:
        file: Archivo PDF enviado en la petición
        
    Returns:
        AnalysisResponse con el informe TRL o mensaje de error
    """
    # Validar que sea PDF
    if not file.content_type == "application/pdf":
        raise HTTPException(
            status_code=400,
            detail=f"El archivo debe ser PDF. Se recibió: {file.content_type}"
        )
    
    try:
        # Leer contenido del archivo
        logger.info(f"Procesando archivo: {file.filename}")
        pdf_bytes = await file.read()
        
        # Validar tamaño (por ejemplo, máximo 10MB)
        max_size = 10 * 1024 * 1024  # 10MB
        if len(pdf_bytes) > max_size:
            raise HTTPException(
                status_code=400,
                detail=f"El archivo es demasiado grande. Máximo: {max_size / 1024 / 1024}MB"
            )
        
        # Analizar con Gemini
        logger.info("Enviando a Gemini para análisis TRL...")
        informe_trl = analizar_trl(pdf_bytes)
        
        logger.info("Análisis TRL completado exitosamente")
        return AnalysisResponse(
            success=True,
            table_text=informe_trl,
            error=None
        )
        
    except RuntimeError as e:
        logger.error(f"Error en Vertex AI: {str(e)}")
        return AnalysisResponse(
            success=False,
            table_text=None,
            error=f"Error en la API de Vertex AI: {str(e)}"
        )
        
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}", exc_info=True)
        return AnalysisResponse(
            success=False,
            table_text=None,
            error=f"Error inesperado: {str(e)}"
        )


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Manejador global de excepciones."""
    logger.error(f"Excepción no manejada: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "table_text": None,
            "error": f"Error interno del servidor: {str(exc)}"
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.DEBUG
    )
