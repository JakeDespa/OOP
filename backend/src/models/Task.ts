export class Task {
    public taskID: number;
    public title: string;
    public description: string;
    public dueDate: Date;
    public priority: string;
    public status: string;
    public createdAt: Date;
    public updatedAt: Date;
    public userID: number;
    public categoryID: number | null;

    constructor(
        title: string,
        description: string,
        dueDate: Date,
        priority: string,
        status: string,
        userID: number,
        taskID?: number,
        createdAt?: Date,
        updatedAt?: Date,
        categoryID?: number,
    ) {
        this.taskID = taskID || 0;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.status = status;
        this.userID = userID;
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
        this.categoryID = categoryID || null;
    }
}
