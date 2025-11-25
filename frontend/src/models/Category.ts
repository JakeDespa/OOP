export class Category {
    public categoryID: number;
    public name: string;
    public color: string;

    constructor(categoryID: number, name: string, color: string) {
        this.categoryID = categoryID;
        this.name = name;
        this.color = color;
    }
}
