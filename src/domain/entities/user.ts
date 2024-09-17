
export interface IUser {
    id: string;
    name: string;
    email: string;
    password: string;
    role?: "client" | "freelancer" | "admin";
    profilePicture?: string;
}

export class User implements IUser {
    public id: string;
    public name: string;
    public email: string;
    public password: string;
    public role: "client" | "freelancer" | "admin";
    public profilePicture?: string;

    constructor(
        id: string,
        name: string,
        email: string,
        passwordHash: string,
        role: "client" | "freelancer" | "admin" = "client"
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = passwordHash;
        this.role = role;
    }
}
