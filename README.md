# Sistema de Gestión de Madurez Tecnológica (TRL) - ESPE

Este proyecto es una plataforma integral diseñada para gestionar y evaluar el nivel de madurez tecnológica (TRL) de proyectos de investigación, utilizando Inteligencia Artificial (Google Gemini) para el análisis automatizado de evidencias.

## 🏗️ Estructura del Proyecto

- **/Backend_TRL**: Servidor basado en Java 17+, Spring Boot y PostgreSQL.
- **/Frontend_TRL**: Aplicación web moderna en React + TypeScript y Vite.
- **/python_scripts**: Integración con Inteligencia Artificial y generación de reportes PDF.

---

## 🚀 Despliegue Local (Backend)

### Requisitos Previos
- **Java 17** o superior.
- **Maven** instalado.
- **PostgreSQL 14+**.
- **Python 3.10+** (con `pip`).

### Pasos
1. **Configurar la Base de Datos**:
   - Crea una base de datos llamada `trl_db` en PostgreSQL.
   - Ejecuta el script `init-db.sql` ubicado en la raíz del backend para crear las tablas y datos iniciales (Roles, Niveles TRL, Usuario Admin).

2. **Configurar Entorno Python**:
   - Ve a la carpeta `Backend_TRL/python_scripts`.
   - Instala las dependencias necesarias:
     ```bash
     pip install google-genai fpdf2 sqlalchemy psycopg2-binary python-dotenv
     ```

3. **Variables de Entorno**:
   - Ajusta el archivo `src/main/resources/application.properties` con tus credenciales de base de datos y secreto JWT.

4. **Ejecutar**:
   ```bash
   mvn spring-boot:run
   ```
   El servidor iniciará en `http://localhost:8081`.

---

## 💻 Despliegue Local (Frontend)

### Requisitos Previos
- **Node.js** (v18+ recomendado).
- **npm** o **yarn**.

### Pasos
1. Ve a la carpeta `Frontend_TRL`.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia la aplicación en modo desarrollo:
   ```bash
   npm run dev
   ```
   Accede vía `http://localhost:5173`.

---

## ☁️ Despliegue en Vercel (Frontend)

Vercel es la plataforma recomendada para hospedar el frontend de React de manera gratuita y eficiente.

### Pasos para desplegar:
1. **Subir a GitHub**: Asegúrate de que el código del frontend esté en un repositorio de GitHub (puedes subir la carpeta `Frontend_TRL` como un repo independiente o todo el proyecto).
2. **Importar en Vercel**:
   - Inicia sesión en [Vercel](https://vercel.com/).
   - Haz clic en **"Add New"** > **"Project"**.
   - Selecciona tu repositorio de GitHub.
3. **Configuración del Proyecto**:
   - **Framework Preset**: Selecciona `Vite`.
   - **Root Directory**: Si el frontend está en una subcarpeta, selecciona `Frontend_TRL`.
   - **Build Command**: `npm run build`.
   - **Output Directory**: `dist`.
4. **Variables de Entorno**:
   - Si tu frontend consume el backend en una URL distinta a `localhost`, asegúrate de configurar las variables de entorno necesarias (ej: `VITE_API_URL`) en la sección **Environment Variables** de Vercel.
5. **Deploy**: Haz clic en **Deploy**. ¡Vercel te dará una URL pública (ej: `proyecto-trl.vercel.app`)!

---

## 🛠️ Notas Adicionales

- **Análisis IA**: Asegúrate de que el backend tenga acceso a internet y una `GEMINI_API_KEY` válida configurada en `Backend_TRL/python_scripts/config/settings.py`.
- **Docker**: El proyecto incluye un archivo `docker-compose.yml` en el backend para levantar PostgreSQL rápidamente:
  ```bash
  docker-compose up -d
  ```

---
*Desarrollado para la Universidad de las Fuerzas Armadas ESPE.*
