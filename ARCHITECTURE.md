# Architecture Overview

This project is a small full-stack ticketing app with a React frontend and an Express + Prisma backend. The backend is intentionally thin: routes map directly to controllers, and controllers contain validation and data access via Prisma.

## 1) High-Level Architecture

### Frontend ↔ Backend
- The frontend uses an Axios instance (`frontend/src/service/index.ts`) with `baseURL` pointing to the backend (default `http://localhost:3000`).
- UI state is managed in React context (`frontend/src/context/ContextState.tsx` + `combineState.tsx`).
- Ticket data is fetched and paginated on the backend; the UI consumes the paginated response and supports “Load more” in `frontend/src/App.tsx`.

### Backend Layers / Modules
Current layering:
- Routes: `backend/src/routes/*` define endpoints and HTTP methods.
- Controllers: `backend/src/controllers/*` implement request validation, business rules, and Prisma calls.
- Data access: Prisma client in `backend/src/configs/prisma` (used directly in controllers).

There is no explicit service or repository layer today. That is a deliberate simplification for a small codebase. If the project grows, services/repositories can be introduced without changing the routes.

## 2) Data Model Decisions

### Ticket
`Ticket` is the primary aggregate. It contains:
- `title`, `description` with validation in the controller (min length).
- `status` and `priority` enums to standardize workflow and filtering.
- `createdAt`/`updatedAt` for sorting and change tracking.

### Comment
`Comment` is a child of `Ticket`:
- Each comment references a `ticketId` (many comments per ticket).
- The Prisma schema uses `onDelete: Cascade` so deleting a ticket removes its comments.
- An index on `ticketId` speeds up comment lookups by ticket.

This model supports common user flows: list tickets, view ticket details with comments, and add/delete comments.

## 3) Scalability Considerations

### Large Ticket List
The backend already supports:
- Pagination: `page` + `limit` with `skip/take`.
- Sorting: `newest`/`oldest` by `createdAt`.
The frontend supports incremental “Load more” based on pagination metadata.

### Search Performance
Current search uses `contains` on `title`/`description` (case-insensitive). For large datasets:
- Add full-text indexes in Postgres.
- Use a dedicated search column or external search system.
- Avoid large `contains` scans by introducing prefix or trigram indexes.

### Pagination
Current pagination is offset-based; for very large data:
- Consider cursor-based pagination (createdAt + id) to avoid large offset costs.

## 4) Reliability

### Error Handling
- Controllers wrap operations in `try/catch` and return `400` for validation errors, `404` for missing entities, `500` for unexpected errors.
- The frontend’s Axios interceptor reports network and server errors.

### Validation
Validation is done inline in controllers (length checks, enum validation, pagination limits).
If validation complexity grows, a schema validator (e.g., Zod/Joi) can centralize and standardize rules.

### Edge Cases
Handled today:
- Missing or invalid IDs.
- Invalid enum values (status/priority).
- Invalid pagination bounds.
- Ticket existence checks before create/delete comment or update/delete ticket.

## 5) Tradeoffs

### What’s intentionally skipped
- Service/repository layers: kept simple for now to reduce boilerplate.
- AuthN/AuthZ: no user system yet; requests are unauthenticated.
- Rate limiting, request logging, and observability: not included to keep the stack small.
- Advanced search and analytics: `contains` search is fine for small data but not optimized for scale.

### Why
This is a small, focused project where speed of iteration matters more than large-team scale. The current structure keeps the code easy to read, while leaving a clear path to introduce more layers and infrastructure if requirements grow.
