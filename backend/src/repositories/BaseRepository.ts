import db from '../database/db';

export abstract class BaseRepository<T> {
    protected tableName: string;
    protected idColumn: string;

    constructor(tableName: string, idColumn: string) {
        this.tableName = tableName;
        this.idColumn = idColumn;
    }

    async findAll(): Promise<T[]> {
        const { rows } = await db.query(`SELECT * FROM ${this.tableName}`);
        return rows;
    }

    async findById(id: number): Promise<T | null> {
        const { rows } = await db.query(`SELECT * FROM ${this.tableName} WHERE ${this.idColumn} = $1`, [id]);
        return rows[0] || null;
    }

    async create(item: Partial<T>): Promise<T> {
        const dbItem: { [key: string]: any } = {};
        // Convert all keys to lowercase for DB compatibility
        for (const key in item) {
            dbItem[key.toLowerCase()] = (item as any)[key];
        }

        // Remove the id column from the insert data
        if (this.idColumn in dbItem) {
            delete dbItem[this.idColumn];
        }
        
        const columns = Object.keys(dbItem);
        const values = Object.values(dbItem);
        const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

        const { rows } = await db.query(
            `INSERT INTO ${this.tableName} (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`,
            values
        );
        return rows[0];
    }

    async update(id: number, item: Partial<T>): Promise<T | null> {
        const dbItem: { [key: string]: any } = {};
        // Convert all keys to lowercase for DB compatibility
        for (const key in item) {
            dbItem[key.toLowerCase()] = (item as any)[key];
        }

        // Ensure the ID column is not in the SET clause
        if (this.idColumn in dbItem) {
            delete dbItem[this.idColumn];
        }

        const columns = Object.keys(dbItem);
        const values = Object.values(dbItem);
        const setString = columns.map((col, i) => `${col} = $${i + 2}`).join(', ');

        const { rows } = await db.query(
            `UPDATE ${this.tableName} SET ${setString} WHERE ${this.idColumn} = $1 RETURNING *`,
            [id, ...values]
        );
        return rows[0] || null;
    }

    async delete(id: number): Promise<boolean> {
        const { rowCount } = await db.query(`DELETE FROM ${this.tableName} WHERE ${this.idColumn} = $1`, [id]);
        return rowCount > 0;
    }
}
