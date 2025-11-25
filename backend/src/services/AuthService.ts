import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import UserRepository from '../repositories/UserRepository';

class AuthService {
    public async register(user: User): Promise<User> {
        const existingUser = await UserRepository.findByEmail(user.email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser = new User(user.name, user.email, hashedPassword);
        
        return UserRepository.create(newUser);
    }

    public async login(email: string, password: string): Promise<{ token: string; user: User }> {
        const user = await UserRepository.findByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign({ id: user.userID, email: user.email }, process.env.JWT_SECRET!, {
            expiresIn: '1h',
        });

        // It's good practice to not send the password back
        user.password = ''; 

        return { token, user };
    }
}

export default new AuthService();
