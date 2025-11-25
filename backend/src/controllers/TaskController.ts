import { Request, Response } from 'express';
import TaskService from '../services/TaskService';
import QRCodeGenerator from '../utils/QRCodeGenerator';

class TaskController {
    public async createTask(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const task = await TaskService.createTask({ ...req.body, userID: userId });
            res.status(201).json(task);
        } catch (error) {
            res.status(500).json({ message: 'Server error creating task' });
        }
    }

    public async viewTasks(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const tasks = await TaskService.getTasksForUser(userId);
            res.status(200).json(tasks);
        } catch (error) {
            res.status(500).json({ message: 'Server error fetching tasks' });
        }
    }

    public async editTask(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updatedTask = await TaskService.editTask(Number(id), req.body);
            res.status(200).json(updatedTask);
        } catch (error) {
            res.status(500).json({ message: 'Server error editing task' });
        }
    }

    public async deleteTask(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            await TaskService.deleteTask(Number(id));
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Server error deleting task' });
        }
    }

    public async setDueDate(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { dueDate } = req.body;
            const updatedTask = await TaskService.setDueDate(Number(id), new Date(dueDate));
            res.status(200).json(updatedTask);
        } catch (error) {
            res.status(500).json({ message: 'Server error setting due date' });
        }
    }

    public async markComplete(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updatedTask = await TaskService.markComplete(Number(id));
            res.status(200).json(updatedTask);
        } catch (error) {
            res.status(500).json({ message: 'Server error marking task as complete' });
        }
    }

    public async generateQRCode(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const task = await TaskService.getTaskById(Number(id));
            if (!task) {
                res.status(404).json({ message: 'Task not found' });
                return;
            }
            // Simple string representation of the task for the QR code
            const taskData = `Title: ${task.title}\nDescription: ${task.description}\nDue: ${task.dueDate}`;
            const qrCode = await QRCodeGenerator.generateQRCode(taskData);
            res.status(200).json({ qrCode });
        } catch (error) {
            res.status(500).json({ message: 'Server error generating QR code' });
        }
    }
}

export default new TaskController();
