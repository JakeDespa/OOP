import { Category } from '../models/Category';
import { BaseRepository } from './BaseRepository';
import db from '../database/db';

class CategoryRepository extends BaseRepository<Category> {
    constructor() {
        super('categories', 'categoryid');
    }

    async findByUserId(userId: number): Promise<Category[]> {
        const { rows } = await db.query(`SELECT * FROM ${this.tableName} WHERE userid = $1`, [userId]);
        return rows;
    }
}

export default new CategoryRepository();
