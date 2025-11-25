import { Tag } from '../models/Tag';
import { BaseRepository } from './BaseRepository';
import db from '../database/db';

class TagRepository extends BaseRepository<Tag> {
    constructor() {
        super('tags', 'tagid');
    }

    async findByUserId(userId: number): Promise<Tag[]> {
        const { rows } = await db.query(`SELECT * FROM ${this.tableName} WHERE userid = $1`, [userId]);
        return rows;
    }
}

export default new TagRepository();
