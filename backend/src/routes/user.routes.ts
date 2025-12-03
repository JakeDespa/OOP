import { Router } from 'express';
import UserController from '../controllers/UserController';
import AuthMiddleware from '../middleware/AuthMiddleware';

class UserRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.use(AuthMiddleware.authenticateToken);
        this.router.get('/profile', UserController.viewProfile);
        this.router.put('/profile', UserController.updateProfile);
        this.router.post('/change-password', UserController.changePassword);
        this.router.post('/upload-profile-picture', UserController.uploadProfilePicture);
        this.router.delete('/profile-picture', UserController.deleteProfilePicture);
    }
}

export default new UserRoutes().router;
