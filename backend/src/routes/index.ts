import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import taskRoutes from './task.routes';
import categoryRoutes from './category.routes';
import tagRoutes from './tag.routes';
import Billing from '../utils/Billing';

class TaskMateSystem {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.use('/auth', authRoutes);
        this.router.use('/users', userRoutes);
        this.router.use('/tasks', this.manageTasks());
        this.router.use('/categories', this.manageCategories());
        this.router.use('/tags', tagRoutes);
        this.router.use('/reports', this.generateReports());
    }

    public manageTasks(): Router {
        // This can be expanded with more complex task management logic
        return taskRoutes;
    }

    public manageCategories(): Router {
        // This can be expanded with more complex category management logic
        return categoryRoutes;
    }

    public generateReports(): Router {
        const reportRouter = Router();
        reportRouter.get('/cost', (req, res) => {
            // This is a simplified example of a report
            const cost = this.calculateCost();
            res.json({ report: 'Cost Analysis', cost });
        });
        return reportRouter;
    }

    public calculateCost(): number {
        return Billing.calculateCost();
    }
    
    // The authenticateUser, updateStatus, generateQRCode methods are implemented
    // in their respective services, controllers, and middleware.
    // This class acts as a high-level orchestrator of the system's routes.
}

export default new TaskMateSystem().router;
