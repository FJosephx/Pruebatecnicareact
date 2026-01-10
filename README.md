# Mini ecommerce (base)

Estructura inicial del proyecto para la prueba tecnica.

## Estructura
- `frontend/` React + TypeScript (Vite)
- `backend/` Django (proyecto base)

## Requisitos
- Node.js 18+ (o 20+)
- Python 3.10+ y pip

## Primeros pasos

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
