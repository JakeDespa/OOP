export class User {
    public userID: number;
    public name: string;
    public email: string;
    public password: string;
    public profilePicture?: string; // Base64 encoded image
    public theme?: string; // light, dark
    public emailNotifications?: boolean;
    public language?: string; // en, es, fr, etc.

    constructor(name: string, email: string, password: string, userID?: number, profilePicture?: string, theme?: string, emailNotifications?: boolean, language?: string) {
        this.userID = userID || 0;
        this.name = name;
        this.email = email;
        this.password = password;
        this.profilePicture = profilePicture;
        this.theme = theme || 'light';
        this.emailNotifications = emailNotifications !== undefined ? emailNotifications : true;
        this.language = language || 'en';
    }

    toJSON() {
        return {
            userid: this.userID,
            name: this.name,
            email: this.email,
            password: this.password,
            profilepicture: this.profilePicture || null,
            theme: this.theme || 'light',
            emailnotifications: this.emailNotifications !== undefined ? this.emailNotifications : true,
            language: this.language || 'en',
        };
    }
}
