# Frontend CRUD - Book Management Application

This is a **Book Management Application** built using **Angular 19.1.7** for the frontend and **Spring Boot** with **PostgreSQL** for the backend. It provides a complete CRUD (Create, Read, Update, Delete) functionality for managing books.

The frontend leverages modern Angular features along with **PrimeNG** components for an enhanced user interface and **PrimeFlex** for responsive layout management, minimizing the need for custom CSS.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Frontend Setup](#frontend-setup)
- [Backend Setup](#backend-setup)
- [Technologies Used](#technologies-used)

---

## Overview

This branch is used for the online deployment of the application. The application itself is the same as in the [simple-book-management](https://github.com/pablodiazjorge/crud-frontend/tree/simple) branch, but with environment variable configurations that enable secure deployment to the Vercel platform.

It integrates seamlessly with a Spring Boot backend connected to a PostgreSQL database for persistent cloud storage.

> ⚠️ **Note**: The deployment is hosted using free-tier plans. As a result, the backend server may go into hibernation after periods of inactivity. When this happens, the first request may take a couple of minutes to respond while the server starts up. If the data does not load initially, it is recommended to wait a couple of minutes until the server is ready.

---

## Features

### Live version
- **Environment Variables**: Configuration using Angular's `environment` folder and `dotenv`.
- **Deployment**: Uses Vercel with environment variables configuration to deploy the application.
- **Cloud Setup**: Uses Vercel for the frontend, Render for the backend API, and Neon for PostgreSQL.

### Book Management Features
- **Reactive Forms**: Utilizes Angular's reactive forms for robust form handling and validation.
- **Global Toast Notifications**: Implements centralized toast messages for user feedback.
- **Responsive Design**: Uses PrimeFlex for a responsive and adaptable layout.
- **Error Handling**: Provides clear error messages for invalid inputs or failed operations.
- **Create Functionality**: Includes a create button to create new books.
- **Delete Functionality**: Includes a delete button for each book card to remove that book.
- **Edit Functionality**: Includes an edit button for each book card to update that book.

---

## Frontend Setup

The frontend application is deployed on Vercel:  
🔗 [basic-book-management-demo](https://crud-frontend-pablodiazjorges-projects.vercel.app/)

## Backend Setup

The backend is implemented using **Spring Boot** and handles all REST API endpoints for the CRUD operations.  
To view the backend repository, visit:  
🔗 [simple-book-management-backend](https://github.com/pablodiazjorge/crud-backend/tree/docker-simple-demo)

> ⚠️ **Note**: As mentioned before, the deployment is hosted using free-tier plans. As a result, the backend server may go into hibernation after periods of inactivity. When this happens, the first request may take a couple of minutes to respond while the server starts up. If the data does not load initially, it is recommended to wait a couple of minutes until the server is ready.

---

## Technologies Used

### Frontend

- Angular 19.1.7
- PrimeNG
- PrimeFlex
- Reactive Forms
- HttpClient (for API communication)
- Dotenv
- Vercel (deployment)

### Backend

- Spring Boot
- Spring Data JPA
- Hibernate
- Docker
- Render (deployment)

### Database

- PostgreSQL
- Neon (deployment)
