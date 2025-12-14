import { Request, Response } from 'express';
import CategoryService from '../services/CategoryService';

class CategoryController {
    public async addCategory(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const category = await CategoryService.addCategory({ ...req.body, userID: userId });
            res.status(201).json(category);
        } catch (error) {
            res.status(500).json({ message: 'Server error adding category' });
        }
    }

    public async viewCategories(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const categories = await CategoryService.getCategoriesForUser(userId);
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ message: 'Server error fetching categories' });
        }
    }

    public async editCategory(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updatedCategory = await CategoryService.editCategory(Number(id), req.body);
            res.status(200).json(updatedCategory);
        } catch (error) {
            res.status(500).json({ message: 'Server error editing category' });
        }
    }

    public async deleteCategory(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            await CategoryService.deleteCategory(Number(id));
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Server error deleting category' });
        }
    }
}


export default new CategoryController();
