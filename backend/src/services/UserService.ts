import { User } from '../models/User';
import UserRepository from '../repositories/UserRepository';

class UserService {
    public async updateProfile(userId: number, userData: Partial<User>): Promise<User | null> {
        // Ensure password is not updated directly through this method
        if (userData.password) {
            delete userData.password;
        }
        return UserRepository.update(userId, userData);
    }

    public async getUserById(userId: number): Promise<User | null> {
        const user = await UserRepository.findById(userId);
        if (user) {
            user.password = ''; // Don't send password
        }
        return user;
    }
}

export default new UserService();
