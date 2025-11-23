"""
Script de prueba para el microservicio de análisis TRL.
Envía un PDF al microservicio y muestra el resultado.
"""
import requests
import json
from pathlib import Path
import sys

# Configurar la codificación de salida para Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Configuración
API_URL = "http://localhost:5000/analizar"
PDF_PATH = r"C:\Users\jcnaz\OneDrive\Documentos\TRLCodigo\DocumentosPrueba\Proyecto_Vinculacion1.pdf"
OUTPUT_FILE = r"C:\Users\jcnaz\OneDrive\Documentos\TRLCodigo\DocumentosPrueba\resultado_analisis_TRL.txt"

def probar_microservicio():
    """Envía el PDF al microservicio y guarda el resultado."""
    
    print("=" * 60)
    print("PRUEBA DE MICROSERVICIO DE ANALISIS TRL")
    print("=" * 60)
    print()
    
    # Verificar que el PDF existe
    pdf_file = Path(PDF_PATH)
    if not pdf_file.exists():
        print(f"[ERROR] No se encuentra el PDF en: {PDF_PATH}")
        return
    
    print(f"[OK] PDF encontrado: {pdf_file.name}")
    print(f"[OK] Tamaño: {pdf_file.stat().st_size / 1024:.2f} KB")
    print()
    
    # Verificar que el servidor está corriendo
    try:
        health_response = requests.get("http://localhost:5000/health", timeout=5)
        if health_response.status_code == 200:
            health_data = health_response.json()
            print("[OK] Servidor FastAPI esta activo")
            print(f"     Project ID: {health_data['project_id']}")
            print(f"     Model ID: {health_data['model_id']}")
            print()
        else:
            print("[WARNING] Servidor responde pero con error")
            print()
    except requests.exceptions.RequestException as e:
        print("[ERROR] No se pudo conectar al servidor")
        print(f"        Asegurate de que el servidor este corriendo en http://localhost:5000")
        print(f"        Error: {e}")
        return
    
    # Enviar PDF al microservicio
    print("[INFO] Enviando PDF al microservicio...")
    print("[INFO] Esto puede tomar varios minutos (hasta 5 min)...")
    print()
    
    try:
        with open(PDF_PATH, "rb") as pdf_file:
            files = {"file": (pdf_file.name, pdf_file, "application/pdf")}
            response = requests.post(API_URL, files=files, timeout=360)
        
        # Verificar respuesta
        if response.status_code == 200:
            result = response.json()
            
            if result["success"]:
                print("=" * 60)
                print("[EXITO] ANALISIS COMPLETADO EXITOSAMENTE")
                print("=" * 60)
                print()
                
                # Mostrar resumen del informe
                informe = result["table_text"]
                lineas = informe.split("\n")
                
                print("RESUMEN DEL INFORME:")
                print("-" * 60)
                
                # Mostrar primeras 30 líneas
                for i, linea in enumerate(lineas[:30]):
                    print(linea)
                
                if len(lineas) > 30:
                    print()
                    print(f"... ({len(lineas) - 30} lineas mas)")
                
                print()
                print("-" * 60)
                print(f"[INFO] Total de lineas: {len(lineas)}")
                print(f"[INFO] Total de caracteres: {len(informe)}")
                print()
                
                # Guardar resultado completo
                with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
                    f.write("=" * 80 + "\n")
                    f.write("ANALISIS TRL - PROYECTO VINCULACION\n")
                    f.write("=" * 80 + "\n\n")
                    f.write(informe)
                
                print(f"[OK] Informe completo guardado en:")
                print(f"     {OUTPUT_FILE}")
                print()
                
            else:
                print("=" * 60)
                print("[ERROR] ERROR EN EL ANALISIS")
                print("=" * 60)
                print()
                print(f"Error: {result['error']}")
                print()
        else:
            print(f"[ERROR] HTTP {response.status_code}")
            print(f"Respuesta: {response.text}")
            
    except requests.exceptions.Timeout:
        print("[ERROR] Timeout - el analisis tardo demasiado")
        print("        Intenta con un PDF mas pequeño o aumenta el timeout")
        
    except Exception as e:
        print(f"[ERROR] Inesperado: {type(e).__name__}")
        print(f"        {str(e)}")

if __name__ == "__main__":
    probar_microservicio()

