import { Router } from 'express';
import TagController from '../controllers/TagController';
import AuthMiddleware from '../middleware/AuthMiddleware';

class TagRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.use(AuthMiddleware.authenticateToken);

        this.router.post('/', TagController.addTag);
        this.router.get('/', TagController.viewTags);
        this.router.delete('/:id', TagController.removeTag);
    }
}

export default new TagRoutes().router;
