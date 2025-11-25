import { Request, Response } from 'express';
import AuthService from '../services/AuthService';
import { User } from '../models/User';

class AuthController {
    public async register(req: Request, res: Response): Promise<void> {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                res.status(400).json({ message: 'Name, email, and password are required' });
                return;
            }
            const user = new User(name, email, password);
            const newUser = await AuthService.register(user);
            res.status(201).json(newUser);
        } catch (error) {
            const err = error as Error;
            if (err.message.includes('already exists')) {
                res.status(409).json({ message: err.message });
            } else {
                res.status(500).json({ message: 'Server error during registration' });
            }
        }
    }

    public async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({ message: 'Email and password are required' });
                return;
            }
            const { token, user } = await AuthService.login(email, password);
            res.status(200).json({ token, user });
        } catch (error) {
            res.status(401).json({ message: (error as Error).message });
        }
    }

    public logout(req: Request, res: Response): void {
        // For JWT, logout is typically handled on the client-side by deleting the token.
        // This endpoint can be used to formally acknowledge a logout request.
        res.status(200).json({ message: 'Logout successful' });
    }
}

export default new AuthController();
