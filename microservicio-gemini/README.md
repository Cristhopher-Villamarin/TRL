# Microservicio de Análisis TRL con Google Cloud Gemini

Microservicio FastAPI para evaluar el nivel de madurez tecnológica (TRL) de documentos PDF usando Google Cloud Vertex AI (Gemini 2.0 Pro).

## 📋 Descripción

Este microservicio recibe archivos PDF de documentos tecnológicos, los procesa con el modelo Gemini 2.0 Pro de Google Cloud, y genera un informe completo de análisis TRL (Technology Readiness Level) que incluye:
- Evaluación de cada nivel TRL (1 al 9)
- Evidencias técnicas encontradas
- Puntajes por nivel
- TRL global alcanzado
- Recomendaciones para avanzar al siguiente nivel

## 🚀 Características

- ✅ API REST con FastAPI
- ✅ Evaluación TRL con Google Cloud Gemini 2.0 Pro
- ✅ Basado en matrices oficiales TRL (ESPE)
- ✅ Docker y Docker Compose
- ✅ Autenticación con Google Cloud ADC (Application Default Credentials)
- ✅ CORS configurado
- ✅ Validación de datos con Pydantic
- ✅ Logging estructurado
- ✅ Health check endpoint

## 📁 Estructura del Proyecto

```
microservicio-gemini/
├── .env                      # Variables de entorno
├── .env.example              # Ejemplo de configuración
├── .gitignore                # Archivos ignorados por Git
├── .dockerignore             # Archivos ignorados por Docker
├── requirements.txt          # Dependencias Python
├── Dockerfile                # Configuración Docker
├── docker-compose.yml        # Orquestación de contenedores
├── README.md                 # Este archivo
├── main.py                   # Aplicación FastAPI
├── config.py                 # Configuración centralizada
├── datTRL/                   # Matrices TRL oficiales (ESPE)
│   ├── matriz2.txt           # Evidencias por nivel TRL
│   ├── matriz3.txt           # Puntajes mínimos por TRL
│   └── matriz4.txt           # Rangos para TRL global
├── models/
│   ├── __init__.py
│   └── schemas.py            # Modelos Pydantic
└── services/
    ├── __init__.py
    └── analizador_TRL.py     # Lógica de análisis TRL con Gemini
```

## 🔧 Requisitos Previos

1. **Python 3.11+** (para desarrollo local sin Docker)
2. **Docker y Docker Compose** (para containerización)
3. **Google Cloud SDK** instalado y configurado
4. **Credenciales de Google Cloud** configuradas

### Configurar Google Cloud Credentials

```bash
# Instalar gcloud CLI
# https://cloud.google.com/sdk/docs/install

# Autenticarse
gcloud auth login

# Configurar Application Default Credentials (ADC)
gcloud auth application-default login

# Configurar proyecto
gcloud config set project tesis-475602
```

## 🏃 Inicio Rápido

### Opción 1: Con Docker Compose (Recomendado)

```bash
# 1. Clonar/ubicarse en el directorio
cd microservicio-gemini

# 2. Copiar y configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# 3. Construir y ejecutar
docker-compose up --build

# El servicio estará disponible en http://localhost:5000
```

### Opción 2: Local sin Docker

```bash
# 1. Crear entorno virtual
python -m venv venv

# 2. Activar entorno virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Copiar y configurar .env
cp .env.example .env

# 5. Ejecutar
python main.py
# O con uvicorn:
uvicorn main:app --host 0.0.0.0 --port 5000 --reload
```

## 📡 Endpoints

### 1. Root
```
GET /
```
Retorna información básica del servicio.

### 2. Health Check
```
GET /health
```
Verifica que el servicio esté funcionando y muestra configuración.

**Respuesta:**
```json
{
  "status": "healthy",
  "project_id": "tesis-475602",
  "model_id": "gemini-2.0-flash"
}
```

### 3. Analizar Documento Tecnológico
```
POST /analizar
Content-Type: multipart/form-data
```

**Parámetros:**
- `file`: Archivo PDF del documento tecnológico (multipart/form-data)

**Respuesta exitosa:**
```json
{
  "success": true,
  "table_text": "=== ANÁLISIS TRL ===\n\nTRL ALCANZADO: TRL 5\n\nEVIDENCIAS:\n- TRL 1: Cumplido (85/100)\n- TRL 2: Cumplido (75/100)\n...",
  "error": null
}
```

**Respuesta con error:**
```json
{
  "success": false,
  "table_text": null,
  "error": "Descripción del error"
}
```

## 🧪 Probar el Servicio

### Con cURL

```bash
# Health check
curl http://localhost:5000/health

# Analizar PDF
curl -X POST http://localhost:5000/analizar \
  -F "file=@/ruta/al/documento_tecnologico.pdf"
```

### Con Python (requests)

```python
import requests

# Analizar PDF
url = "http://localhost:5000/analizar"
files = {"file": open("documento_tecnologico.pdf", "rb")}
response = requests.post(url, files=files)
result = response.json()

if result["success"]:
    print("Informe TRL:")
    print(result["table_text"])
else:
    print("Error:", result["error"])
```

### Con Swagger UI

Abre en tu navegador:
```
http://localhost:5000/docs
```

## 🔐 Configuración

El archivo `.env` contiene las siguientes variables:

```env
# Google Cloud Configuration
PROJECT_ID=tesis-475602
REGION=us-central1
MODEL_ID=gemini-2.0-pro

# API Configuration
API_HOST=0.0.0.0
API_PORT=5000
DEBUG=False

# CORS (ajusta según tu backend)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080
```

## 🐳 Docker

### Construir imagen

```bash
docker build -t microservicio-gemini .
```

### Ejecutar contenedor

```bash
docker run -p 5000:5000 \
  -v ~/.config/gcloud:/root/.config/gcloud:ro \
  --env-file .env \
  microservicio-gemini
```

### Con Docker Compose

```bash
# Iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

## 🚀 Despliegue en Google Cloud

### Cloud Run (Recomendado)

```bash
# 1. Configurar proyecto
gcloud config set project tesis-475602

# 2. Habilitar APIs necesarias
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable aiplatform.googleapis.com

# 3. Desplegar
gcloud run deploy microservicio-trl \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 5000 \
  --set-env-vars PROJECT_ID=tesis-475602,REGION=us-central1,MODEL_ID=gemini-2.0-flash
```

## 🛠️ Desarrollo

### Agregar dependencias

```bash
pip install <paquete>
pip freeze > requirements.txt
```

### Ejecutar en modo desarrollo

```bash
# Con reload automático
uvicorn main:app --reload --port 5000
```

## 📝 Notas Importantes

1. **Credenciales**: El servicio usa Application Default Credentials (ADC) de Google Cloud
2. **CORS**: Configura `ALLOWED_ORIGINS` en `.env` según los orígenes de tu backend/frontend
3. **Límite de tamaño**: PDFs están limitados a 10MB por defecto
4. **Timeout**: Las peticiones a Gemini tienen timeout de 300 segundos (5 minutos)
5. **Modelo**: Usa `gemini-2.0-pro` para análisis TRL más precisos
6. **Matrices TRL**: Los archivos en `datTRL/` contienen las matrices oficiales de evaluación

## 🐛 Troubleshooting

### Error de credenciales

```
Error obteniendo credenciales ADC
```

**Solución:**
```bash
gcloud auth application-default login
```

### Error de permisos

```
Vertex AI error 403
```

**Solución:** Verificar que tu cuenta tenga permisos para Vertex AI
```bash
gcloud projects add-iam-policy-binding tesis-475602 \
  --member="user:tu-email@gmail.com" \
  --role="roles/aiplatform.user"
```

### Puerto en uso

```
Address already in use
```

**Solución:** Cambiar el puerto en `.env` o detener el proceso que usa el puerto 5000

## 📄 Licencia

Este proyecto es parte de una tesis académica.

## 👤 Autor

Desarrollado para el proyecto de tesis TRL.
