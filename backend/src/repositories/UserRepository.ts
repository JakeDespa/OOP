import { User } from '../models/User';
import { BaseRepository } from './BaseRepository';
import db from '../database/db';

class UserRepository extends BaseRepository<User> {
    constructor() {
        super('users', 'userid');
    }

    async findByEmail(email: string): Promise<User | null> {
        const { rows } = await db.query(`SELECT * FROM ${this.tableName} WHERE email = $1`, [email]);
        if (rows.length === 0) {
            return null;
        }
        const row = rows[0];
        return new User(row.name, row.email, row.password, row.userid);
    }

    async create(user: User): Promise<User> {
        const { name, email, password } = user;
        const { rows } = await db.query(
            `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`,
            [name, email, password]
        );
        const newUser = rows[0];
        return new User(newUser.name, newUser.email, newUser.password, newUser.userid);
    }
}

export default new UserRepository();
