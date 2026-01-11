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
- `GET /products/<id>`: detalle de producto.
- `POST /products/create`: crea producto (requiere staff).
- `POST /products/update`: actualiza producto (requiere staff).
- `POST /products/delete`: elimina producto (requiere staff).
- `POST /cart`: guarda un carrito con productos y cantidades (requiere login).
- `POST /cart/update`: actualiza carrito (requiere login).
- `POST /cart/delete`: elimina carrito (requiere login).
- `GET /carts`: lista carritos con filtros y paginacion (requiere login).
- `POST /auth/login`: inicia sesion.
- `POST /auth/logout`: cierra sesion.
- `GET /auth/me`: obtiene usuario actual.

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
- UI de listado con boton "Agregar al carrito" y detalles de producto.
- Carrito con cantidades editables, subtotal, total y eliminacion.
- Guardado del carrito en backend con confirmacion en UI.
- UI extra: skeletons de carga, toasts y empty states.
- Base de datos SQLite por defecto (`backend/db.sqlite3`).

## Tests
Frontend con Jest + React Testing Library:
```bash
cd frontend
npm test
```

Backend con pytest + pytest-django:
```bash
cd backend
pip install -r requirements.txt
pytest
```
