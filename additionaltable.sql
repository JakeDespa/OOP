-- ============================================
-- TaskMate Database Schema - Complete Setup
-- ============================================

-- Drop tables if they exist (in correct order to handle foreign keys)
DROP TABLE IF EXISTS task_tags CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- Create Users Table
-- ============================================
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

-- ============================================
-- Create Categories Table
-- ============================================
CREATE TABLE categories (
    categoryid SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(50),
    userid INT NOT NULL,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE
);

-- ============================================
-- Create Tasks Table
-- ============================================
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

-- ============================================
-- Create Tags Table
-- ============================================
CREATE TABLE tags (
    tagid SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    userid INT NOT NULL,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE
);

-- ============================================
-- Create Task_Tags Junction Table
-- ============================================
CREATE TABLE task_tags (
    taskid INT NOT NULL,
    tagid INT NOT NULL,
    PRIMARY KEY (taskid, tagid),
    FOREIGN KEY (taskid) REFERENCES tasks(taskid) ON DELETE CASCADE,
    FOREIGN KEY (tagid) REFERENCES tags(tagid) ON DELETE CASCADE
);

-- ============================================
-- Create Indexes for Performance
-- ============================================
CREATE INDEX idx_tasks_userid ON tasks(userid);
CREATE INDEX idx_tasks_categoryid ON tasks(categoryid);
CREATE INDEX idx_tasks_duedate ON tasks(duedate);
CREATE INDEX idx_categories_userid ON categories(userid);
CREATE INDEX idx_tags_userid ON tags(userid);
CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- Migration Script (if tables already exist)
-- ============================================
-- Use these ALTER statements if you already have tables and just need to add new columns:

-- ALTER TABLE users ADD COLUMN IF NOT EXISTS profilepicture TEXT DEFAULT NULL;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS theme VARCHAR(50) DEFAULT 'light';
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS emailnotifications BOOLEAN DEFAULT true;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'en';
-- ALTER TABLE tasks ADD COLUMN IF NOT EXISTS categoryid INT NULL;
-- ALTER TABLE tasks ADD CONSTRAINT IF NOT EXISTS fk_category FOREIGN KEY (categoryid) REFERENCES categories(categoryid) ON DELETE SET NULL;
