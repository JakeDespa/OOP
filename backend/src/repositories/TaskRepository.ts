import { Task } from '../models/Task';
import { BaseRepository } from './BaseRepository';
import db from '../database/db';

class TaskRepository extends BaseRepository<Task> {
    constructor() {
        super('tasks', 'taskid');
    }

    async findByUserId(userId: number): Promise<Task[]> {
        const { rows } = await db.query(`SELECT * FROM ${this.tableName} WHERE userid = $1`, [userId]);
        return rows;
    }
}

export default new TaskRepository();
