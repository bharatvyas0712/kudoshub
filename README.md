# KudosHub

KudosHub is a production-ready employee recognition system built with React, Vite, Express, Prisma, MySQL, and JWT authentication.

## What Is Included

- Authentication with register, login, logout, and session hydration
- Employee directory, profile editing, and image upload support
- Kudos creation, public feed, sent kudos, and received kudos views
- Dashboard metrics and charts
- Toast notifications, loading states, skeletons, dark mode, and responsive UI
- Backend security hardening with Helmet, CORS, Morgan logging, sanitization, and rate limiting
- Production deployment scaffolding with Docker and Nginx

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hook Form
- Express.js
- Prisma ORM
- MySQL
- JWT
- bcrypt

## Local Development

1. Copy `.env.example` to `backend/.env` and update the values.
2. Install dependencies in the root, `backend`, and `frontend` packages.
3. Run `npm run dev:backend` and `npm run dev:frontend` from the workspace root.

## Production Deployment

The repository includes Dockerfiles for both apps and a root `docker-compose.yml` for a containerized setup.

1. Build the images with `docker compose build`.
2. Start the stack with `docker compose up -d`.
3. Point the backend to a reachable MySQL database if you are not using the bundled compose database service.

## Screenshots

See `docs/screenshots/README.md` for the screenshot placeholders that can be filled in later.

## Notes

The current implementation is intentionally structured for production handoff: reusable UI primitives, guarded routes, backend error handling, and deployment-friendly defaults are already in place.
