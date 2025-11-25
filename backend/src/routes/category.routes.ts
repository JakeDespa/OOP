import { Router } from 'express';
import CategoryController from '../controllers/CategoryController';
import AuthMiddleware from '../middleware/AuthMiddleware';

class CategoryRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.use(AuthMiddleware.authenticateToken);

        this.router.post('/', CategoryController.addCategory);
        this.router.get('/', CategoryController.viewCategories);
        this.router.put('/:id', CategoryController.editCategory);
        this.router.delete('/:id', CategoryController.deleteCategory);
    }
}

export default new CategoryRoutes().router;
