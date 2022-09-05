interface IUser {
    id: number;
    name: string;
    username: string;
}

interface IRoom {
    id?: number;
    name: string;
    users: number[];
}

export type {
    IUser,
    IRoom
}