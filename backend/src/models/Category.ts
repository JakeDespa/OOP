export class Category {
    public categoryID: number;
    public name: string;
    public color: string;
    public userID: number;

    constructor(name: string, color: string, userID: number, categoryID?: number) {
        this.categoryID = categoryID || 0;
        this.name = name;
        this.color = color;
        this.userID = userID;
    }
}
