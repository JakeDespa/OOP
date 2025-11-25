import { Request, Response } from 'express';
import TagService from '../services/TagService';

class TagController {
    public async addTag(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const tag = await TagService.addTag({ ...req.body, userID: userId });
            res.status(201).json(tag);
        } catch (error) {
            res.status(500).json({ message: 'Server error adding tag' });
        }
    }

    public async viewTags(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const tags = await TagService.getTagsForUser(userId);
            res.status(200).json(tags);
        } catch (error) {
            res.status(500).json({ message: 'Server error fetching tags' });
        }
    }

    public async removeTag(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            await TagService.removeTag(Number(id));
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Server error removing tag' });
        }
    }
}

export default new TagController();
