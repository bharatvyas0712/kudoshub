# API Documentation

## Authentication Endpoints

- `POST /api/auth/register` - Register a new employee account
- `POST /api/auth/login` - Log in and receive a JWT
- `POST /api/auth/logout` - Clear the client session
- `GET /api/auth/me` - Return the current authenticated user

## Protected Role Routes

- `GET /api/users/me` - Employee profile route
- `GET /api/admin/me` - Admin-only profile route
- `GET /api/dashboard/overview` - Authenticated dashboard overview

Kudos endpoints are intentionally not documented yet.
