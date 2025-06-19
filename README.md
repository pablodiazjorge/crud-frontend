# Frontend CRUD - Advanced Book Management Application

This is an **Advanced Book Management Application** built using **Angular 19.1.7** for the frontend and **Spring Boot** with **PostgreSQL** for the backend. It provides an enhanced user experience with complete CRUD (Create, Read, Update, Delete) functionalities, improved UI/UX, and additional features for better usability and maintainability.

The frontend leverages modern Angular features along with **PrimeNG** components for an enhanced user interface and **PrimeFlex** for responsive layout management, minimizing the need for custom CSS.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Technologies Used](#technologies-used)

---

## Overview

This branch is used for the online deployment of the application. The application itself is the same as in the [advanced-book-management](https://github.com/pablodiazjorge/crud-frontend/tree/advanced) branch, but with environment variable configurations that enable secure deployment to the Vercel platform.

It integrates seamlessly with a Spring Boot backend connected to a PostgreSQL database and Cloudinary API for persistent cloud storage.

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
- **Advanced Search & Filtering**: Users can filter books by title, author, or price range.
- **Sorting & Pagination**: Ensures smooth browsing and management of large datasets.
- **Confirmation Dialogs**: Prevents accidental deletions with confirmation prompts.

---

## Backend Setup

The backend is implemented using **Spring Boot** and handles all REST API endpoints for the CRUD operations. Ensure the backend is running before starting the frontend.

To set up the backend, check this repository: https://github.com/pablodiazjorge/crud-backend/tree/advanced

---

## Frontend Setup

The frontend application is deployed on Vercel:  
🔗 [advanced-book-management-demo](https://book-management-advanced-pablodiazjorges-projects.vercel.app/)


## Technologies Used

- **Frontend**:
  - Angular 19.1.7
  - PrimeNG
  - PrimeFlex
  - Reactive Forms
  - HttpClient for API communication
  - ngx-pagination for pagination support
  - Dotenv
  - Vercel (deployment)

- **Backend**:
  - Spring Boot
  - Spring Data JPA
  - Hibernate
  - Cloudinary API
  - Docker
  - Render (deployment)

- **Database**:
  - PostgreSQL
  - Neon (deployment)
