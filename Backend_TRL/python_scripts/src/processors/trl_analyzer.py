from pathlib import Path
from typing import Optional
from google import genai
from google.genai import types
from loguru import logger
from config.settings import GEMINI_API_KEY, MODEL_ID, PROJECT_ID, REGION
from src.storage.db_manager import db_manager

class TRLAnalyzer:
    def __init__(self):
        # Determinar si usar Vertex AI o AI Studio
        is_vertex = bool(PROJECT_ID and REGION)
        
        try:
            if is_vertex:
                logger.info(f"Configurando para Vertex AI: {PROJECT_ID} en {REGION}")
                self.client = genai.Client(
                    vertexai=True,
                    project=PROJECT_ID,
                    location=REGION
                )
            else:
                if not GEMINI_API_KEY or GEMINI_API_KEY.startswith('AQ.'):
                    logger.warning("La API Key detectada parece ser de Vertex AI o est\u00e1 mal configurada.")
                    # Si el usuario no tiene una key de AI Studio, pero est\u00e1 intentando usar la de GCP
                    # Podr\u00edamos intentar forzar Vertex AI si tenemos las credenciales de entorno.
                    if not GEMINI_API_KEY:
                        raise RuntimeError("API Key de Gemini no configurada.")
                
                logger.info("Configurando para AI Studio (Google AI)")
                self.client = genai.Client(api_key=GEMINI_API_KEY)
            
            self.model_id = MODEL_ID
            logger.info(f"TRLAnalyzer inicializado con modelo: {self.model_id}")
        except Exception as e:
            logger.error(f"Error inicializando el cliente de Gemini: {e}")
            raise RuntimeError(f"Error inicializando el cliente de Gemini: {e}")

    def _construir_prompt_trl(self):
        # Cargar matrices desde la Base de Datos
        matriz_evidencias, matriz_puntajes = db_manager.get_trl_criteria()
        
        prompt = f"""
Act\u00faa como un evaluador experto de madurez tecnol\u00f3gica (TRL) siguiendo rigurosamente la metodolog\u00eda oficial de la Universidad de las Fuerzas Armadas ESPE.

Tu tarea es analizar el PDF proporcionado y generar un informe TRL exhaustivo, objetivo y completamente basado en evidencias expl\u00edcitas.

====================================================
 REGLAS ESTRICTAS DE EVALUACI\u00d3N (OBLIGATORIAS)
====================================================
1. SOLO PUEDES ASIGNAR PUNTOS A EVIDENCIAS QUE coincidan EXACTAMENTE con los criterios de la MATRIZ DE EVIDENCIAS adjunta.
2. NO CONFUNDAS descripciones textuales con evidencias reales.
3. VALIDACI\u00d3N SECUENCIAL: NO eval\u00faes un TRL superior si el anterior no est\u00e1 validado.
4. EL TRL REAL es el \u00faltimo nivel completamente validado.

====================================================
 MATRIZ DE EVIDENCIAS (CRITERIOS DESDE DB)
====================================================
{matriz_evidencias}

====================================================
 MATRIZ DE PUNTAJES M\u00cdNIMOS (DESDE DB)
====================================================
{matriz_puntajes}

INSTRUCCIONES DE AN\u00c1LISIS:
1. Determinar si es documento tecnol\u00f3gico.
2. Identificar evidencias encontradas (fragmentos textuales).
3. Evaluaci\u00f3n TRL nivel por nivel.
4. Determinaci\u00f3n del TRL Real.
5. Recomendaciones para avanzar.

Analiza el PDF adjunto:
"""
        return prompt

    def analizar_pdf(self, pdf_path: Path):
        logger.info(f"Iniciando an\u00e1lisis TRL de: {pdf_path.name}")
        pdf_bytes = pdf_path.read_bytes()
        prompt = self._construir_prompt_trl()
        
        response = self.client.models.generate_content(
            model=MODEL_ID,
            contents=[
                types.Part.from_bytes(data=pdf_bytes, mime_type="application/pdf"),
                prompt
            ]
        )
        return response.text
