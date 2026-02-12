import os
from pathlib import Path
from dotenv import load_dotenv

# Cargar variables de entorno desde el .env del Backend si existe, o del sistema
PYTHON_BASE_DIR = Path(__file__).resolve().parent.parent
BACKEND_BASE_DIR = PYTHON_BASE_DIR.parent
load_dotenv(BACKEND_BASE_DIR / ".env")

# Directorio base de los scripts de python
PYTHON_BASE_DIR = Path(__file__).resolve().parent.parent
# Directorio raíz del Backend de Java
BACKEND_BASE_DIR = PYTHON_BASE_DIR.parent

# Configuración de Base de Datos (Conexión local unificada)
DATABASE_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'trl_db',
    'user': 'postgres',
    'password': 'postgres123',
}

DATABASE_URL = (
    f"postgresql://{DATABASE_CONFIG['user']}:{DATABASE_CONFIG['password']}"
    f"@{DATABASE_CONFIG['host']}:{DATABASE_CONFIG['port']}/{DATABASE_CONFIG['database']}"
)

# Configuración de directorios de almacenamiento (en el root del backend)
STORAGE_DIR = BACKEND_BASE_DIR / 'storage'
INPUT_DIR = STORAGE_DIR / 'uploads'
OUTPUT_DIR = STORAGE_DIR / 'analysis'
TEMP_DIR = STORAGE_DIR / 'temp'
LOG_DIR = PYTHON_BASE_DIR / 'logs'

# Crear directorios si no existen
for directory in [INPUT_DIR, OUTPUT_DIR, TEMP_DIR, LOG_DIR]:
    directory.mkdir(parents=True, exist_ok=True)

# Google Cloud y Gemini
MODEL_ID = os.getenv('MODEL_ID', 'gemini-2.0-flash')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'AQ.Ab8RN6L_zoflfl5-DVqNjTZL8p5rPyyTTb1HltIuIo75WLeR5Q')
PROJECT_ID = os.getenv('PROJECT_ID', '')
REGION = os.getenv('REGION', '')

# Configuración de OCR
TESSERACT_CMD = os.getenv('TESSERACT_CMD', 'tesseract')

# Configuración de Logging
LOG_LEVEL = "INFO"
LOG_FILE = LOG_DIR / "python_analysis.log"
