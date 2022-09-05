import { IRoom } from "../../commun/types";


const apiUrl = process.env.NEXT_PUBLIC_API_URL;

async function getAllUsers() {
    const response = await fetch(`${apiUrl}user/users`);
    const data = await response.json();
    console.log(data);
    return data.map((user: any) => user.username);
}

async function getUserByUsername(username: string) {
    const response = await fetch(`${apiUrl}user/${username}`);
    const data = await response.json();
    return data;
}

export {
    getAllUsers,
    getUserByUsername
}