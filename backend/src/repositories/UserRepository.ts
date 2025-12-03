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
        return new User(row.name, row.email, row.password, row.userid, row.profilepicture, row.theme, row.emailnotifications, row.language);
    }

    async create(user: User): Promise<User> {
        const { name, email, password } = user;
        const { rows } = await db.query(
            `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`,
            [name, email, password]
        );
        const newUser = rows[0];
        return new User(newUser.name, newUser.email, newUser.password, newUser.userid, newUser.profilepicture, newUser.theme, newUser.emailnotifications, newUser.language);
    }

    async findById(id: number): Promise<User | null> {
        const { rows } = await db.query(`SELECT * FROM ${this.tableName} WHERE ${this.idColumn} = $1`, [id]);
        if (rows.length === 0) {
            return null;
        }
        const row = rows[0];
        return new User(row.name, row.email, row.password, row.userid, row.profilepicture, row.theme, row.emailnotifications, row.language);
    }

    async update(id: number, user: Partial<User>): Promise<User | null> {
        const updates: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        if (user.name !== undefined) {
            updates.push(`name = $${paramCount++}`);
            values.push(user.name);
        }
        if (user.email !== undefined) {
            updates.push(`email = $${paramCount++}`);
            values.push(user.email);
        }
        if (user.password !== undefined) {
            updates.push(`password = $${paramCount++}`);
            values.push(user.password);
        }
        if (user.profilePicture !== undefined) {
            updates.push(`profilepicture = $${paramCount++}`);
            values.push(user.profilePicture === null ? null : user.profilePicture);
        }
        if (user.theme !== undefined) {
            updates.push(`theme = $${paramCount++}`);
            values.push(user.theme);
        }
        if (user.emailNotifications !== undefined) {
            updates.push(`emailnotifications = $${paramCount++}`);
            values.push(user.emailNotifications);
        }
        if (user.language !== undefined) {
            updates.push(`language = $${paramCount++}`);
            values.push(user.language);
        }

        if (updates.length === 0) {
            return this.findById(id);
        }

        values.push(id);
        const query = `UPDATE ${this.tableName} SET ${updates.join(', ')} WHERE ${this.idColumn} = $${paramCount} RETURNING *`;
        const { rows } = await db.query(query, values);

        if (rows.length === 0) {
            return null;
        }

        const row = rows[0];
        return new User(row.name, row.email, row.password, row.userid, row.profilepicture, row.theme, row.emailnotifications, row.language);
    }
}

export default new UserRepository();
