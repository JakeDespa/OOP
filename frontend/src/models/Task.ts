export class Task {
    public taskID: number;
    public title: string;
    public description: string;
    public dueDate: Date;
    public priority: string;
    public status: string;

    constructor(
        taskID: number,
        title: string,
        description: string,
        dueDate: Date,
        priority: string,
        status: string
    ) {
        this.taskID = taskID;
        this.title = title;
        this.description = description;
        this.dueDate = new Date(dueDate); // Ensure it's a Date object
        this.priority = priority;
        this.status = status;
    }
}
