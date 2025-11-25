import { Router } from 'express';
import AuthController from '../controllers/AuthController';

class AuthRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post('/register', AuthController.register);
        this.router.post('/login', AuthController.login);
        this.router.post('/logout', AuthController.logout);
    }
}

export default new AuthRoutes().router;
