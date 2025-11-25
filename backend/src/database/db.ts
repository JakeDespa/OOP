import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

class Database {
    private static instance: Database;
    private pool: Pool;

    private constructor() {
        this.pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT),
        });

        this.pool.on('connect', () => {
            console.log('Connected to the database');
        });

        this.pool.on('error', (err) => {
            console.error('Unexpected error on idle client', err);
            process.exit(-1);
        });
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public async query(text: string, params?: any[]): Promise<any> {
        const start = Date.now();
        const res = await this.pool.query(text, params);
        const duration = Date.now() - start;
        console.log('executed query', { text, duration, rows: res.rowCount });
        return res;
    }

    public getClient() {
        return this.pool.connect();
    }
}

export default Database.getInstance();
