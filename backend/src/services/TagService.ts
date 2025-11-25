import { Tag } from '../models/Tag';
import TagRepository from '../repositories/TagRepository';

class TagService {
    public async addTag(tagData: Omit<Tag, 'tagID'>): Promise<Tag> {
        const tag = new Tag(
            tagData.name,
            tagData.userID
        );
        return TagRepository.create(tag);
    }

    public async getTagsForUser(userId: number): Promise<Tag[]> {
        return TagRepository.findByUserId(userId);
    }

    public async removeTag(tagId: number): Promise<boolean> {
        return TagRepository.delete(tagId);
    }
}

export default new TagService();
