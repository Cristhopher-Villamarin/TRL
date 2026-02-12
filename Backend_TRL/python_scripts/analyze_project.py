import sys
import argparse
import shutil
from pathlib import Path
from loguru import logger
from src.processors.trl_analyzer import TRLAnalyzer
from src.storage.db_manager import db_manager
from config.settings import OUTPUT_DIR, TEMP_DIR
from src.utils.logger import setup_logger
from google.genai import types

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--project_id', required=True, type=int, help='ID del proyecto en la DB')
    args = parser.parse_args()

    setup_logger()
    project_id = args.project_id
    
    # Crear carpeta temporal para las evidencias del proyecto
    project_temp_dir = TEMP_DIR / f"project_{project_id}"
    if project_temp_dir.exists():
        shutil.rmtree(project_temp_dir)
    project_temp_dir.mkdir(parents=True)

    try:
        logger.info(f"Iniciando análisis global para el Proyecto ID: {project_id}")
        
        # 1. Obtener evidencias desde la DB
        evidencias = db_manager.get_project_evidences(project_id)
        if not evidencias:
            logger.warning(f"No se encontraron evidencias para el proyecto {project_id}")
            # Crear un TXT indicando que no hay evidencias
            output_file = OUTPUT_DIR / f"analisis_proyecto_{project_id}.txt"
            output_file.write_text(f"El proyecto {project_id} no tiene evidencias cargadas para analizar.", encoding='utf-8')
            sys.exit(0)

        logger.info(f"Se encontraron {len(evidencias)} evidencias para procesar.")

        # 2. Preparar los archivos para Gemini
        analyzer = TRLAnalyzer()
        gemini_contents = []
        
        # El prompt base para análisis de proyecto
        prompt_base = f"""
Actúa como un evaluador experto de madurez tecnológica (TRL).
Analiza todas las evidencias adjuntas correspondientes al Proyecto ID: {project_id}.
Tu objetivo es determinar el TRL GLOBAL del proyecto basándote en el conjunto de todos estos documentos.

{analyzer._construir_prompt_trl()}

Instrucciones adicionales:
- Considera la información de TODOS los archivos para validar los criterios.
- Si una evidencia falta en un archivo pero está en otro, se considera válida para el proyecto.
"""
        gemini_contents.append(prompt_base)

        for evi in evidencias:
            idevidencia, nombre, tipo, datos = evi
            file_path = project_temp_dir / nombre
            
            # Convertir memoryview a bytes para Gemini
            datos_bytes = bytes(datos)
            
            # Guardar el binario temporalmente
            file_path.write_bytes(datos_bytes)
            
            logger.info(f"Procesando evidencia: {nombre} ({tipo})")
            
            # Solo procesar si es PDF (Gemini maneja PDFs bien)
            if tipo == "application/pdf" or nombre.lower().endswith('.pdf'):
                gemini_contents.append(types.Part.from_bytes(data=datos_bytes, mime_type="application/pdf"))
            elif tipo.startswith("image/"):
                gemini_contents.append(types.Part.from_bytes(data=datos_bytes, mime_type=tipo))
            else:
                # Si es texto u otro, intentar enviarlo como texto si es posible, 
                # o simplemente ignorar si no es compatible con el modelo flash
                logger.warning(f"Tipo de archivo {tipo} no soportado para análisis directo, se ignora: {nombre}")

        # 3. Enviar a Gemini
        logger.info("Enviando conjunto de evidencias a Google Gemini...")
        response = analyzer.client.models.generate_content(
            model=analyzer.model_id,
            contents=gemini_contents
        )

        # 4. Guardar resultado final en PDF
        output_file_pdf = OUTPUT_DIR / f"analisis_proyecto_{project_id}.pdf"
        
        from fpdf import FPDF

        class TRLReport(FPDF):
            def header(self):
                # Franja superior decorativa
                self.set_fill_color(31, 41, 55) # Gris oscuro/Negro
                self.rect(0, 0, 210, 35, 'F')
                
                self.set_y(10)
                self.set_font('helvetica', 'B', 18)
                self.set_text_color(255, 255, 255)
                self.cell(0, 10, 'INFORME DE MADUREZ TECNOLOGICA', align='C', new_x="LMARGIN", new_y="NEXT")
                
                self.set_font('helvetica', 'I', 9)
                self.cell(0, 5, 'Sistema de Evaluacion de Proyectos ESPE - Inteligencia Artificial', align='C', new_x="LMARGIN", new_y="NEXT")
                self.ln(10)

            def footer(self):
                self.set_y(-15)
                self.set_font('helvetica', 'I', 8)
                self.set_text_color(128, 128, 128)
                self.cell(0, 10, f'Pagina {self.page_no()}', align='C')
                self.cell(0, 10, 'ESPE - Innovacion y Desarrollo', align='R')

        pdf = TRLReport()
        pdf.add_page()
        pdf.set_auto_page_break(auto=True, margin=20)
        
        # --- BLOQUE DE DATOS GENERALES ---
        pdf.set_y(45)
        pdf.set_fill_color(249, 250, 251)
        pdf.set_draw_color(229, 231, 235)
        pdf.rect(10, 40, 190, 25, 'FD')
        
        pdf.set_xy(15, 43)
        pdf.set_font('helvetica', 'B', 11)
        pdf.set_text_color(31, 41, 55)
        pdf.cell(95, 8, f'ID PROYECTO: {project_id}')
        
        import datetime
        pdf.cell(90, 8, f'FECHA DE EMISION: {datetime.datetime.now().strftime("%Y-%m-%d %H:%M")}', align='R', new_x="LMARGIN", new_y="NEXT")
        
        pdf.set_x(15)
        pdf.set_font('helvetica', '', 10)
        pdf.cell(0, 8, 'Metodologia: Matriz de Evidencias ESPE / Analisis con Gemini 2.0 Flash')
        pdf.ln(15)

        # --- NIVEL TRL DESTACADO ---
        raw_content = response.text
        trl_level = "No determinado"
        lines = raw_content.split('\n')
        for line in lines:
            if 'TRL' in line.upper() and any(char.isdigit() for char in line):
                import re
                match = re.search(r'TRL\s*\d', line.upper())
                if match:
                    trl_level = match.group()
                    break

        pdf.set_fill_color(79, 70, 229) # Indigo ESBE
        pdf.set_text_color(255, 255, 255)
        pdf.set_font('helvetica', 'B', 22)
        pdf.cell(0, 20, f'RESULTADO GLOBAL: {trl_level}', align='C', fill=True, new_x="LMARGIN", new_y="NEXT")
        pdf.ln(10)

        # --- DETALLE DEL DIAGNOSTICO ---
        pdf.set_text_color(17, 24, 39)
        pdf.set_font('helvetica', 'B', 14)
        pdf.cell(0, 10, 'DETALLE DEL DIAGNOSTICO TECNICO:', new_x="LMARGIN", new_y="NEXT")
        pdf.set_draw_color(79, 70, 229)
        pdf.set_line_width(0.8)
        pdf.line(10, pdf.get_y(), 60, pdf.get_y())
        pdf.ln(5)

        pdf.set_font('helvetica', '', 10)
        pdf.set_line_width(0.2)
        
        def clean_for_pdf(text):
            return text.encode('latin-1', 'replace').decode('latin-1').replace('?', '-')

        for line in lines:
            line = line.strip()
            if not line or line.startswith('='):
                continue
            
            line = clean_for_pdf(line)
            
            # Encabezados de Nivel (Secciones en gris claro)
            if 'NIVEL TRL' in line.upper() and ('OBSERVACIONES' in line.upper() or 'EVALUACION' in line.upper()):
                pdf.ln(4)
                pdf.set_fill_color(243, 244, 246)
                pdf.set_font('helvetica', 'B', 11)
                pdf.cell(0, 8, f'  {line.upper()}', fill=True, new_x="LMARGIN", new_y="NEXT")
                pdf.ln(2)
            
            # Criterios y Evidencias resaltadas
            elif 'CRITERIO:' in line.upper():
                pdf.set_font('helvetica', 'B', 10)
                pdf.set_text_color(79, 70, 229)
                pdf.multi_cell(0, 6, f'  > {line}')
                pdf.set_text_color(0, 0, 0)
                pdf.set_font('helvetica', '', 10)
            elif 'EVIDENCIA:' in line.upper():
                pdf.set_x(20)
                pdf.set_font('helvetica', 'I', 10)
                pdf.multi_cell(0, 5, line)
                pdf.set_font('helvetica', '', 10)
            
            # Puntajes y Resultados
            elif 'PUNTAJE' in line.upper() or 'CONCLUSION' in line.upper() or 'CUMPLE' in line.upper():
                pdf.set_x(15)
                pdf.set_font('helvetica', 'B', 10)
                if 'NO' in line.upper() or 'NO VALIDADO' in line.upper():
                    pdf.set_text_color(220, 38, 38) # Rojo
                elif 'SI' in line.upper() or 'VALIDADO' in line.upper():
                    pdf.set_text_color(22, 163, 74) # Verde
                pdf.cell(0, 8, line, new_x="LMARGIN", new_y="NEXT")
                pdf.set_text_color(0, 0, 0)
            
            # TRL Real y Recomendaciones
            elif 'TRL REAL:' in line.upper() or 'RECOMENDACIONES' in line.upper():
                pdf.ln(5)
                pdf.set_font('helvetica', 'B', 12)
                pdf.set_draw_color(31, 41, 55)
                pdf.cell(0, 10, line.upper(), border='B', new_x="LMARGIN", new_y="NEXT")
                pdf.ln(2)
            
            # Listas de recomendaciones
            elif line.startswith('* ') or line.startswith('- '):
                pdf.set_x(15)
                clean_item = line[2:].strip()
                pdf.multi_cell(0, 6, f'- {clean_item}')
                pdf.ln(1)
            else:
                pdf.multi_cell(0, 6, line)
                pdf.ln(1)

        pdf.output(str(output_file_pdf))

        pdf.output(str(output_file_pdf))
        
        logger.info(f"SUCCESS: Análisis de proyecto completado. Informe PDF generado en: {output_file_pdf}")
        
    except Exception as e:
        logger.exception(f"Error durante el análisis del proyecto: {e}")
        sys.exit(1)
    finally:
        # Limpiar archivos temporales (con ignore_errors para evitar dramas en Windows)
        if project_temp_dir.exists():
            shutil.rmtree(project_temp_dir, ignore_errors=True)

if __name__ == "__main__":
    main()
