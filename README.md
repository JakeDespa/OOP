# TaskMate - Task Management Application

## Overview
A full-stack task management web application built with React (TypeScript) and Express.js (TypeScript), using PostgreSQL. Implements Object-Oriented Programming principles with Repository Pattern and Service Layer architecture.

## Features
- **User Authentication** - JWT tokens with bcrypt password hashing
- **Task Management** - CRUD operations with due dates, priorities, and status tracking
- **Categories & Tags** - Task organization system
- **User Profile** - Profile pictures, password management, theme preferences (light/dark mode)
- **QR Code Generation** - Task details encoded in scannable QR codes
- **Responsive UI** - Bootstrap 5 responsive design

## Tech Stack
**Frontend:** React 18, TypeScript, React Router, Bootstrap 5, Axios  
**Backend:** Node.js, Express.js, TypeScript, PostgreSQL, JWT, bcrypt, QR Code  

## Project Structure
```
OOP-Final-Project/
├── frontend/               # React TypeScript application
├── backend/                # Express TypeScript server
├── additionaltable.sql     # Complete database schema
├── SETUP.md               # Setup instructions
├── dbtaskmate.sql
└── README.md
```

## OOP Design Patterns
- **Repository Pattern** - BaseRepository with generic CRUD operations
- **Service Layer** - Business logic separated from controllers
- **Model Classes** - TypeScript classes for entities (User, Task, Category, Tag)
- **Dependency Injection** - Services injected into controllers

## Security Features
- JWT token-based authentication
- bcrypt password hashing
- Protected routes with authentication middleware
- Input validation and sanitization

## Database
PostgreSQL with 5 tables: users, tasks, categories, tags, task_tags. See `additionaltable.sql` for schema.

---
**Author:** Jake Despa  
**Date:** December 2025
