# KudosHub Specification

# Project Overview

KudosHub is an internal employee recognition platform that enables employees to publicly recognize and appreciate their colleagues. Employees can send kudos messages, view recent recognitions on a dashboard, and administrators can moderate inappropriate content.

---

# Functional Requirements

## User Stories

### User Story 1

As an employee,
I want to select another employee,
So that I can send them a kudos message.

### Acceptance Criteria

- Employee can search and select another employee.
- Employee can enter a message (maximum 500 characters).
- Kudos is saved successfully.
- Sender and recipient are recorded.

---

### User Story 2

As an employee,
I want to view a public feed,
So that I can see recent employee recognitions.

### Acceptance Criteria

- Feed displays only visible kudos.
- Feed is ordered by newest first.
- Displays sender, receiver, message and timestamp.

---

### User Story 3 (Content Moderation)

As an administrator,
I want to hide or delete inappropriate kudos,
So that inappropriate content is removed from the public feed.

### Acceptance Criteria

- Admin can view all kudos.
- Admin can hide kudos.
- Admin can restore hidden kudos.
- Admin can permanently delete kudos.
- Hidden kudos are excluded from the public feed.

---

# Non-Functional Requirements

- Secure authentication using JWT
- Responsive user interface
- Input validation
- Password hashing using bcrypt
- Role-based access control
- Scalable architecture
- Error logging
- API validation

---

# Technical Design

## Backend

- Node.js
- Express.js
- Prisma ORM
- MySQL

### Architecture

- MVC Pattern
- Controllers
- Routes
- Services
- Middleware
- Validators
- Utilities

---

## Frontend

- React
- Vite
- Tailwind CSS
- Axios
- React Router

---

# Database Design

## Users

| Field | Type |
|------|------|
| id | Integer |
| name | String |
| email | String |
| password | String |
| role | Enum |
| department | String |
| createdAt | DateTime |

---

## Kudos

| Field | Type |
|------|------|
| id | Integer |
| senderId | Integer |
| receiverId | Integer |
| message | Text |
| createdAt | DateTime |
| isVisible | Boolean (Default: true) |
| moderatedBy | Integer |
| moderatedAt | DateTime |
| moderationReason | String |

---

## Notifications

- id
- userId
- message
- isRead
- createdAt

---

## ModerationLogs

- id
- kudosId
- adminId
- action
- reason
- createdAt

---

# API Endpoints

## Authentication

POST /api/auth/register

POST /api/auth/login

POST /api/auth/logout

GET /api/auth/me

---

## Users

GET /api/users

GET /api/users/:id

GET /api/users/departments

---

## Kudos

POST /api/kudos

GET /api/kudos/feed

GET /api/kudos/sent

GET /api/kudos/received

---

## Admin

PATCH /api/admin/kudos/:id/hide

PATCH /api/admin/kudos/:id/restore

DELETE /api/admin/kudos/:id

GET /api/admin/moderation

---

# Frontend Components

- Login
- Register
- Dashboard
- Employee List
- Send Kudos
- Kudos Feed
- Profile
- Admin Dashboard
- Moderation Panel

---

# Security

- JWT Authentication
- bcrypt Password Hashing
- Role-Based Access Control
- Input Validation
- SQL Injection Protection
- XSS Prevention
- Rate Limiting

---

# Implementation Plan

## Phase 1

- Project Setup
- Database
- Prisma
- Authentication

## Phase 2

- Employee Module
- Kudos Module

## Phase 3

- Admin Moderation

## Phase 4

- Testing
- Documentation
- Deployment

---

# Approval

The specification has been reviewed and approved.

Changes introduced during refinement:

- Added administrator moderation requirements.
- Added `isVisible` field to the Kudos table.
- Added moderation logging fields.
- Expanded API and implementation plan.

The approved specification will be used as the blueprint for implementation.