import { Router } from 'express';
import TaskController from '../controllers/TaskController';
import AuthMiddleware from '../middleware/AuthMiddleware';

class TaskRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.use(AuthMiddleware.authenticateToken);
        
        this.router.post('/', TaskController.createTask);
        this.router.get('/', TaskController.viewTasks);
        this.router.put('/:id', TaskController.editTask);
        this.router.delete('/:id', TaskController.deleteTask);
        
        this.router.patch('/:id/duedate', TaskController.setDueDate);
        this.router.patch('/:id/complete', TaskController.markComplete);
        
        this.router.get('/:id/qrcode', TaskController.generateQRCode);
    }
}

export default new TaskRoutes().router;
