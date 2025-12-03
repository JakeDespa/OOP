import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { User } from '../models/User';
import { Task } from '../models/Task';
import { Category } from '../models/Category';
import { Tag } from '../models/Tag';

const API_BASE_URL = 'http://localhost:5000/api';

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
        });

        this.client.interceptors.request.use(this.authInterceptor);
    }

    private authInterceptor(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }

    // --- Auth ---
    public async register(userData: any): Promise<User> {
        const { data } = await this.client.post('/auth/register', userData);
        return new User(data.name, data.email, data.userid, data.profilepicture || data.profilePicture, data.theme, data.emailnotifications || data.emailNotifications, data.language);
    }

    public async login(credentials: any): Promise<{ token: string, user: User }> {
        const { data } = await this.client.post('/auth/login', credentials);
        const user = new User(data.user.name, data.user.email, data.user.userid, data.user.profilepicture || data.user.profilePicture, data.user.theme, data.user.emailnotifications || data.user.emailNotifications, data.user.language);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
            userID: user.userID,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
        }));
        return { token: data.token, user };
    }

    public logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    // --- User Profile ---
    public async changePassword(currentPassword: string, newPassword: string): Promise<void> {
        await this.client.post('/users/change-password', {
            currentPassword,
            newPassword,
        });
    }

    public async getUserProfile(): Promise<User> {
        const { data } = await this.client.get('/users/profile');
        return new User(data.name, data.email, data.userid, data.profilepicture || data.profilePicture, data.theme, data.emailnotifications || data.emailNotifications, data.language);
    }

    public async updateUserProfile(profileData: any): Promise<User> {
        const { data } = await this.client.put('/users/profile', profileData);
        return new User(data.name, data.email, data.userid, data.profilepicture || data.profilePicture, data.theme, data.emailnotifications || data.emailNotifications, data.language);
    }

    public async uploadProfilePicture(profilePictureBase64: string): Promise<User> {
        const { data } = await this.client.post('/users/upload-profile-picture', {
            profilePicture: profilePictureBase64,
        });
        return new User(data.name, data.email, data.userid, data.profilepicture || data.profilePicture, data.theme, data.emailnotifications || data.emailNotifications, data.language);
    }

    public async deleteProfilePicture(): Promise<void> {
        await this.client.delete('/users/profile-picture');
    }

    // --- Tasks ---
    public async getTasks(): Promise<Task[]> {
        const { data } = await this.client.get('/tasks');
        return data.map((t: any) => new Task(t.taskid, t.title, t.description, t.duedate, t.priority, t.status));
    }
    
    public async createTask(taskData: any): Promise<Task> {
        const { data } = await this.client.post('/tasks', taskData);
        return new Task(data.taskid, data.title, data.description, data.duedate, data.priority, data.status);
    }

    public async updateTask(taskId: number, taskData: any): Promise<Task> {
        const { data } = await this.client.put(`/tasks/${taskId}`, taskData);
        return new Task(data.taskid, data.title, data.description, data.duedate, data.priority, data.status);
    }

    public async deleteTask(taskId: number): Promise<void> {
        await this.client.delete(`/tasks/${taskId}`);
    }
    
    public async getTaskQRCode(taskId: number): Promise<string> {
        const { data } = await this.client.get(`/tasks/${taskId}/qrcode`);
        return data.qrCode;
    }

    // --- Categories ---
    public async getCategories(): Promise<Category[]> {
        const { data } = await this.client.get('/categories');
        return data.map((c: any) => new Category(c.categoryid, c.name, c.color));
    }
    
    public async createCategory(categoryData: any): Promise<Category> {
        const { data } = await this.client.post('/categories', categoryData);
        return new Category(data.categoryid, data.name, data.color);
    }

    // --- Tags ---
    public async getTags(): Promise<Tag[]> {
        const { data } = await this.client.get('/tags');
        return data.map((t: any) => new Tag(t.tagid, t.name));
    }
    
    public async createTag(tagData: any): Promise<Tag> {
        const { data } = await this.client.post('/tags', tagData);
        return new Tag(data.tagid, data.name);
    }
}

export default new ApiClient();
