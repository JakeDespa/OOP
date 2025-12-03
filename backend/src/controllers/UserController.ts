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
            res.status(200).json(updatedUser?.toJSON());
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
            res.status(200).json(user.toJSON());
        } catch (error) {
            res.status(500).json({ message: 'Server error while fetching profile' });
        }
    }

    public async changePassword(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const { currentPassword, newPassword } = req.body;
            if (!currentPassword || !newPassword) {
                res.status(400).json({ message: 'Current password and new password are required' });
                return;
            }

            await UserService.changePassword(userId, currentPassword, newPassword);
            res.status(200).json({ message: 'Password changed successfully' });
        } catch (error) {
            const err = error as Error;
            if (err.message === 'Invalid current password') {
                res.status(401).json({ message: err.message });
            } else if (err.message === 'User not found') {
                res.status(404).json({ message: err.message });
            } else {
                res.status(500).json({ message: 'Server error while changing password' });
            }
        }
    }

    public async uploadProfilePicture(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const { profilePicture } = req.body;
            if (!profilePicture) {
                res.status(400).json({ message: 'Profile picture is required' });
                return;
            }

            const updatedUser = await UserService.updateProfilePicture(userId, profilePicture);
            res.status(200).json(updatedUser?.toJSON());
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ message: err.message || 'Server error while uploading profile picture' });
        }
    }

    public async deleteProfilePicture(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            await UserService.deleteProfilePicture(userId);
            res.status(200).json({ message: 'Profile picture deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Server error while deleting profile picture' });
        }
    }
}

export default new UserController();
