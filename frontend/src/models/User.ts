export class User {
    public userID: number;
    public name: string;
    public email: string;
    public profilePicture?: string;
    public theme?: string; // light, dark
    public emailNotifications?: boolean;
    public language?: string; // en, es, fr, etc.

    constructor(name: string, email: string, userID: number, profilePicture?: string, theme?: string, emailNotifications?: boolean, language?: string) {
        this.userID = userID;
        this.name = name;
        this.email = email;
        this.profilePicture = profilePicture;
        this.theme = theme || 'light';
        this.emailNotifications = emailNotifications !== undefined ? emailNotifications : true;
        this.language = language || 'en';
    }
}
