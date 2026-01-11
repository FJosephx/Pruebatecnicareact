# Mini ecommerce

Proyecto de prueba tecnica con React + TypeScript en el frontend y Django en el backend.

## Estructura
- `frontend/`: React + TypeScript (Vite)
- `backend/`: Django

## Requisitos
- Node.js 18+ (o 20+)
- Python 3.10+ y pip

## Instalacion y ejecucion

### Backend
```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Crear `frontend/.env` con el endpoint del backend:
```
VITE_API_URL=http://localhost:8000
```

## Endpoints
- `GET /products`: lista productos desde la base de datos.
- `POST /cart`: guarda un carrito con productos y cantidades.

Payload esperado para `/cart`:
```json
{
  "items": [
    { "product_id": 1, "quantity": 2 }
  ]
}
```

## Descripcion tecnica
- Estado global del carrito con Context y persistencia en `localStorage`.
- UI de listado con boton "Agregar al carrito".
- Carrito con cantidades editables, subtotal, total y eliminacion.
- Guardado del carrito en backend con confirmacion en UI.
- Base de datos SQLite por defecto (`backend/db.sqlite3`).

Frontend con Jest + React Testing Library y tests básicos para listado y carrito: jest.config.cjs, setupTests.ts, ProductsPage.test.tsx, CartPage.test.tsx, y deps en package.json.
Backend con pytest + pytest-django y tests para /products y /cart: test_products.py, test_carts.py, pytest.ini, y deps en requirements.txt.
Commits

agregar tests de frontend con jest
agregar tests de backend con pytest
Cómo correrlos

Frontend:
cd frontend
npm install
npm test
Backend:
cd backend
pip install -r requirements.txt
pytest