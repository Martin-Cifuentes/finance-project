@echo off
echo ===================================================
echo   Iniciando Fintech MVP - Preparacion y Ejecucion
echo ===================================================

echo [1/3] Levantando base de datos en Docker...
cd finance-project-db
docker-compose down
docker-compose up -d
cd ..

echo [2/3] Configurando el Backend (Python / FastAPI)...
cd finance-project-back
if not exist venv (
    echo Creando entorno virtual venv...
    python -m venv venv
)
echo Instalando dependencias del Backend...
call venv\Scripts\activate
pip install -r requirements.txt
cd ..

echo [3/3] Configurando el Frontend (Next.js)...
cd finance-project-front
echo Instalando dependencias del Frontend...
call npm install
cd ..

echo ===================================================
echo   Ejecutando Backend y Frontend en paralelo...
echo ===================================================

start "FastAPI Backend" cmd /k "cd finance-project-back && call venv\Scripts\activate && uvicorn main:app --reload --port 8000"
start "Next.js Frontend" cmd /k "cd finance-project-front && npm run dev"

echo Todo listo! La aplicacion se esta iniciando...
echo Frontend disponible en: http://localhost:3000
echo Backend disponible en: http://localhost:8000
