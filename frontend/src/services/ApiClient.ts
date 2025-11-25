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
        return new User(data.name, data.email, data.userid);
    }

    public async login(credentials: any): Promise<{ token: string, user: User }> {
        const { data } = await this.client.post('/auth/login', credentials);
        const user = new User(data.user.name, data.user.email, data.user.userid);
        localStorage.setItem('token', data.token);
        return { token: data.token, user };
    }

    public logout(): void {
        localStorage.removeItem('token');
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
