import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import UserRepository from '../repositories/UserRepository';

class UserService {
    private readonly MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

    public async updateProfile(userId: number, userData: Partial<User>): Promise<User | null> {
        // Ensure password is not updated directly through this method
        if (userData.password) {
            delete userData.password;
        }
        if (userData.profilePicture) {
            delete userData.profilePicture;
        }
        const updatedUser = await UserRepository.update(userId, userData);
        
        // Ensure userID is set
        if (updatedUser && !updatedUser.userID) {
            updatedUser.userID = userId;
        }
        
        return updatedUser;
    }

    public async getUserById(userId: number): Promise<User | null> {
        const user = await UserRepository.findById(userId);
        if (user) {
            user.password = ''; // Don't send password
            // Ensure userID is set
            if (!user.userID) {
                user.userID = userId;
            }
            // Ensure profilePicture is included in response
            if (!user.profilePicture) {
                user.profilePicture = null as any;
            }
        }
        return user;
    }

    public async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
        const user = await UserRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid current password');
        }

        // Hash and update new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await UserRepository.update(userId, user);
    }

    public async updateProfilePicture(userId: number, profilePictureBase64: string): Promise<User | null> {
        // Validate Base64 string
        if (!profilePictureBase64.match(/^data:image\/(jpeg|jpg|png|gif|webp);base64,/)) {
            throw new Error('Invalid image format. Supported formats: JPEG, PNG, GIF, WebP');
        }

        // Check image size (Base64 is ~33% larger than binary)
        const binarySize = Math.ceil((profilePictureBase64.length * 3) / 4);
        if (binarySize > this.MAX_IMAGE_SIZE) {
            throw new Error('Image size exceeds 5MB limit');
        }

        const user = await UserRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Update only the profile picture
        const updatedUser = await UserRepository.update(userId, {
            profilePicture: profilePictureBase64,
        } as Partial<User>);

        if (updatedUser) {
            updatedUser.password = ''; // Don't send password
            // Ensure userID is set
            if (!updatedUser.userID) {
                updatedUser.userID = userId;
            }
        }

        return updatedUser;
    }

    public async deleteProfilePicture(userId: number): Promise<void> {
        const user = await UserRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Delete the profile picture by setting it to null
        await UserRepository.update(userId, {
            profilePicture: null as any,
        } as Partial<User>);
    }
}

export default new UserService();
