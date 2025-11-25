import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Express Request interface to include the user property
declare global {
    namespace Express {
        interface Request {
            user?: { id: number };
        }
    }
}

class AuthMiddleware {
    public authenticateToken(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token == null) {
            return res.status(401).json({ message: 'Authentication token required.' });
        }

        jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid or expired token.' });
            }
            req.user = user as { id: number };
            next();
        });
    }
}

export default new AuthMiddleware();
