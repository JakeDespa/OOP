import { Category } from '../models/Category';
import CategoryRepository from '../repositories/CategoryRepository';

class CategoryService {
    public async addCategory(categoryData: Omit<Category, 'categoryID'>): Promise<Category> {
        const category = new Category(
            categoryData.name,
            categoryData.color,
            categoryData.userID
        );
        return CategoryRepository.create(category);
    }

    public async getCategoriesForUser(userId: number): Promise<Category[]> {
        return CategoryRepository.findByUserId(userId);
    }

    public async editCategory(categoryId: number, categoryData: Partial<Category>): Promise<Category | null> {
        return CategoryRepository.update(categoryId, categoryData);
    }

    public async deleteCategory(categoryId: number): Promise<boolean> {
        return CategoryRepository.delete(categoryId);
    }
}

export default new CategoryService();
