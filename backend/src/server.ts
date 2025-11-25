import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import db from './database/db';

const PORT = process.env.PORT || 5000;

class Server {
    public start() {
        // Test the database connection
        db.query('SELECT NOW()')
            .then(() => {
                app.listen(PORT, () => {
                    console.log(`Server is listening on port ${PORT}`);
                });
            })
            .catch(err => {
                console.error('Database connection error', err.stack);
            });
    }
}

const server = new Server();
server.start();
