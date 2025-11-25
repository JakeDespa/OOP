import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mainRouter from './routes';

dotenv.config();

class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.configure();
        this.routes();
    }

    private configure(): void {
        const corsOptions = {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        };
        this.app.use(cors(corsOptions));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private routes(): void {
        this.app.use('/api', mainRouter);
        this.app.get('/', (req, res) => {
            res.send('TaskMate API is running...');
        });
    }
}

export default new App().app;
