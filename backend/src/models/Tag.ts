export class Tag {
    public tagID: number;
    public name: string;
    public userID: number;

    constructor(name: string, userID: number, tagID?: number) {
        this.tagID = tagID || 0;
        this.name = name;
        this.userID = userID;
    }
}
