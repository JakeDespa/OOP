# TaskMate Setup Instructions

This document provides the instructions to set up and run the TaskMate full-stack application.

**IMPORTANT NOTE:** The development environment could not run `npm` commands directly. You **must** follow the installation steps below for the application to work.

---

### **1. Prerequisites**

*   **Node.js & npm:** Make sure you have Node.js (which includes npm) installed. You can download it from [nodejs.org](https://nodejs.org/).
*   **PostgreSQL:** You need a running instance of PostgreSQL. You can download it from [postgresql.org](https://www.postgresql.org/download/).

---

### **2. Database Setup**

1.  **Create a Database:**
    *   Open your PostgreSQL admin tool (like `psql` or pgAdmin).
    *   Create a new database named `taskmate`.
    ```sql
    CREATE DATABASE taskmate;
    ```

2.  **Create Tables:**
    *   Connect to the `taskmate` database.
    *   Run the following SQL script to create the necessary tables.

    ```sql
    CREATE TABLE users (
        userID SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE tasks (
        taskID SERIAL PRIMARY KEY,
        userID INTEGER NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        dueDate DATE,
        priority VARCHAR(50) DEFAULT 'Medium',
        status VARCHAR(50) DEFAULT 'Pending',
        createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE
    );

    CREATE TABLE categories (
        categoryID SERIAL PRIMARY KEY,
        userID INTEGER NOT NULL,
        name VARCHAR(255) NOT NULL,
        color VARCHAR(50),
        FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE
    );

    CREATE TABLE tags (
        tagID SERIAL PRIMARY KEY,
        userID INTEGER NOT NULL,
        name VARCHAR(255) NOT NULL,
        FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE
    );

    -- Optional: Junction table for many-to-many relationship between tasks and tags
    CREATE TABLE task_tags (
        taskID INTEGER NOT NULL,
        tagID INTEGER NOT NULL,
        PRIMARY KEY (taskID, tagID),
        FOREIGN KEY (taskID) REFERENCES tasks(taskID) ON DELETE CASCADE,
        FOREIGN KEY (tagID) REFERENCES tags(tagID) ON DELETE CASCADE
    );
    ```

---

### **3. Back-End Setup**

1.  **Navigate to the Backend Directory:**
    ```bash
    cd backend
    ```

2.  **Configure Environment Variables:**
    *   Open the `.env` file in the `backend` directory.
    *   Update the `DB_PASSWORD` with your PostgreSQL user's password.
    *   Change `JWT_SECRET` to a long, random, and secret string.
    ```
    DB_USER=postgres
    DB_HOST=localhost
    DB_DATABASE=taskmate
    DB_PASSWORD=your_actual_postgres_password
    DB_PORT=5432

    JWT_SECRET=replace_this_with_a_very_secret_key
    PORT=5000
    ```

3.  **Install Dependencies (Required):**
    ```bash
    npm install
    ```

4.  **Run the Back-End Server:**
    ```bash
    npm run dev
    ```
    The back-end API should now be running on `http://localhost:5000`.

---

### **4. Front-End Setup**

1.  **Navigate to the Frontend Directory:**
    *   Open a **new terminal** or navigate back to the root and into the frontend.
    ```bash
    cd frontend
    ```

2.  **Install Dependencies (Required):**
    ```bash
    npm install
    ```

3.  **Run the Front-End Application:**
    ```bash
    npm start
    ```
    The React application will open in your browser at `http://localhost:3000`.

---

### **5. Usage**

*   Open your browser to `http://localhost:3000`.
*   Register a new user account.
*   Log in with your new credentials.
*   You can now manage your tasks using the TaskMate application.
