"""
Servicio de análisis de TRL (Technology Readiness Level) usando Google Cloud Gemini.
Evalúa el nivel de madurez tecnológica de documentos PDF.
"""
import base64
import requests
from pathlib import Path
from google.auth import default
from google.auth.transport.requests import Request
from config import settings


# Carpeta donde están las matrices TRL
MATRICES_DIR = Path(__file__).parent.parent / "datTRL"


# ==========================
#   LECTURA DE MATRICES TRL
# ==========================
def _cargar_matriz(nombre: str) -> str:
    """
    Carga el contenido de un archivo de matriz TRL.
    
    Args:
        nombre: Nombre del archivo (ej: "matriz2.txt")
        
    Returns:
        Contenido del archivo
        
    Raises:
        FileNotFoundError: Si el archivo no existe
    """
    ruta = MATRICES_DIR / nombre
    if not ruta.exists():
        raise FileNotFoundError(f"No existe el archivo de matriz: {ruta}")
    return ruta.read_text(encoding="utf-8")


def _construir_prompt_trl() -> str:
    """
    Construye el prompt para evaluación TRL con todas las matrices.
    
    Returns:
        Prompt completo con las matrices TRL incluidas
    """
    matriz2 = _cargar_matriz("matriz2.txt")
    matriz3 = _cargar_matriz("matriz3.txt")
    matriz4 = _cargar_matriz("matriz4.txt")

    prompt = f"""
Actúa como un evaluador experto en madurez tecnológica (TRL).

Tu tarea es analizar el documento ingresado (PDF) para:

1) Determinar si es o no un documento tecnológico.
2) Identificar evidencias verificables directas e indirectas.
3) Evaluar cada uno de los niveles TRL (1 al 9).
4) Asignar los siguientes parámetros por cada nivel:
   - Nivel de madurez
   - Evidencias técnicas encontradas
   - Puntaje estimado (0–100)
   - Importancia (baja, media, alta, crítica)
   - Justificación detallada
5) Determinar el TRL global alcanzado.
6) Indicar si niveles inferiores están:
   - cumplidos
   - parcialmente cumplidos
   - no cumplidos
7) Generar recomendaciones para avanzar al siguiente nivel TRL.
8) Ofrecer conclusiones claras y verificables.

=====================================
 BASE DE DATOS OFICIAL TRL (ESPE)
=====================================

=== MATRIZ 2 — Evidencias TRL ===
{matriz2}

=== MATRIZ 3 — Puntajes mínimos ===
{matriz3}

=== MATRIZ 4 — TRL Global ===
{matriz4}

Ahora analiza completamente el PDF adjunto.
Genera un informe estructurado, claro y profundo.
"""
    return prompt


# ===================================
#   AUTENTICACIÓN VERTEX AI
# ===================================
def _bearer_token() -> str:
    """
    Obtiene el token de autenticación de Google Cloud usando ADC.
    
    Returns:
        Token de autenticación Bearer
        
    Raises:
        RuntimeError: Si hay error obteniendo credenciales
    """
    try:
        creds, _ = default(scopes=["https://www.googleapis.com/auth/cloud-platform"])
        creds.refresh(Request())
        return creds.token
    except Exception as e:
        raise RuntimeError(f"Error obteniendo credenciales ADC: {type(e).__name__}: {e}")


# ===================================
#   ANÁLISIS TRL
# ===================================
def analizar_trl(pdf_bytes: bytes) -> str:
    """
    Analiza un PDF y evalúa su nivel de madurez tecnológica (TRL).
    
    Args:
        pdf_bytes: Contenido del PDF en bytes
        
    Returns:
        Informe de análisis TRL en texto plano
        
    Raises:
        RuntimeError: Si hay error en la API de Vertex AI
        FileNotFoundError: Si faltan archivos de matrices
    """
    # Codificar PDF a base64
    pdf_codificado = base64.b64encode(pdf_bytes).decode("utf-8")
    
    # Construir prompt con matrices TRL
    prompt = _construir_prompt_trl()
    
    # Construir URL del endpoint (usando gemini-1.5-pro)
    model_id = "gemini-2.0-flash"
    url = (
        f"https://{settings.REGION}-aiplatform.googleapis.com/v1/"
        f"projects/{settings.PROJECT_ID}/locations/{settings.REGION}/"
        f"publishers/google/models/{model_id}:generateContent"
    )
    
    # Headers con autenticación
    headers = {
        "Authorization": f"Bearer {_bearer_token()}",
        "Content-Type": "application/json"
    }
    
    # Payload para la API
    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [
                    {"inline_data": {"mime_type": "application/pdf", "data": pdf_codificado}},
                    {"text": prompt}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0,
            "max_output_tokens": 8192,
            "response_mime_type": "text/plain"
        }
    }
    
    # Llamada a la API
    r = requests.post(url, headers=headers, json=payload, timeout=300)
    
    if r.status_code >= 400:
        raise RuntimeError(f"Error Vertex AI {r.status_code}:\n{r.text}")
    
    # Extraer y retornar el texto del análisis
    return r.json()["candidates"][0]["content"]["parts"][0]["text"]
