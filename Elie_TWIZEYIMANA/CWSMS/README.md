# Car Washing Sales Management System (CWSMS)

A complete beginner-friendly full-stack system for SmartPark to manage:
- Cars
- Wash packages
- Service records
- Payments
- Reports by date

## 1) Project Structure

```text
CWSMS/
  database/
    cwsms.sql
  backend/
    app.js
    server.js
    .env.example
    config/
    controllers/
    middlewares/
    models/
    routes/
  frontend/
    index.html
    src/
```

## 2) Database Setup (MySQL)

1. Open MySQL terminal or MySQL Workbench.
2. Run the SQL script:

```sql
SOURCE path/to/CWSMS/database/cwsms.sql;
```

If `SOURCE` is not available in your tool, copy and run the script content manually from `database/cwsms.sql`.

## 3) Backend Setup (Node.js + Express)

1. Open terminal:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file from example:

```bash
copy .env.example .env
```

4. Edit `.env` and set your real MySQL password.
5. Set a session secret and frontend origin in `.env`:

```bash
SESSION_SECRET=replace_with_long_random_secret
CLIENT_ORIGIN=http://localhost:5173
```

6. Start backend server:

```bash
npm run dev
```

Backend will run on: `http://localhost:5000`

Default login after importing SQL:
- Email: `admin@smartpark.local`
- Password: `admin123`

## 4) Frontend Setup (React + Tailwind)

1. Open a second terminal:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Run frontend:

```bash
npm run dev
```

Frontend URL is shown in terminal (usually `http://localhost:5173`).

## 5) API Endpoints

### Cars
- `GET /api/cars`
- `POST /api/cars`
- `PUT /api/cars/:id`
- `DELETE /api/cars/:id`

### Packages
- `GET /api/packages`
- `POST /api/packages` (admin only)
- `PUT /api/packages/:id` (admin only)
- `DELETE /api/packages/:id` (admin only)

### Service Packages
- `GET /api/service-packages`
- `POST /api/service-packages`
- `PUT /api/service-packages/:id`
- `DELETE /api/service-packages/:id`

### Payments
- `GET /api/payments`
- `POST /api/payments`
- `PUT /api/payments/:id`
- `DELETE /api/payments/:id`

### Reports
- `GET /api/reports?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`

### Auth (Session Based)
- `POST /api/auth/register` (admin only, must be logged in)
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

## 6) Notes for Beginners

- Primary keys identify each row uniquely (example: `PlateNumber`, `PackageNumber`).
- Foreign keys connect related tables (example: payment -> service record).
- The frontend calls backend APIs using Axios in `frontend/src/services/api.js`.
- All UI components use React functional components and hooks (`useState`, `useEffect`).
