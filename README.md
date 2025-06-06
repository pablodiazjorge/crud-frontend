# Frontend CRUD - Advanced Book Management Application

This is an **Advanced Book Management Application** built using **Angular 19.1.7** for the frontend and **Spring Boot** with **PostgreSQL** for the backend. It provides an enhanced user experience with complete CRUD (Create, Read, Update, Delete) functionalities, improved UI/UX, and additional features for better usability and maintainability.

The frontend leverages modern Angular features along with **PrimeNG** components for an enhanced user interface and **PrimeFlex** for responsive layout management, minimizing the need for custom CSS.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Backend Setup](#backend-setup)
- [Database Structure](#database-structure)
- [Running the Application](#running-the-application)
- [Application URLs](#application-urls)
- [Technologies Used](#technologies-used)

---

## Overview

This application allows users to perform the following operations:
- View a list of books with enhanced UI components.
- Add new books with validation and form enhancements.
- Edit existing books with an improved editing experience.
- Delete books with confirmation dialogs.
- Search and filter books dynamically.
- Pagination for better performance on large datasets.
- Sort books based on different attributes.

It integrates seamlessly with a Spring Boot backend that connects to a PostgreSQL database for persistent storage.

---

## Features

- **Reactive Forms**: Utilizes Angular's reactive forms for robust form handling and validation.
- **Global Toast Notifications**: Implements centralized toast messages for user feedback.
- **Responsive Design**: Uses PrimeFlex for a responsive and adaptable layout.
- **Error Handling**: Provides clear error messages for invalid inputs or failed operations.
- **Advanced Search & Filtering**: Users can filter books by title, author, or price range.
- **Sorting & Pagination**: Ensures smooth browsing and management of large datasets.
- **Confirmation Dialogs**: Prevents accidental deletions with confirmation prompts.

---

## Getting Started

### Prerequisites

Before running the application, ensure you have the following installed:

- **Angular CLI** (v19+)
- **Node.js** (v18+)
- **Java Development Kit (JDK)** (v17+)
- **Maven** (for building the Spring Boot backend)
- **PostgreSQL** (for the database)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/pablodiazjorge/crud-advanced-frontend
   ```

2. Navigate to the project directory:
   ```bash
   cd crud-advanced-frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

#### Frontend Configuration

- Open the `book.service.ts` file located in the `src/app/services` folder.
- Update the API base URL to match your backend server:
  ```typescript
  export class BookService {
  private apiUrl = 'http://localhost:8080/book'; // Adjust this URL if your backend runs on a different host or port
  };
  ```

#### Backend Configuration

- Locate the `application.properties` file in the backend project.
- Configure the database connection details:
  ```properties
  spring.datasource.url=jdbc:postgresql://localhost:5432/your-database-name
  spring.datasource.username=your-username
  spring.datasource.password=your-password
  spring.jpa.hibernate.ddl-auto=update
  ```

- Locate the `BookController.java` file in the backend project.
- Configure the host/port to match the frontend:
  ```properties
  @CrossOrigin("http://localhost:4200/")
  ```

---

## Backend Setup

The backend is implemented using **Spring Boot** and handles all REST API endpoints for the CRUD operations. Ensure the backend is running before starting the frontend.

To set up the backend, check this repository: https://github.com/pablodiazjorge/crud-backend/tree/advanced

---

## Database Structure

The database schema is managed by the backend using JPA entities. Below is the structure of the `Book` entity:

```java
public class Book {
    private Long id;
    private String title;
    private String author;
    private Integer pages;
    private Double price;
    private String genre;
    private String publicationDate;
}
```

Ensure the database connection settings in `application.properties` are correctly configured to match your PostgreSQL instance.

---

## Running the Application

1. Start the backend server (as described above).
2. Start the frontend development server:
   ```bash
   ng serve
   ```
3. Open your browser and navigate to:
   ```
   http://localhost:4200/
   ```

---

## Application URLs

- **Frontend**: `http://localhost:4200/`
- **Backend**: `http://localhost:8080/`

> **Note**: If you're using a different host or port for either the frontend or backend, make sure to adjust the URLs accordingly in the configuration files.

---

## Technologies Used

- **Frontend**:
  - Angular 19.1.7
  - PrimeNG
  - PrimeFlex
  - Reactive Forms
  - HttpClient for API communication
  - ngx-pagination for pagination support

- **Backend**:
  - Spring Boot
  - Spring Data JPA
  - Hibernate
  - Cloudinary API

- **Database**:
  - PostgreSQL
