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
    *   **Option 1:** Run the complete schema from `additionaltable.sql`:
    ```bash
    psql -U postgres -d taskmate -f additionaltable.sql
    ```
    
    *   **Option 2:** Run the SQL manually (see below for complete schema with all columns):

    ```sql
    CREATE TABLE users (
        userid SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        profilepicture TEXT DEFAULT NULL,
        theme VARCHAR(50) DEFAULT 'light',
        emailnotifications BOOLEAN DEFAULT true,
        language VARCHAR(10) DEFAULT 'en',
        createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE categories (
        categoryid SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        color VARCHAR(50),
        userid INT NOT NULL,
        createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE
    );

    CREATE TABLE tasks (
        taskid SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        duedate TIMESTAMP,
        priority VARCHAR(50) DEFAULT 'Medium',
        status VARCHAR(50) DEFAULT 'Pending',
        userid INT NOT NULL,
        categoryid INT NULL,
        createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE,
        FOREIGN KEY (categoryid) REFERENCES categories(categoryid) ON DELETE SET NULL
    );

    CREATE TABLE tags (
        tagid SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        userid INT NOT NULL,
        createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE
    );

    CREATE TABLE task_tags (
        taskid INT NOT NULL,
        tagid INT NOT NULL,
        PRIMARY KEY (taskid, tagid),
        FOREIGN KEY (taskid) REFERENCES tasks(taskid) ON DELETE CASCADE,
        FOREIGN KEY (tagid) REFERENCES tags(tagid) ON DELETE CASCADE
    );

    -- Create indexes for performance
    CREATE INDEX idx_tasks_userid ON tasks(userid);
    CREATE INDEX idx_tasks_categoryid ON tasks(categoryid);
    CREATE INDEX idx_tasks_duedate ON tasks(duedate);
    CREATE INDEX idx_categories_userid ON categories(userid);
    CREATE INDEX idx_tags_userid ON tags(userid);
    CREATE INDEX idx_users_email ON users(email);
    ```

---

### **3. Back-End Setup**

1.  **Navigate to the Backend Directory:**
    ```bash
    cd backend
    ```

2.  **Configure Environment Variables:**
    *   Create a `.env` file in the `backend` directory (if it doesn't exist).
    *   Update the `DB_PASSWORD` with your PostgreSQL user's password.
    *   Change `JWT_SECRET` to a long, random, and secret string.
    ```
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=taskmate
    DB_USER=postgres
    DB_PASSWORD=your_actual_postgres_password
    JWT_SECRET=replace_this_with_a_very_secret_key
    PORT=5000
    ```
    
    **Note:** See `database_credentials.txt` in the root directory for reference.

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

---

### **6. Application Features**

Once logged in, you can:

*   **Task Management**
    *   Create, edit, and delete tasks
    *   Set due dates, priorities (Low/Medium/High), and status (Pending/In Progress/Completed)
    *   Generate QR codes for tasks (displays title, description, due date, priority, status)

*   **User Profile**
    *   Upload/delete profile picture (Base64, max 5MB)
    *   Change password (requires current password verification)
    *   Switch theme (Light/Dark mode)
    *   View user ID, name, and email

*   **Categories & Tags**
    *   Create and assign categories to tasks
    *   Create and assign tags to tasks

---

### **7. API Endpoints**

The backend API runs on `http://localhost:5000/api` with the following endpoints:

**Authentication**
*   `POST /auth/register` - Register new user
*   `POST /auth/login` - User login (returns JWT token)

**Users**
*   `GET /users/profile` - Get user profile (requires authentication)
*   `PUT /users/profile` - Update user profile (name, email, theme)
*   `POST /users/change-password` - Change password
*   `POST /users/upload-profile-picture` - Upload profile picture
*   `DELETE /users/profile-picture` - Delete profile picture

**Tasks**
*   `GET /tasks` - Get all user tasks
*   `POST /tasks` - Create new task
*   `PUT /tasks/:id` - Update task
*   `DELETE /tasks/:id` - Delete task
*   `GET /tasks/:id/qrcode` - Generate QR code for task

**Categories**
*   `GET /categories` - Get all user categories
*   `POST /categories` - Create new category

**Tags**
*   `GET /tags` - Get all user tags
*   `POST /tags` - Create new tag

---

### **8. Troubleshooting**

**Database Connection Issues:**
*   Verify PostgreSQL is running: `pg_isready -U postgres`
*   Check database exists: `psql -U postgres -l`
*   Verify credentials in `.env` file match your PostgreSQL setup

**Port Already in Use:**
*   Backend (5000): Change `PORT` in backend `.env` file
*   Frontend (3000): The app will prompt to use a different port

**npm install fails:**
*   Clear npm cache: `npm cache clean --force`
*   Delete `node_modules` and `package-lock.json`, then run `npm install` again

**Theme not applying:**
*   Clear browser cache and localStorage
*   Log out and log back in

---

### **9. Additional Files**

*   **`additionaltable.sql`** - Complete database schema with all tables and indexes
*   **`FOLDER_STRUCTURE.txt`** - Project structure overview
*   **`README.md`** - Project overview and features
