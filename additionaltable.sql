ALTER TABLE users ADD COLUMN profilepicture TEXT DEFAULT NULL;
-- Add theme preference column (light/dark)
ALTER TABLE users ADD COLUMN theme VARCHAR(50) DEFAULT 'light';

-- Add email notifications preference column
ALTER TABLE users ADD COLUMN emailnotifications BOOLEAN DEFAULT true;

-- Add language preference column
ALTER TABLE users ADD COLUMN language VARCHAR(10) DEFAULT 'en';

ALTER TABLE tasks ADD COLUMN categoryid INT NULL;
ALTER TABLE tasks ADD CONSTRAINT fk_category FOREIGN KEY (categoryid) REFERENCES categories(categoryid);
