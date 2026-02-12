import sys
import argparse
from pathlib import Path
from src.processors.document_processor import DocumentProcessor
from src.processors.trl_analyzer import TRLAnalyzer
from config.settings import OUTPUT_DIR, LOG_DIR
from src.utils.logger import setup_logger
from loguru import logger

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--file', required=True, help='Ruta al archivo PDF')
    parser.add_argument('--doc_id', required=False, help='ID del documento en la DB (opcional)')
    args = parser.parse_args()

    setup_logger()
    pdf_path = Path(args.file)
    
    if not pdf_path.exists():
        logger.error(f"Archivo {pdf_path} no encontrado")
        sys.exit(1)

    try:
        # 1. Procesamiento b\u00e1sico (Extracci\u00f3n de texto e im\u00e1genes)
        logger.info("Fase 1: Procesamiento de documento y extracci\u00f3n de recursos...")
        processor = DocumentProcessor()
        # Si no nos pasaron doc_id, el processor crear\u00e1 uno nuevo.
        # Si ya existe (pasado por Java), el processor podr\u00eda actualizarlo (esto requerir\u00eda ajustar el processor).
        document_id = processor.process_document(pdf_path)
        logger.info(f"Documento procesado con ID interno: {document_id}")

        # 2. An\u00e1lisis TRL con Gemini
        logger.info("Fase 2: Iniciando an\u00e1lisis TRL con Google Gemini...")
        analyzer = TRLAnalyzer()
        resultado = analyzer.analizar_pdf(pdf_path)
        
        # 3. Guardar resultado
        output_file = OUTPUT_DIR / f"analisis_{document_id}.txt"
        output_file.write_text(resultado, encoding='utf-8')
        
        logger.info(f"SUCCESS: An\u00e1lisis completado. Resultado en: {output_file}")
        
        # Imprimir el ID para que Java pueda capturarlo si es necesario
        print(f"DOC_ID:{document_id}")
        sys.exit(0)
        
    except Exception as e:
        logger.exception(f"Error durante el procesamiento/an\u00e1lisis: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
