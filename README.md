# Ticketing Platform

## Frontend

```bash
cd frontend
npm i
npm run dev
```

## Backend

```bash
cd backend
npm i
```

Create a `.env` file in `backend/` with your PostgreSQL connection string:

```dotenv
DATABASE_URL=postgres://user:password@host:5432/postgres?sslmode=require
```

Then run:

```bash
npx prisma migrate dev --name init
npx prisma generate
npm run build
npm start
```

After `npm start`, seed sample data:

```bash
POST http://localhost:3000/tickets/seed
```
