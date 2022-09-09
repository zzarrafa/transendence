interface IUser {
    id: number;
    name: string;
    username: string;
}

interface IRoom {
    id: number;
    name: string;
    users: number[];
    type: string;
    isPrivate: boolean;
    password: string;
}

interface IMessage {
    id: number;
    room: number;
    user: IUser;
    content: string;
    createdAt: Date;
}

export type {
    IUser,
    IRoom,
    IMessage,
}