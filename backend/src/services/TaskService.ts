import { Task } from '../models/Task';
import TaskRepository from '../repositories/TaskRepository';

class TaskService {
    public async createTask(taskData: Omit<Task, 'taskID' | 'createdAt' | 'updatedAt'>): Promise<Task> {
        const task = new Task(
            taskData.title,
            taskData.description,
            taskData.dueDate,
            taskData.priority,
            taskData.status,
            taskData.userID
        );
        return TaskRepository.create(task);
    }

    public async getTasksForUser(userId: number): Promise<Task[]> {
        return TaskRepository.findByUserId(userId);
    }

    public async getTaskById(taskId: number): Promise<Task | null> {
        return TaskRepository.findById(taskId);
    }

    public async editTask(taskId: number, taskData: Partial<Task>): Promise<Task | null> {
        taskData.updatedAt = new Date();
        return TaskRepository.update(taskId, taskData);
    }

    public async deleteTask(taskId: number): Promise<boolean> {
        return TaskRepository.delete(taskId);
    }

    public async setDueDate(taskId: number, dueDate: Date): Promise<Task | null> {
        return this.editTask(taskId, { dueDate });
    }

    public async markComplete(taskId: number): Promise<Task | null> {
        return this.editTask(taskId, { status: 'Completed' });
    }
}

export default new TaskService();
