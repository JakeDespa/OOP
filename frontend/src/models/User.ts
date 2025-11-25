export class User {
    public userID: number;
    public name: string;
    public email: string;

    constructor(name: string, email: string, userID: number) {
        this.userID = userID;
        this.name = name;
        this.email = email;
    }
}
