import { Request, Response } from 'express';
import UserService from '../services/UserService';

class UserController {
    public async updateProfile(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const updatedUser = await UserService.updateProfile(userId, req.body);
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json({ message: 'Server error while updating profile' });
        }
    }

    public async viewProfile(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const user = await UserService.getUserById(userId);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: 'Server error while fetching profile' });
        }
    }
}

export default new UserController();
