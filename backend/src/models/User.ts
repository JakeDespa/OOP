export class User {
    public userID: number;
    public name: string;
    public email: string;
    public password: string;

    constructor(name: string, email: string, password: string, userID?: number) {
        this.userID = userID || 0;
        this.name = name;
        this.email = email;
        this.password = password;
    }
}
