@echo off
echo Starting Fintech MVP...

echo Starting Backend...
start cmd /k "cd finance-project-back && if not exist venv (python -m venv venv && call venv\Scripts\activate && pip install -r requirements.txt) else (call venv\Scripts\activate) && uvicorn main:app --reload --port 8000"

echo Starting Frontend...
start cmd /k "cd finance-project-front && npm install && npm run dev"

echo Both services are starting up!
